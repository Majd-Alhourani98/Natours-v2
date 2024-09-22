const express = require('express');
const reviewController = require('./../controllers/reviewController');
const accessControl = require('./../middlewares/accessControl');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(accessControl.protect, accessControl.restrictTo('user'), reviewController.createReview);

module.exports = router;
