const express = require('express');
const router = express.Router();
const { initUser, loginSendOtp, signupInit, verifyOtp, loadUser, updateProfile, setPasscode, verifyPasscode, disablePasscode, uploadAvatar, deleteAvatar } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const { triggerReminders } = require('../services/scheduler');

router.post('/init', initUser);
router.post('/login-otp', loginSendOtp);
router.post('/signup-init', signupInit);
router.post('/verify-otp', verifyOtp);
router.get('/me', auth, loadUser);
router.post('/update-profile', updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.post('/delete-avatar', auth, deleteAvatar);
router.post('/passcode/set', auth, setPasscode);
router.post('/passcode/verify', auth, verifyPasscode);
router.post('/passcode/disable', auth, disablePasscode);
router.get('/test-reminders', triggerReminders);

module.exports = router;
