// Handler to get all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tours retrieved successfully!',
    data: { tours: '<all tours>' },
  });
};

// Handler to create a new tour
const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'New tour created successfully!',
    data: { tour: '<new tour>' },
  });
};

// Handler to get a single tour by ID
const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
};

// Handler to update a tour by ID
const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully!',
    data: { tour: `<tour: ${req.params.id}>` },
  });
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
