const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    interests: { type: [String], default: ['Historic', 'Tourism'] }, // Example defaults
    maxDistance: { type: Number, default: 5000 } // Default 5km radius
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
