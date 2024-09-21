const User = require('./../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Handler to get all users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    message: 'Users retrieved successfully!',
    data: { users: users },
  });
});

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

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
