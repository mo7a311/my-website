const Tour = require('../models/Tour');

// Get all tours with optional search/filters
exports.getTours = async (req, res) => {
  try {
    const { location, maxPrice, search } = req.query;
    
    let query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const tours = await Tour.find(query);
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tours', error: error.message });
  }
};

// Get single tour
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tour', error: error.message });
  }
};

// Create a new tour (Admin)
exports.createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: 'Error creating tour', error: error.message });
  }
};

// Update a tour (Admin)
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTour) return res.status(404).json({ message: 'Tour not found' });
    res.json(updatedTour);
  } catch (error) {
    res.status(400).json({ message: 'Error updating tour', error: error.message });
  }
};

// Delete a tour (Admin)
exports.deleteTour = async (req, res) => {
  try {
    const delTour = await Tour.findByIdAndDelete(req.params.id);
    if (!delTour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tour', error: error.message });
  }
};
