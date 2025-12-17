const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSubscriptions, addSubscription, deleteSubscription, updateSubscription } = require('../controllers/subscriptionController');

router.get('/', auth, getSubscriptions);
router.post('/', auth, addSubscription);
router.delete('/:id', auth, deleteSubscription);
router.put('/:id', auth, updateSubscription);



module.exports = router;
