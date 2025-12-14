const { getLoans, addLoan, updateLoan, deleteLoan } = require('../controllers/loanController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, getLoans);
router.post('/', auth, addLoan);
router.put('/:id', auth, updateLoan);
router.delete('/:id', auth, deleteLoan);

module.exports = router;
