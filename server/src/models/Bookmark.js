const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  address: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
