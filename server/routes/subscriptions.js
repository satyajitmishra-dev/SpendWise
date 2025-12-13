const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSubscriptions, addSubscription } = require('../controllers/subscriptionController');

router.get('/', auth, getSubscriptions);
router.post('/', auth, addSubscription);

module.exports = router;
