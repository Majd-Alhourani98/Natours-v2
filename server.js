// Import dotenv to manage environment variables
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

// Load environment variables from a .env file
dotenv.config();

// Database connection
const DATABASE_LOCAL_URL = process.env.DATABASE_LOCAL_URL;

mongoose
  .connect(DATABASE_LOCAL_URL)
  .then(conn => console.log('Database connection successful'))
  .catch(err => console.log('Failed to connect to the database 🔥', err));

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
