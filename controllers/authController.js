const User = require('./../models/userModel');
const AppError = require('../utils/AppError');
const APIFeatures = require('./../utils/APIFeatures');

const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'account created successfully',
    data: { user: user },
  });
});

module.exports = { signup };
