const express = require('express');
const authController = require('./../controllers/authController');
const accessControl = require('./../middlewares/accessControl');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:resetToken').patch(authController.resetPassword);

router.route('/update-password').patch(accessControl.protect, authController.updatePassword);
router.route('/update-me').patch(accessControl.protect, authController.updateMe);
router.route('/delete-me').delete(accessControl.protect, authController.deleteMe);

module.exports = router;
