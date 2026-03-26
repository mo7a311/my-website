const express = require('express');
const router = express.Router();
const { submitContact, getMessages } = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public route to submit message
router.post('/', submitContact);

// Protected admin route to read messages
router.get('/', authMiddleware, adminMiddleware, getMessages);

module.exports = router;
