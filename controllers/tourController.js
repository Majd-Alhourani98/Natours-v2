const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');

// Handler to get all tours
const getAllTours = async (req, res) => {
  try {
    // // Pagination

    // await Tour.countDocuments() // returns the number of documents

    // Execute the Query
    // const tours = await query;

    const { query } = new APIFeatures(Tour, req.query)
      .filter()
      .select()
      .sort()
      .paginate();

    // console.log(query);

    const tours = await query;

    res.status(200).json({
      status: 'success',
      length: tours.length,
      message: 'Tours retrieved successfully!',
      data: { tours: tours },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.messge,
      error: err,
    });
  }
};

// Handler to create a new tour
const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    console.log(tour);
    res.status(201).json({
      status: 'success',
      message: 'New tour created successfully!',
      data: { tour: tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.messge,
      error: err,
    });
  }
};

// Handler to get a single tour by ID
const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    //  Tour.findById(id) is a shorthand for: Tour.findOne({_id: req.params.id})

    res.status(201).json({
      status: 'success',
      message: 'Tour retrieved successfully!',
      data: { tour: tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.messge,
      error: err,
    });
  }
};

// Handler to update a tour by ID
const updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.messge,
      error: err,
    });
  }
};

// Handler to delete a tour by ID
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      message: 'Tour deleted successfully!',
      data: null, // No content to return for DELETE request
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.messge,
      error: err,
    });
  }
};

const getTopRatedBudgetTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.select = 'name,price,ratingsAverage,summary';
  next();
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTopRatedBudgetTours,
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
