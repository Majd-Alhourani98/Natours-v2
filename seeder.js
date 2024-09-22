const fs = require('fs');
const path = require('path');

const Tour = require('./models/tourModel');

const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data', 'data', 'tours.json'), 'utf-8')
);

const DATABASE_LOCAL_URL = process.env.DATABASE_LOCAL_URL;
mongoose
  .connect(DATABASE_LOCAL_URL)
  .then(conn => console.log('Database connection successful ✅'))
  .catch(err => console.log('Failed to connect to the database ❌', err));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded ✅');
    process.exit(); // stop the application
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Date successfully deleted ❌');
    process.exit(); // stop the application
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import' || process.argv[2] === '-I') {
  importData();
} else if (process.argv[2] === '--delete' || process.argv[2] === '-D') {
  deleteData();
}

// Process.argv return an array that continas [where the node command is located, the path to the file ]
// any thing you add after running a node file `node server --import`
// now the import will be the third element in the array
