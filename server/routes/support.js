const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supportController = require('../controllers/supportController');

// @route   POST api/support
// @desc    Contact support
// @access  Private
router.post('/', auth, supportController.contactSupport);

module.exports = router;
