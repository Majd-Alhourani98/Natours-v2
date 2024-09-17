// Import necessary modules
const path = require('path'); // Provides utilities for working with file and directory paths
const express = require('express'); // Express framework for building web applications
const morgan = require('morgan'); // HTTP request logger middleware for Node.js

// Import route handlers for tours and users
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Initialize an instance of an Express application
const app = express();

// Set up morgan for logging HTTP requests
// In development mode, log HTTP requests with 'dev' format for easier debugging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serving static files
// Serve static files from the 'public' directory
// This is useful for serving assets like images, CSS files, and JavaScript files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
// This middleware parses JSON data in request bodies and makes it available in req.body
app.use(express.json());

// Mount Routers
// Define routes for tours and users with the specified base paths
app.use('/api/v1/tours', tourRouter); // All requests to /api/v1/tours will be handled by tourRouter
app.use('/api/v1/users', userRouter); // All requests to /api/v1/users will be handled by userRouter

// Export the Express application instance
// This allows the application to be imported and used in other modules (e.g., server.js)
module.exports = app;
