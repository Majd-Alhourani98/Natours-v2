// Import necessary modules
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError');

// Import route handlers for tours and users
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

// Initialize an instance of an Express application
const app = express();

// Set up morgan for logging HTTP requests in development environment
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request body and make it available in req.body
app.use(express.json());

// Mount Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// Export the Express application instance
// This allows the application to be imported and used in other modules (e.g., server.js)
module.exports = app;
