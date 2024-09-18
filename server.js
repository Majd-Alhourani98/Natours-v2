// Import dotenv to manage environment variables
const dotenv = require('dotenv').config();

// Import mongoose for database connection
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err);
});

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
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Unhandle Rejection
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  console.log(err);
  server.close(() => process.exit(1));
});
