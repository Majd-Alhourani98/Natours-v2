const AppError = require('../utils/AppError');

// MongoDB Error
const handleCastErrorDB = err => new AppError(`Invalid ${err.path} : ${err.value}`, 400);

const handleDuplicateFieldsDB = err =>
  new AppError(`Duplicate field value: ${err.keyValue.name}. Please use another value`, 400);

const handleValidatonErrorDB = err => {
  // const errorsString = Object.values(err.errors).map(error => error.message);
  // const message = `Invalid input data. ${errorsString.join('. ')}`;

  const errors = {};
  Object.keys(err.errors).forEach(error => {
    errors[error] = err.errors[error].message;
  });

  return new AppError(JSON.stringify(errors), 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.log('ERROR 🔥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very worng',
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  // send error response

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidatonErrorDB(error);

    sendErrorProd(error, res);
  }
};
