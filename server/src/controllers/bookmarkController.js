const Bookmark = require('../models/Bookmark');

// Get all bookmarks for the logged-in user
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookmarks, count: bookmarks.length });
  } catch (error) {
    console.error('Error fetching bookmarks:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching bookmarks' });
  }
};

// Add a new bookmark
const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeId, name, type, lat, lng, address, imageUrl } = req.body;

    // Check if it already exists
    const existing = await Bookmark.findOne({ userId, placeId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Place already bookmarked' });
    }

    const newBookmark = new Bookmark({
      userId, placeId, name, type, lat, lng, address, imageUrl
    });
    await newBookmark.save();

    res.status(201).json({ success: true, message: 'Bookmark added', data: newBookmark });
  } catch (error) {
    console.error('Error adding bookmark:', error.message);
    res.status(500).json({ success: false, message: 'Server error adding bookmark' });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeId } = req.params;

    const deleted = await Bookmark.findOneAndDelete({ userId, placeId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.status(200).json({ success: true, message: 'Bookmark removed', data: deleted });
  } catch (error) {
    console.error('Error removing bookmark:', error.message);
    res.status(500).json({ success: false, message: 'Server error removing bookmark' });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark
};
