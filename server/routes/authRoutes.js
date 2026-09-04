const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(authMiddleware.verifyToken);

router.get('/me', authController.getCurrentUser);
router.put('/profile', authController.updateProfile);
router.post('/change-password', authController.changePassword);
router.delete('/profile', authController.deleteProfile);
router.delete('/data', authController.deleteAllData);
router.post('/logout', authController.logout);

module.exports = router;