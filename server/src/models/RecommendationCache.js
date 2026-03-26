const mongoose = require('mongoose');

const recommendationCacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Array, // Stores the detailed recommended places
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // MongoDB automatically deletes documents 24h after createdAt
  }
});

module.exports = mongoose.model('RecommendationCache', recommendationCacheSchema);
