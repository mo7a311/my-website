const User = require('../models/User');

const updatePreferences = async (req, res) => {
  try {
    const { interests, maxDistance } = req.body;
    
    // req.user is set by the authMiddleware
    const userId = req.user.id;
    
    // Find user and update
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update preferences if provided
    if (interests && Array.isArray(interests)) {
      user.preferences.interests = interests;
    }
    
    if (maxDistance != null && !isNaN(maxDistance)) {
      user.preferences.maxDistance = Number(maxDistance);
    }
    
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
    
  } catch (error) {
    console.error('Error updating preferences:', error.message);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
};

const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error fetching preferences:', error.message);
    res.status(500).json({ message: 'Server error fetching preferences' });
  }
};

module.exports = {
  updatePreferences,
  getPreferences
};
