// Import dotenv to manage environment variables
const dotenv = require('dotenv').config();

// Import mongoose for database connection
const mongoose = require('mongoose');

// Import the Express application from the app module
const app = require('./app');

// Database connection
// Retrieve the local database URL from environment variables
const DATABASE_LOCAL_URL = process.env.DATABASE_LOCAL_URL;

// Connect to the MongoDB database using Mongoose
mongoose
  .connect(DATABASE_LOCAL_URL)
  .then(conn => console.log('Database connection successful'))
  .catch(err => console.log('Failed to connect to the database 🔥', err));

// Start the server on the specified port from environment variables or default to 5000
// Retrieve the port number from environment variables
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Note: Always load environment variables at the beginning of your application.
 * This ensures that all configuration settings and secrets are available for use
 * throughout your application. By loading environment variables first, you avoid
 * potential issues where configuration might be accessed before it is properly
 * loaded, leading to errors or unexpected behavior. This practice helps maintain
 * consistency and reliability in your application's configuration management.
 */
