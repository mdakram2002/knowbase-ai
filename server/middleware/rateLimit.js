const { incrAsync, getAsync } = require('../config/redis');
const { RateLimitError } = require('../utils/errors');
const helpers = require('../utils/helpers');
const CONSTANTS = require('../utils/constants');

/**
 * Create rate limiter with custom options
 */
const createRateLimiter = (maxRequests, windowSeconds) => {
  return async (req, res, next) => {
    try {
      if (!process.env.REDIS_ENABLED) {
        return next(); // Skip rate limiting if Redis is not available
      }

      const ip = helpers.getClientIp(req);
      const endpoint = req.path;
      const key = helpers.generateRateLimitKey(ip, endpoint);

      // Skip rate limiting for bots if they're crawling public data
      if (helpers.isBot(helpers.getUserAgent(req)) && req.path.includes('/public/')) {
        return next();
      }

      // Increment request count
      const requestCount = await incrAsync(key, windowSeconds);

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - requestCount),
        'X-RateLimit-Reset': new Date(Date.now() + windowSeconds * 1000).toISOString()
      });

      if (requestCount > maxRequests) {
        throw new RateLimitError(
          'Too many requests. Please try again later.',
          Math.ceil(windowSeconds / 60)
        );
      }

      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        return res.status(429).json({
          success: false,
          error: error.message,
          retryAfter: error.retryAfter,
          timestamp: new Date().toISOString()
        });
      }
      // If Redis fails, allow the request
      next();
    }
  };
};

/**
 * Global rate limiter - 100 requests per 15 minutes
 */
const globalRateLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMITS.GLOBAL,
  CONSTANTS.RATE_LIMIT_WINDOW
);

/**
 * Auth endpoints rate limiter - 5 requests per 15 minutes
 */
const authRateLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMITS.AUTH,
  CONSTANTS.RATE_LIMIT_WINDOW
);

/**
 * Public endpoints rate limiter - 50 requests per 15 minutes
 */
const publicRateLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMITS.PUBLIC,
  CONSTANTS.RATE_LIMIT_WINDOW
);

/**
 * API endpoints rate limiter - 30 requests per 15 minutes
 */
const apiRateLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMITS.API,
  CONSTANTS.RATE_LIMIT_WINDOW
);

/**
 * Custom rate limiter for specific endpoints
 */
const customRateLimiter = (maxRequests, windowSeconds = CONSTANTS.RATE_LIMIT_WINDOW) => {
  return createRateLimiter(maxRequests, windowSeconds);
};

/**
 * Check rate limit without blocking (for logging/monitoring)
 */
const checkRateLimit = async (ip, endpoint) => {
  try {
    const key = helpers.generateRateLimitKey(ip, endpoint);
    const count = await getAsync(key);
    return count || 0;
  } catch (error) {
    console.error('Error checking rate limit:', error.message);
    return 0;
  }
};

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  publicRateLimiter,
  apiRateLimiter,
  customRateLimiter,
  createRateLimiter,
  checkRateLimit
};
