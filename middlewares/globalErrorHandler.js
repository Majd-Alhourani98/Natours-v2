module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  // send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
