const User = require('./../models/userModel');
const AppError = require('../utils/AppError');
const APIFeatures = require('./../utils/APIFeatures');

const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {});

module.exports = { signup };
