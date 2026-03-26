const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /api/bookmarks
router.get('/', getBookmarks);

// POST /api/bookmarks
router.post('/', addBookmark);

// DELETE /api/bookmarks/:placeId
router.delete('/:placeId', removeBookmark);

module.exports = router;
