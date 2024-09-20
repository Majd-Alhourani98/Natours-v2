const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const sendEmail = require('./../services/email');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  // const user = await User.create(req.body);

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    message: 'account created successfully',
    token: token,
    data: { user: user },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'logged in successfully',
    token: token,
    data: { user: user },
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
  const message = `Forgot you password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn'y forget you password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  let { resetToken } = req.params;
  resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const token = signToken(user._id);

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    token: token,
    message: 'passwords changed successfully',
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.isCorrectPassword(currentPassword))) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'password updated successfully',
    token: token,
    data: { user: user },
  });
});

const filterBody = (data, ...allowedFields) => {
  const obj = {};
  Object.keys(data).forEach(el => {
    if (allowedFields.includes(el)) obj[el] = data[el];
  });
  return obj;
};

const updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm) {
    return next(
      new AppError('This route is not for password updates, Please use /update-password', 400)
    );
  }

  const filteredBody = filterBody(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'data updated successfully',
    user: user,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'user deleted successfully',
  });
});

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
};

// .save({ validateModifiedOnly: true })
