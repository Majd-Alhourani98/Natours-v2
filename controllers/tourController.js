const Tour = require('./../models/tourModel');

// Handler to get all tours
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      length: tours.length,
      message: 'Tours retrieved successfully!',
      data: { tours: tours },
    });
  } catch (err) {
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
const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: null, // No content to return for DELETE request
  });
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};

// by default `findByIdAndUpdate` does not run the validators, and return the old document before updating
// to run the validator and get the tour document you should pass options object as a third paramters
// inside this object set the new property to new to get the new document after update
// and to run the valdiators set runValidators property to true to run the validator.
