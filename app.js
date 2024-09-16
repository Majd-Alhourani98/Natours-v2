// Import the Express framework for building the server
const express = require('express');
// Import morgan for HTTP request logging
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Import dotenv to manage environment variables
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Initialize an instance of an Express application
const app = express();

// Set up morgan for logging HTTP requests
app.use(morgan('dev'));

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
