const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supportController = require('../controllers/supportController');

// @route   POST api/support
// @desc    Contact support
// @access  Public (Manual email for guests, auto for users)
router.post('/', supportController.contactSupport);

module.exports = router;
