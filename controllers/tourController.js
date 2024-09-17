const Tour = require('./../models/tourModel');

// Handler to get all tours
const getAllTours = async (req, res) => {
  try {
    // Filter
    const queryObject = { ...req.query };
    const excludedFields = ['sort', 'limit', 'page', 'select'];
    excludedFields.forEach(field => delete queryObject[field]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    const filter = JSON.parse(queryString);

    let query = Tour.find(filter);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // query = query.sort('-createdAt');
    }

    // Select
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields); // Projection
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // await Tour.countDocuments() // returns the number of documents

    // Execute the Query
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
