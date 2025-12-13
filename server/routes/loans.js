const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLoans, addLoan, updateLoan } = require('../controllers/loanController');

router.get('/', auth, getLoans);
router.post('/', auth, addLoan);
router.put('/:id', auth, updateLoan);

module.exports = router;
