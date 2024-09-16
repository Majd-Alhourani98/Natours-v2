// Import Express framework for building the server
const express = require('express');

// Import dotenv to manage environment variables
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Initialize an instance of an Express application
const app = express();

// Route handler for GET All tours   /api/v1/tours
app.get('/api/v1/tours', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Tours retrieved successfully!',
    data: { tours: '<all tours>' },
  });
});

// Route handler for POST new tour requests to /api/v1/tours
app.post('/api/v1/tours', (req, res, next) => {
  res.status(201).json({
    status: 'success',
    message: 'New tour created successfully!',
    data: { tours: '<new tours>' },
  });
});

// Route handler for GET requests to /api/v1/tours/:id
app.get('/api/v1/tours/:id', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully!',
    data: { tours: `<tour: ${req.params.id}>` },
  });
});

// Route handler for update single Tour   /api/v1/tours/:id
app.patch('/api/v1/tours/:id', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully!',
    data: { tours: `<tour: ${req.params.id}>` },
  });
});

// Route handler for GET single Tour   /api/v1/tours/:id
app.delete('/api/v1/tours/:id', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: { tours: `<tour: ${req.params.id}>` },
  });
});

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
