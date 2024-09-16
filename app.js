// Import the Express framework for building the server
const express = require('express');
const morgan = require('morgan');

// Import dotenv to manage environment variables
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Initialize an instance of an Express application
const app = express();

// logging
app.use(morgan('dev'));

// Middleware to parse JSON request bodies
app.use(express.json());

// get All tours handler
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tours retrieved successfully!',
    data: { tours: '<all tours>' },
  });
};

// create new tour handler
const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'New tour created successfully!',
    data: { tour: '<new tour>' },
  });
};

// get a single tour handler
const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

// update tour handler
const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

// delete tour handler
const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: null, // No content to return for DELETE request
  });
};

// Tour routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
