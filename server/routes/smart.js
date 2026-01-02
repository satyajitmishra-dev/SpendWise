const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const smartController = require('../controllers/smartController');
const multer = require('multer');

// Memory storage for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/smart/parse-text
// @desc    Parse natural language into expense data
// @access  Private
router.post('/parse-text', auth, smartController.parseText);

// @route   POST /api/smart/scan
// @desc    Scan receipt image
// @access  Private
router.post('/scan', auth, upload.single('image'), smartController.scanReceipt);

module.exports = router;
