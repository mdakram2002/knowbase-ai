const { setAsync, getAsync } = require('../config/redis');
const helpers = require('../utils/helpers');
const CONSTANTS = require('../utils/constants');

/**
 * Middleware to create and track guest sessions
 * Guest users get a temporary session ID stored in Redis
 */
const guestSessionMiddleware = async (req, res, next) => {
  try {
    // Check if user is already authenticated
    if (req.userId) {
      return next();
    }

    // Check for existing guest session in cookies
    let guestSessionId = req.cookies?.guestSessionId;

    if (!guestSessionId) {
      // Create new guest session
      guestSessionId = helpers.generateSessionId();
      
      // Store guest session in Redis
      const guestSession = {
        id: guestSessionId,
        guestId: helpers.generateGuestId(),
        ipAddress: helpers.getClientIp(req),
        userAgent: helpers.getUserAgent(req),
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        favorites: [],
        searches: [],
        viewCount: 0,
        metadata: {
          isBot: helpers.isBot(helpers.getUserAgent(req))
        }
      };

      // Save to Redis with 2-hour expiry
      await setAsync(
        `${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${guestSessionId}`,
        guestSession,
        CONSTANTS.SESSION.GUEST_EXPIRY
      );

      // Set cookie (optional, can also use header)
      res.cookie('guestSessionId', guestSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: CONSTANTS.SESSION.GUEST_EXPIRY * 1000
      });
    } else {
      // Update last activity for existing session
      const session = await getAsync(`${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${guestSessionId}`);
      if (session) {
        session.lastActivity = new Date().toISOString();
        session.viewCount = (session.viewCount || 0) + 1;
        await setAsync(
          `${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${guestSessionId}`,
          session,
          CONSTANTS.SESSION.GUEST_EXPIRY
        );
      }
    }

    // Attach guest session info to request
    req.guestSessionId = guestSessionId;
    req.isGuest = true;

    next();
  } catch (error) {
    console.error('Guest session middleware error:', error.message);
    // Don't block the request even if guest session fails
    req.isGuest = true;
    next();
  }
};

/**
 * Get guest session data
 */
const getGuestSession = async (sessionId) => {
  try {
    if (!sessionId) return null;
    return await getAsync(`${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${sessionId}`);
  } catch (error) {
    console.error('Error getting guest session:', error.message);
    return null;
  }
};

/**
 * Add item to guest favorites (stored in Redis)
 */
const addGuestFavorite = async (sessionId, knowledgeId) => {
  try {
    if (!sessionId || !knowledgeId) return false;
    
    const session = await getGuestSession(sessionId);
    if (session) {
      if (!session.favorites) {
        session.favorites = [];
      }
      if (!session.favorites.includes(knowledgeId)) {
        session.favorites.push(knowledgeId);
      }
      await setAsync(
        `${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${sessionId}`,
        session,
        CONSTANTS.SESSION.GUEST_EXPIRY
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding guest favorite:', error.message);
    return false;
  }
};

/**
 * Remove item from guest favorites
 */
const removeGuestFavorite = async (sessionId, knowledgeId) => {
  try {
    if (!sessionId || !knowledgeId) return false;
    
    const session = await getGuestSession(sessionId);
    if (session && session.favorites) {
      session.favorites = session.favorites.filter(id => id !== knowledgeId);
      await setAsync(
        `${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${sessionId}`,
        session,
        CONSTANTS.SESSION.GUEST_EXPIRY
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing guest favorite:', error.message);
    return false;
  }
};

/**
 * Track guest search
 */
const trackGuestSearch = async (sessionId, query) => {
  try {
    if (!sessionId || !query) return false;
    
    const session = await getGuestSession(sessionId);
    if (session) {
      if (!session.searches) {
        session.searches = [];
      }
      session.searches.push({
        query: query.trim(),
        timestamp: new Date().toISOString()
      });
      // Keep only last 50 searches
      if (session.searches.length > 50) {
        session.searches = session.searches.slice(-50);
      }
      await setAsync(
        `${CONSTANTS.REDIS_KEYS.GUEST_SESSION}${sessionId}`,
        session,
        CONSTANTS.SESSION.GUEST_EXPIRY
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error tracking guest search:', error.message);
    return false;
  }
};

module.exports = {
  guestSessionMiddleware,
  getGuestSession,
  addGuestFavorite,
  removeGuestFavorite,
  trackGuestSearch
};
