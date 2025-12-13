const express = require('express');
const router = express.Router();
const { initUser, loginSendOtp, signupInit, verifyOtp, loadUser, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/init', initUser);
router.post('/login-otp', loginSendOtp);
router.post('/signup-init', signupInit);
router.post('/verify-otp', verifyOtp);
router.get('/me', auth, loadUser);
router.post('/update-profile', updateProfile);

module.exports = router;
