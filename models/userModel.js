const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Please provide  a password'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm you password'],
    validate: {
      // This only create on `.save()` and `.create()`
      validator: function (val) {
        return val === this.password;
      },

      message: 'Passwords are not the same',
    },
  },

  // year-month-day
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isCorrectPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.isPasswordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }

  // false means the password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
