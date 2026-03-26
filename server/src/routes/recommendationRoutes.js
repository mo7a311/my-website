const express = require('express');
const { getNearbyRecommendations } = require('../controllers/recommendationController');
const { getAiRecommendations } = require('../controllers/aiRecommendationController');

const router = express.Router();

// GET /api/recommendations/nearby?lat=...&lng=...&radius=...
router.get('/nearby', getNearbyRecommendations);

// GET /api/recommendations/ai?category=...
router.get('/ai', getAiRecommendations);

module.exports = router;
