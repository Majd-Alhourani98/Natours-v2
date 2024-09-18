const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');

const catchAsync = require('./../utils/catchAsync');

// Handler to get all tours
const getAllTours = catchAsync(async (req, res) => {
  const { query } = new APIFeatures(Tour, req.query)
    .filter()
    .select()
    .sort()
    .paginate();

  const tours = await query;

  res.status(200).json({
    status: 'success',
    length: tours.length,
    message: 'Tours retrieved successfully!',
    data: { tours: tours },
  });
});

// Handler to create a new tour
const createTour = catchAsync(async (req, res) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'New tour created successfully!',
    data: { tour: tour },
  });
});

// Handler to get a single tour by ID
const getTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  res.status(201).json({
    status: 'success',
    message: 'Tour retrieved successfully!',
    data: { tour: tour },
  });
});

// Handler to update a tour by ID
const updateTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully!',
    data: { tour: tour },
  });
});

// Handler to delete a tour by ID
const deleteTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: null, // No content to return for DELETE request
  });
});

const getTopRatedBudgetTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.select = 'name,price,ratingsAverage,summary';
  next();
};

const getToursStats = catchAsync(async (req, res) => {
  // aggregation pipline is a mongodb feature
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        // _id: null, // include all documents

        _id: { $toUpper: '$difficulty' },

        avgRating: { $avg: '$ratingsAverage' },
        minRating: { $min: '$ratingsAverage' },
        maxRating: { $max: '$ratingsAverage' },
        numRatings: { $sum: '$ratingsAverage' },

        numberOfDocuments: { $sum: 1 },

        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    {
      $sort: { avgPrice: -1 }, // 1
    },

    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        nummberOfTours: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },

    {
      $addFields: {
        month: '$_id',
      },
    },

    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: {
        nummberOfTours: -1,
      },
    },

    {
      $limit: 3,
    },
  ]);

  res.status(200).json({
    status: 'success',

    data: { plan },
  });
});

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTopRatedBudgetTours,
  getToursStats,
  getMonthlyPlan,
};

// by default `findByIdAndUpdate` does not run the validators, and return the old document before updating
// to run the validator and get the tour document you should pass options object as a third paramters
// inside this object set the new property to new to get the new document after update
// and to run the valdiators set runValidators property to true to run the validator.

// Model.prototype always means means an object created from a class

// in mongoose there are 2 ways of writing database queries
// - filter object
// - mongoose methods: Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
// - lte, lt, gte, gt

// .find return a query, and soon as we wait the query, the query will then exectue.
