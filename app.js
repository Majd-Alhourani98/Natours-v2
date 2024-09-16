// Import the Express framework for building the server
const express = require('express');

// Import dotenv to manage environment variables
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Initialize an instance of an Express application
const app = express();

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

const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'New tour created successfully!',
    data: { tour: '<new tour>' },
  });
};

const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: null, // No content to return for DELETE request
  });
};

// Route handler to GET all tours
app.get('/api/v1/tours', getAllTours);

// Route handler for CREATE a new tour
app.post('/api/v1/tours', createTour);

// Route handler for GET single tour
app.get('/api/v1/tours/:id', getTour);

// Route handler for UPDATE a tour
app.patch('/api/v1/tours/:id', updateTour);

// Route handler for DELETE a tour
app.delete('/api/v1/tours/:id', deleteTour);

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
