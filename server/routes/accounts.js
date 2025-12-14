const { getAccounts, addAccount, updateAccount, deleteAccount } = require('../controllers/accountController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, getAccounts);
router.post('/', auth, addAccount);
router.put('/:id', auth, updateAccount);
router.delete('/:id', auth, deleteAccount);

module.exports = router;
