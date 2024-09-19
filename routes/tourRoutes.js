const express = require('express');
const tourController = require('./../controllers/tourController');
const accessControl = require('./../middlewares/accessControl');

const router = express.Router();

router
  .route('/top-rated-budget-tours')
  .get(tourController.getTopRatedBudgetTours, tourController.getAllTours);

router.route('/tours-stats').get(tourController.getToursStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(accessControl.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
