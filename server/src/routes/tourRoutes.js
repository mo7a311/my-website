const express = require('express');
const router = express.Router();
const { getTours, getTourById, createTour, updateTour, deleteTour } = require('../controllers/tourController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTours);
router.get('/:id', getTourById);

// Admin-only protected routes
router.post('/', authMiddleware, adminMiddleware, createTour);
router.put('/:id', authMiddleware, adminMiddleware, updateTour);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTour);

module.exports = router;
