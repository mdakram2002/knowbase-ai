const express = require('express');
const guestController = require('../controllers/guestController');
const { guestSessionMiddleware } = require('../middleware/guestSession');
const { publicRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Apply middleware
router.use(guestSessionMiddleware);
router.use(publicRateLimiter);

/**
 * Guest Session Endpoints
 * For temporary guest users without authentication
 */
// Get guest session data
router.get('/session/:sessionId', guestController.getGuestSessionData);
router.post('/favorites/add', guestController.addFavorite);
router.post('/favorites/remove', guestController.removeFavorite);
router.get('/favorites', guestController.getFavorites);
router.post('/search/track', guestController.trackSearch);
router.get('/stats', guestController.getStats);

module.exports = router;
