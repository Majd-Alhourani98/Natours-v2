// Import dotenv to manage environment variables
const dotenv = require('dotenv');
const app = require('./app');

// Load environment variables from a .env file
dotenv.config();

// Start the server on the specified port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
