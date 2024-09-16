// Import the Express framework for building the server
const express = require('express');
// Import morgan for HTTP request logging
const morgan = require('morgan');

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

// Handler to get all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tours retrieved successfully!',
    data: { tours: '<all tours>' },
  });
};

// Handler to create a new tour
const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'New tour created successfully!',
    data: { tour: '<new tour>' },
  });
};

// Handler to get a single tour by ID
const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

// Handler to update a tour by ID
const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

// Handler to delete a tour by ID
const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: null, // No content to return for DELETE request
  });
};

// Handler to get all users
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Users retrieved successfully!',
    data: { users: '<all users>' },
  });
};

// Handler to create a new user
const createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'New user created successfully!',
    data: { user: '<new user>' },
  });
};

// Handler to get a single user by ID
const getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully!',
    data: { user: `<user: ${req.params.id}>` },
  });
};

// Handler to update a user by ID
const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully!',
    data: { user: `<user: ${req.params.id}>` },
  });
};

// Handler to delete a user by ID
const deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'User deleted successfully!',
    data: null, // No content to return for DELETE request
  });
};

// Define routes for tours
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Define routes for users
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
