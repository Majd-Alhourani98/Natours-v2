// Import Express
const express = require('express');

// Import dotenv to load environment variables
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Retrieve and send all tour data with a success message
app.get('/api/v1/tours', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Tours retrieved successfully!',
    data: { tours: '<all tours>' },
  });
});

// Start the server on the specified port or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
