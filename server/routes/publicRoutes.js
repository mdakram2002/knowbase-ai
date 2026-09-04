const express = require('express');
const publicController = require('../controllers/publicController');
const { publicRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Apply public rate limiter to all routes
router.use(publicRateLimiter);

/**
 * Public Knowledge Endpoints
 * All endpoints are read-only and require no authentication
 */
// Get all public knowledge (paginated)
router.get('/knowledge', publicController.getPublicKnowledge);
router.get('/knowledge/:id', publicController.getPublicKnowledgeById);
router.get('/knowledge/search', publicController.searchPublicKnowledge);
router.get('/category/:category', publicController.getByCategory);
router.get('/tags', publicController.getByTags);
router.get('/popular', publicController.getPopular);
router.get('/recent', publicController.getRecent);
router.get('/trending/tags', publicController.getTrendingTags);
router.get('/stats', publicController.getStats);

module.exports = router;
