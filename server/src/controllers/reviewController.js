const Review = require('../models/Review');
const Tour = require('../models/Tour');

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { tour, rating, comment } = req.body;
    
    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user.id, tour });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this tour.' });
    }

    const review = new Review({
      user: req.user.id,
      tour,
      rating,
      comment
    });

    await review.save();

    // Recalculate average rating for tour
    const reviews = await Review.find({ tour });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Tour.findByIdAndUpdate(tour, { averageRating: avgRating });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
};

// Get reviews for a tour
exports.getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
