const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAccounts, addAccount } = require('../controllers/accountController');

router.get('/', auth, getAccounts);
router.post('/', auth, addAccount);

module.exports = router;
