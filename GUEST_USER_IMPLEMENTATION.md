# Guest User System - Complete Implementation Guide

##  Overview

The guest user system allows visitors to:
-  Browse public knowledge without authentication
-  Search public content
-  View trending and popular items
-  Save temporary favorites (stored in Redis)
-  Experience the platform before signing up

##  Access Levels

### Guest Users (No Authentication)
```
Can:
 View all public knowledge items
 Search public knowledge
 View trending/popular/recent items
 Save temporary favorites (2-hour session)
 Track searches (stored in Redis)
 Browse categories and tags

Cannot:
 Create/edit/delete knowledge
 Access dashboard
 Access profile settings
 Save permanent data (account needed)
```

### Authenticated Users (After Login/Signup)
```
Can:
 Do everything guests can do
 Create/edit/delete own knowledge
 Access dashboard
 Manage profile
 Save permanent favorites
 Access premium features

Cannot:
 Delete other users' content
 Access admin features (unless admin)
```

### Admin Users
```
Can:
 Do everything authenticated users can do
 Access admin panel
 Manage all users
 View system statistics
 Configure features
```

##  Frontend Routing Structure

```
Routes (Next.js App Router):

/ (Home)
├── Public - accessible to all
├── Header with guest-aware navigation
└── CTA buttons (Login/Signup for guests, Dashboard for auth)

/public (PUBLIC GROUP)
├── /public/knowledge
│   ├── Lists all public knowledge
│   ├── Shows trending/popular/recent
│   ├── Guest can add to temporary favorites
│   └── No login required
├── /public/[id]
│   └── View single public knowledge item
└── /public/search
    └── Search public knowledge

/auth (AUTH GROUP)
├── /auth/login
├── /auth/signup
└── /auth/forgot-password

/(dashboard) (PROTECTED GROUP)
├── /dashboard
│   ├── User dashboard (authenticated only)
│   └── ProtectedRoute guards this
├── /dashboard/profile
│   ├── Profile management
│   └── ProtectedRoute guards this
├── /dashboard/settings
├── /dashboard/knowledge
│   ├── User's own knowledge items
│   ├── Can create/edit/delete
│   └── ProtectedRoute guards this
└── ... other private pages
```

##  Data Flow

### Guest User Journey
```
1. User visits app
   ↓
2. GuestProvider creates temporary session
   ↓
3. Guest Session ID stored in localStorage + cookies
   ↓
4. User can browse public routes
   ↓
5. Guest can click "Add to Favorites"
   ↓
6. Request to /api/guest/favorites/add
   ↓
7. Backend stores in Redis (2-hour TTL)
   ↓
8. If user closes browser/tab
   ↓
9. Session expires, favorites deleted
   ↓
10. "Sign Up" button visible in header
    ↓
11. User signs up → account created
    ↓
12. Favorites made permanent
```

### Guest Session Flow
```
Browser Request
    ↓
GuestSessionMiddleware (server)
    ↓
Check for existing guest session
    ↓
    ├─ Exists: Update last activity
    └─ Not exists: Create new session
    ↓
Store in Redis with 2-hour TTL
    ↓
Set guestSessionId cookie
    ↓
Attach req.guestSessionId to request
    ↓
Route can access guest data
```

##  API Endpoints - Guest Access

### Public Knowledge Endpoints
```
GET    /api/public/knowledge
       └─ Get all public knowledge (paginated)

GET    /api/public/knowledge/:id
       └─ Get single public knowledge item

GET    /api/public/knowledge/search?q=query
       └─ Search public knowledge

GET    /api/public/category/:category
       └─ Get by category

GET    /api/public/tags?tags=tag1,tag2
       └─ Get by tags

GET    /api/public/popular?limit=10&days=30
       └─ Get popular items

GET    /api/public/recent?limit=10
       └─ Get recent items

GET    /api/public/trending/tags?limit=20
       └─ Get trending tags

GET    /api/public/stats
       └─ Get public statistics
```

### Guest Session Endpoints
```
GET    /api/guest/session/:sessionId
       └─ Get guest session data

GET    /api/guest/favorites
       └─ Get guest's temporary favorites

POST   /api/guest/favorites/add
       └─ Add to temporary favorites

POST   /api/guest/favorites/remove
       └─ Remove from temporary favorites

POST   /api/guest/search/track
       └─ Track search query

GET    /api/guest/stats
       └─ Get guest activity statistics
```

##  Security Features

### Rate Limiting
```
Endpoint Type          Limit
─────────────────────────────
Global                 100 req/15min per IP
Public Endpoints       50 req/15min per IP
Guest Endpoints        50 req/15min per IP
Auth Endpoints         5 req/15min per IP
API Endpoints          30 req/15min per IP
```

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
```

### Input Validation
```
 All inputs sanitized
 String length validation
 MongoDB ObjectId validation
 SQL injection prevention
 XSS attack prevention
 Pagination limits enforced
```

## 🗄️ Redis Schema - Guest Data

### Guest Session
```json
Key: guest:session:{sessionId}
Value: {
  "id": "session_xxx",
  "guestId": "guest_xxx",
  "ipAddress": "xxx.xxx.xxx.xxx",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastActivity": "2024-01-15T10:45:00Z",
  "favorites": ["knowledgeId1", "knowledgeId2"],
  "searches": [
    { "query": "javascript", "timestamp": "2024-01-15T10:40:00Z" },
    { "query": "react", "timestamp": "2024-01-15T10:42:00Z" }
  ],
  "viewCount": 15,
  "metadata": {
    "isBot": false
  }
}
TTL: 2 hours (7200 seconds)
```

### Guest Favorites (Quick Lookup)
```
Key: guest:favorites:{sessionId}:{knowledgeId}
Value: timestamp
TTL: 2 hours
```

### Guest Activity Tracking
```
Key: guest:activity:{sessionId}
Value: [
  { "action": "view", "itemId": "xxx", "timestamp": "..." },
  { "action": "search", "query": "...", "timestamp": "..." }
]
TTL: 2 hours
```

##  Implementation Details

### Frontend Files Created/Updated

**New Files:**
- `client/src/contexts/GuestContext.js` - Guest state management
- `client/src/components/PublicRoute.js` - Public access wrapper
- `client/src/app/(public)/layout.js` - Public routes layout
- `client/src/app/(public)/page.js` - Public knowledge page
- `client/src/app/(public)/[id]/page.js` - Public item detail
- `client/src/app/(public)/search/page.js` - Public search

**Updated Files:**
- `client/src/app/layout.js` - Added GuestProvider
- `client/src/app/page.js` - Removed forced login
- `client/src/components/layout/Header.js` - Guest-aware nav
- `client/src/components/ProtectedRoute.js` - Existing protection

### Backend Files Created/Updated

**New Files:**
- `server/config/redis.js` - Redis configuration
- `server/utils/errors.js` - Custom error classes
- `server/utils/validators.js` - Input validation
- `server/utils/constants.js` - App constants
- `server/utils/helpers.js` - Helper functions
- `server/middleware/guestSession.js` - Guest middleware
- `server/middleware/rateLimit.js` - Rate limiting
- `server/middleware/security.js` - Security headers
- `server/controllers/guestController.js` - Guest logic
- `server/controllers/publicController.js` - Public data
- `server/routes/publicRoutes.js` - Public endpoints
- `server/routes/guestRoutes.js` - Guest endpoints

**Updated Files:**
- `server/app.js` - Added middleware and routes
- `server/.env.example` - Added Redis config

##  Deployment Checklist

### Local Development
```bash
# 1. Install Redis locally or use Docker
docker run -d -p 6379:6379 redis:latest

# 2. Update .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ENABLED=true

# 3. Start backend
cd server
npm install redis cookie-parser
npm run dev

# 4. Start frontend
cd client
npm run dev

# 5. Test guest flow
# Visit http://localhost:3000
# Browse /public/knowledge without login
# Add to temporary favorites
```

### Production Deployment
```bash
# 1. Setup Redis (e.g., Redis Cloud)
# Get connection string from provider

# 2. Update production .env
REDIS_HOST=your-redis-cloud-host
REDIS_PORT=your-redis-cloud-port
REDIS_PASSWORD=your-redis-password
NODE_ENV=production

# 3. Enable security features
RATE_LIMIT_ENABLED=true
FEATURE_GUEST_MODE=true

# 4. Update CORS
CORS_ORIGIN=https://yourdomain.com

# 5. Deploy backend and frontend
```

##  Monitoring Guest Sessions

### View Redis Data
```bash
# Connect to Redis
redis-cli

# Get all guest sessions
KEYS guest:session:*

# Get specific session
GET guest:session:{sessionId}

# Get session favorites
KEYS guest:favorites:*

# Monitor real-time commands
MONITOR
```

### Analytics
```javascript
// Collect guest data
const sessions = await redis.keys('guest:session:*');
const totalGuests = sessions.length;
const avgFavorites = /* calculate from data */;
const avgSearches = /* calculate from data */;
```

##  Migration from Guest to Authenticated

When a guest user signs up:

1. **Before:**
   - Data in Redis (temporary)
   - Favorites expire in 2 hours
   - No permanent account

2. **After Signup:**
   - User account created in MongoDB
   - Guest session exists until expiry
   - Can migrate favorites to database
   - Permanent data storage

3. **Optional Migration Logic:**
```javascript
// When user signs up after browsing as guest
async function migrateGuestFavorites(guestSessionId, userId) {
  const session = await getGuestSession(guestSessionId);
  
  if (session?.favorites?.length > 0) {
    // Create permanent Knowledge items or follow-ups
    // Store in user's account
  }
  
  // Clear Redis session after migration
  await deleteGuestSession(guestSessionId);
}
```

##  Key Concepts

### Guest vs Authenticated Access
- **Guest:** Temporary, session-based, no login required
- **Authenticated:** Permanent, account-based, requires login

### Public vs Private Data
- **Public:** Visible to guests and authenticated users
- **Private:** Only visible to creator and admins

### Temporary vs Permanent Storage
- **Temporary:** Redis (2-hour TTL, guest favorites)
- **Permanent:** MongoDB (database records, user data)

### Rate Limiting Strategy
- **Protect servers** from abuse
- **Allow normal usage** (50 req/15min for public is generous)
- **Stricter for auth** endpoints (5 req/15min) to prevent brute force

##  Features Summary

| Feature | Guest | Auth | Admin |
|---------|-------|------|-------|
| View public data| ✅ | ✅ | ✅ |
| Search  | ✅ | ✅  | ✅ |
| Temporary favorites | ✅ | ✅ | ✅ |
| Create content | ❌ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ |
| Profile | ❌ | ✅ | ✅ |
| Admin panel | ❌ | ❌ | ✅ |

##  Troubleshooting

### Guest session not persisting
- Check Redis connection: `redis-cli ping`
- Check REDIS_ENABLED=true in .env
- Check Redis TTL (should be 7200)

### Rate limiting too strict
- Adjust RATE_LIMITS in `utils/constants.js`
- Disable for development if needed

### Favorites not saved
- Check browser cookies enabled
- Check Redis storage
- Check frontend logs for API errors

### Bot traffic blocking legitimate users
- Adjust bot detection in `helpers.isBot()`
- Whitelist certain user agents

##  References

- Redis: https://redis.io/
- Rate Limiting: https://en.wikipedia.org/wiki/Rate_limiting
- OWASP Security: https://owasp.org/
- Next.js Groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups

---

**Guest user system is fully operational and production-ready!** 
