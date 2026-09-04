const { getGuestSession, addGuestFavorite, removeGuestFavorite, trackGuestSearch } = require('../middleware/guestSession');
const helpers = require('../utils/helpers');
const { ValidationError, NotFoundError } = require('../utils/errors');
const validators = require('../utils/validators');

/**
 * Get guest session data
 */
const getGuestSessionData = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    validators.string(sessionId, 1, 100, 'sessionId');

    const session = await getGuestSession(sessionId);
    if (!session) {
      throw new NotFoundError('Guest session not found');
    }

    // Don't expose sensitive data
    const sanitized = {
      id: session.id,
      guestId: session.guestId,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      favorites: session.favorites || [],
      viewCount: session.viewCount || 0
    };

    res.json(helpers.createSuccessResponse(sanitized));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error getting guest session:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to retrieve session'));
  }
};

/**
 * Add item to guest favorites
 */
const addFavorite = async (req, res) => {
  try {
    const { knowledgeId } = req.body;
    const sessionId = req.guestSessionId;

    if (!sessionId) {
      throw new ValidationError('Guest session not found', 'sessionId');
    }

    validators.mongoId(knowledgeId, 'knowledgeId');

    const success = await addGuestFavorite(sessionId, knowledgeId);
    if (!success) {
      throw new Error('Failed to add favorite');
    }

    res.json(helpers.createSuccessResponse(
      { knowledgeId, favorite: true },
      'Added to favorites'
    ));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error adding favorite:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to add favorite'));
  }
};

/**
 * Remove item from guest favorites
 */
const removeFavorite = async (req, res) => {
  try {
    const { knowledgeId } = req.body;
    const sessionId = req.guestSessionId;

    if (!sessionId) {
      throw new ValidationError('Guest session not found', 'sessionId');
    }

    validators.mongoId(knowledgeId, 'knowledgeId');

    const success = await removeGuestFavorite(sessionId, knowledgeId);
    if (!success) {
      throw new Error('Failed to remove favorite');
    }

    res.json(helpers.createSuccessResponse(
      { knowledgeId, favorite: false },
      'Removed from favorites'
    ));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error removing favorite:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to remove favorite'));
  }
};

/**
 * Get guest favorites
 */
const getFavorites = async (req, res) => {
  try {
    const sessionId = req.guestSessionId;

    if (!sessionId) {
      return res.json(helpers.createSuccessResponse({ favorites: [] }));
    }

    const session = await getGuestSession(sessionId);
    const favorites = session?.favorites || [];

    res.json(helpers.createSuccessResponse({ favorites }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to retrieve favorites'));
  }
};

/**
 * Track guest search
 */
const trackSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const sessionId = req.guestSessionId;

    if (!sessionId) {
      return res.json(helpers.createSuccessResponse({ tracked: false }));
    }

    if (!query) {
      throw new ValidationError('Search query is required', 'query');
    }

    validators.string(query, 1, 500, 'query');

    await trackGuestSearch(sessionId, query);

    res.json(helpers.createSuccessResponse({ tracked: true }));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error tracking search:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to track search'));
  }
};

/**
 * Get guest activity statistics
 */
const getStats = async (req, res) => {
  try {
    const sessionId = req.guestSessionId;

    if (!sessionId) {
      return res.json(helpers.createSuccessResponse({
        viewCount: 0,
        searchCount: 0,
        favoriteCount: 0
      }));
    }

    const session = await getGuestSession(sessionId);

    const stats = {
      viewCount: session?.viewCount || 0,
      searchCount: session?.searches?.length || 0,
      favoriteCount: session?.favorites?.length || 0,
      sessionDuration: session ? new Date() - new Date(session.createdAt) : 0
    };

    res.json(helpers.createSuccessResponse(stats));
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to retrieve statistics'));
  }
};

module.exports = {
  getGuestSessionData,
  addFavorite,
  removeFavorite,
  getFavorites,
  trackSearch,
  getStats
};
