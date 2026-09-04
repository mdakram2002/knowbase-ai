const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('Redis connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err.message);
    });

    // Test connection
    return new Promise((resolve, reject) => {
      redisClient.ping((err, reply) => {
        if (err) {
          console.error('Redis PING failed:', err);
          reject(err);
        } else {
          console.log('Redis PING response:', reply);
          resolve(redisClient);
        }
      });
    });
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    console.log('Continuing without Redis - guest features will be limited');
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    console.warn('Redis client not initialized');
  }
  return redisClient;
};

const setAsync = (key, value, expiresIn = null) => {
  return new Promise((resolve, reject) => {
    if (!redisClient) {
      resolve(null);
      return;
    }
    try {
      const serialized = JSON.stringify(value);
      if (expiresIn) {
        redisClient.setex(key, expiresIn, serialized, (err, reply) => {
          if (err) reject(err);
          else resolve(reply);
        });
      } else {
        redisClient.set(key, serialized, (err, reply) => {
          if (err) reject(err);
          else resolve(reply);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const getAsync = (key) => {
  return new Promise((resolve, reject) => {
    if (!redisClient) {
      resolve(null);
      return;
    }
    redisClient.get(key, (err, reply) => {
      if (err) reject(err);
      else {
        try {
          resolve(reply ? JSON.parse(reply) : null);
        } catch (e) {
          resolve(reply);
        }
      }
    });
  });
};

const deleteAsync = (key) => {
  return new Promise((resolve, reject) => {
    if (!redisClient) {
      resolve(null);
      return;
    }
    redisClient.del(key, (err, reply) => {
      if (err) reject(err);
      else resolve(reply);
    });
  });
};

const incrAsync = (key, expiresIn = 3600) => {
  return new Promise((resolve, reject) => {
    if (!redisClient) {
      resolve(1);
      return;
    }
    redisClient.incr(key, (err, reply) => {
      if (err) reject(err);
      else {
        if (reply === 1) {
          redisClient.expire(key, expiresIn, (err) => {
            if (err) reject(err);
            else resolve(reply);
          });
        } else {
          resolve(reply);
        }
      }
    });
  });
};

module.exports = {
  connectRedis,
  getRedisClient,
  setAsync,
  getAsync,
  deleteAsync,
  incrAsync
};
