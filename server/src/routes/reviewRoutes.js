const express = require('express');
const router = express.Router();
const { createReview, getTourReviews } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public route to see reviews
router.get('/tour/:tourId', getTourReviews);

// Protected route to create review
router.post('/', authMiddleware, createReview);

module.exports = router;
