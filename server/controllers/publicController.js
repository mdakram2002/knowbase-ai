const Knowledge = require('../models/Knowledge');
const helpers = require('../utils/helpers');
const validators = require('../utils/validators');
const { NotFoundError } = require('../utils/errors');
const CONSTANTS = require('../utils/constants');

/**
 * Get public knowledge items (paginated)
 */
const getPublicKnowledge = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const { page: p, limit: l, skip } = helpers.parsePagination(page, limit);

    // Build query for public items
    const query = { isPublic: true, isActive: true };

    // Get total count
    const total = await Knowledge.countDocuments(query);

    // Fetch paginated results
    const items = await Knowledge.find(query)
      .select('-userId -isPrivate')
      .sort(sort)
      .skip(skip)
      .limit(l)
      .lean()
      .exec();

    res.json(helpers.createPaginatedResponse(items, p, l, total));
  } catch (error) {
    console.error('Error fetching public knowledge:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch public knowledge'));
  }
};

/**
 * Get single public knowledge item by ID
 */
const getPublicKnowledgeById = async (req, res) => {
  try {
    const { id } = req.params;

    validators.mongoId(id, 'id');

    const item = await Knowledge.findById(id)
      .select('-userId -isPrivate')
      .lean()
      .exec();

    if (!item || !item.isPublic || !item.isActive) {
      throw new NotFoundError('Knowledge item not found');
    }

    res.json(helpers.createSuccessResponse(item));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error fetching knowledge:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch knowledge item'));
  }
};

/**
 * Search public knowledge
 */
const searchPublicKnowledge = async (req, res) => {
  try {
    const { q, page = 1, limit = 20, category, tags } = req.query;

    if (!q) {
      throw new Error('Search query is required');
    }

    validators.searchQuery(q);

    const { page: p, limit: l, skip } = helpers.parsePagination(page, limit);

    // Build search query
    let query = {
      isPublic: true,
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    // Add category filter if provided
    if (category) {
      validators.sanitize(category);
      query.category = category;
    }

    // Add tags filter if provided
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagList };
    }

    // Get total count
    const total = await Knowledge.countDocuments(query);

    // Fetch results
    const results = await Knowledge.find(query)
      .select('-userId -isPrivate')
      .sort('-createdAt')
      .skip(skip)
      .limit(l)
      .lean()
      .exec();

    res.json(helpers.createPaginatedResponse(results, p, l, total));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error searching knowledge:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to search knowledge'));
  }
};

/**
 * Get knowledge by category (public only)
 */
const getByCategory = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    if (!category) {
      throw new Error('Category is required');
    }

    validators.sanitize(category);

    const { page: p, limit: l, skip } = helpers.parsePagination(page, limit);

    const query = {
      isPublic: true,
      isActive: true,
      category: category
    };

    const total = await Knowledge.countDocuments(query);

    const items = await Knowledge.find(query)
      .select('-userId -isPrivate')
      .sort('-createdAt')
      .skip(skip)
      .limit(l)
      .lean()
      .exec();

    res.json(helpers.createPaginatedResponse(items, p, l, total));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error fetching by category:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch by category'));
  }
};

/**
 * Get knowledge by tags (public only)
 */
const getByTags = async (req, res) => {
  try {
    const { tags, page = 1, limit = 20 } = req.query;

    if (!tags) {
      throw new Error('Tags are required');
    }

    const tagList = Array.isArray(tags) ? tags : [tags];
    
    tagList.forEach(tag => {
      validators.sanitize(tag);
    });

    const { page: p, limit: l, skip } = helpers.parsePagination(page, limit);

    const query = {
      isPublic: true,
      isActive: true,
      tags: { $in: tagList }
    };

    const total = await Knowledge.countDocuments(query);

    const items = await Knowledge.find(query)
      .select('-userId -isPrivate')
      .sort('-createdAt')
      .skip(skip)
      .limit(l)
      .lean()
      .exec();

    res.json(helpers.createPaginatedResponse(items, p, l, total));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error fetching by tags:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch by tags'));
  }
};

/**
 * Get popular public knowledge items
 */
const getPopular = async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    validators.number(limit, 1, 100, 'limit');
    validators.number(days, 1, 365, 'days');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const items = await Knowledge.find({
      isPublic: true,
      isActive: true,
      createdAt: { $gte: cutoffDate }
    })
      .select('-userId -isPrivate')
      .sort('-views')
      .limit(parseInt(limit))
      .lean()
      .exec();

    res.json(helpers.createSuccessResponse(items));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(helpers.createErrorResponse(error.message, error.code));
    }
    console.error('Error fetching popular:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch popular items'));
  }
};

/**
 * Get recent public knowledge items
 */
const getRecent = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    validators.number(limit, 1, 100, 'limit');

    const { page: p, limit: l, skip } = helpers.parsePagination(page, limit);

    const total = await Knowledge.countDocuments({ isPublic: true, isActive: true });

    const items = await Knowledge.find({ isPublic: true, isActive: true })
      .select('-userId -isPrivate')
      .sort('-createdAt')
      .skip(skip)
      .limit(l)
      .lean()
      .exec();

    res.json(helpers.createPaginatedResponse(items, p, l, total));
  } catch (error) {
    console.error('Error fetching recent:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch recent items'));
  }
};

/**
 * Get trending tags
 */
const getTrendingTags = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    validators.number(limit, 1, 100, 'limit');

    const tags = await Knowledge.aggregate([
      { $match: { isPublic: true, isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(helpers.createSuccessResponse(
      tags.map(t => ({ tag: t._id, count: t.count }))
    ));
  } catch (error) {
    console.error('Error fetching trending tags:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch trending tags'));
  }
};

/**
 * Get statistics about public knowledge
 */
const getStats = async (req, res) => {
  try {
    const totalPublic = await Knowledge.countDocuments({ isPublic: true });
    const totalCategories = await Knowledge.distinct('category', { isPublic: true });
    const totalTags = await Knowledge.distinct('tags', { isPublic: true });

    const stats = {
      totalPublicItems: totalPublic,
      totalCategories: totalCategories.length,
      totalUniqueTags: totalTags.length,
      lastUpdated: new Date().toISOString()
    };

    res.json(helpers.createSuccessResponse(stats));
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json(helpers.createErrorResponse('Failed to fetch statistics'));
  }
};

module.exports = {
  getPublicKnowledge,
  getPublicKnowledgeById,
  searchPublicKnowledge,
  getByCategory,
  getByTags,
  getPopular,
  getRecent,
  getTrendingTags,
  getStats
};
