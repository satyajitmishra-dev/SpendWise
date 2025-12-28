const express = require('express');
const router = express.Router();
const { initUser, loginSendOtp, signupInit, resendSignupOtp, verifyOtp, loadUser, updateProfile, setPasscode, verifyPasscode, disablePasscode, forgotPasscode, resetPasscode, uploadAvatar, deleteAvatar, resetDataInit, resetDataConfirm, refreshToken, markLandingSeen } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const { triggerReminders } = require('../services/scheduler');

router.post('/init', initUser);
router.post('/login-otp', loginSendOtp);
router.post('/signup-init', signupInit);
router.post('/signup-resend', require('../controllers/authController').resendSignupOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh', refreshToken);
router.get('/me', auth, loadUser);
router.post('/update-profile', updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.post('/delete-avatar', auth, deleteAvatar);
router.post('/passcode/set', auth, setPasscode);
router.post('/passcode/verify', auth, verifyPasscode);
router.post('/passcode/disable', auth, disablePasscode);
router.post('/passcode/forgot', auth, forgotPasscode);
router.post('/passcode/reset', auth, resetPasscode);
router.post('/reset-data/init', auth, resetDataInit);
router.post('/reset-data/confirm', auth, resetDataConfirm);
router.post('/firebase', require('../controllers/authController').firebaseLogin); // New Firebase Endpoint
router.post('/mark-landing-seen', auth, markLandingSeen); // Mark Landing as Seen
router.get('/test-reminders', triggerReminders);

module.exports = router;
