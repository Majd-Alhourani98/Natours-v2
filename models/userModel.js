const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { select } = require('underscore');
const { use } = require('../routes/authRoutes');

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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isCorrectPassword = async function (plainPassword) {
  console.log(plainPassword, this.password);
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
