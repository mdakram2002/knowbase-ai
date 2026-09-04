# KnowBase AI - Complete System Guide

> An AI-powered knowledge management platform with guest user access, enterprise-scale security, and seamless authentication.

##  Quick Overview

KnowBase AI is a production-ready knowledge management system with:
-  **Guest User System** - Browse without login
-  **Dual Access** - Guest + Authenticated paths
-  **Enterprise Security** - Rate limiting, encryption, validation
-  **Large-Scale Ready** - Redis caching, optimized databases
-  **Complete Documentation** - 5+ comprehensive guides

##  Documentation Index

### Start Here
1. **[GUEST_USER_SYSTEM_COMPLETE.md](./GUEST_USER_SYSTEM_COMPLETE.md)** ← **START HERE**
   - Complete overview of guest system
   - Deployment instructions
   - API reference
   - Trourbleshooting

### Detailed Guides
2. **[GUEST_USER_ARCHITECTURE.md](./GUEST_USER_ARCHITECTURE.md)**
   - System architecture
   - Access control matrix
   - Redis schema
   - Migration strategy

3. **[GUEST_USER_IMPLEMENTATION.md](./GUEST_USER_IMPLEMENTATION.md)**
   - File structure
   - Implementation details
   - Data flows
   - Feature checklist

4. **[LARGE_SCALE_SECURITY_GUIDE.md](./LARGE_SCALE_SECURITY_GUIDE.md)**
   - Security architecture
   - Rate limiting strategy
   - Database optimization
   - Monitoring & logging
   - Compliance standards

### Authentication System (Previous Implementation)
5. **[AUTHENTICATION.md](./AUTHENTICATION.md)**
   - Auth API endpoints
   - JWT implementation
   - User flow

6. **[QUICKSTART.md](./QUICKSTART.md)**
   - Step-by-step setup
   - Testing flows

##  Quick Start (5 Minutes)

### Prerequisites
```bash
# Required:
✓ Node.js 18+
✓ MongoDB
✓ Redis
```

### Setup

**Backend:**
```bash
cd server
npm install redis cookie-parser
cp .env.example .env
# Edit .env with your config
npm run dev
```

**Frontend:**
```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev
```

**Visit:**
- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- Docs: http://localhost:5000/api-docs

##  Access Levels

### Guest Users (No Authentication)
```
 View public knowledge - t
 Search public items - t
 Add temporary favorites (Redis) - t
 View trending/popular items- t
 Browse categories and tags - t
 Create content - f
 Access dashboard - f
 Save permanent data - f
```

### Authenticated Users
```
 All guest features
 Create/edit/delete content
 Permanent favorites
 Access dashboard
 Manage profile
 View search history
```

### Admin Users
```
 All authenticated features
 Admin panel
 User management
 System statistics
```

##  Project Structure

```
knowbase-ai/
├── server/                          ← Backend (Node.js/Express)
│   ├── config/
│   │   ├── database.js             (MongoDB)
│   │   └── redis.js                (Redis ← NEW)
│   │
│   ├── middleware/
│   │   ├── auth.js                 (JWT verification)
│   │   ├── guestSession.js         (← NEW) Guest tracking
│   │   ├── rateLimit.js            (← NEW) Rate limiting
│   │   ├── security.js             (← NEW) Security headers
│   │   └── errorHandler.js
│   │
│   ├── controllers/
│   │   ├── authController.js       (Login/signup)
│   │   ├── guestController.js      (← NEW) Guest logic
│   │   ├── publicController.js     (← NEW) Public data
│   │   └── knowledgeController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── publicRoutes.js         (← NEW) Public endpoints
│   │   ├── guestRoutes.js          (← NEW) Guest endpoints
│   │   └── knowledgeRoutes.js
│   │
│   ├── utils/
│   │   ├── errors.js               (← NEW) Error classes
│   │   ├── validators.js           (← NEW) Input validation
│   │   ├── constants.js            (← NEW) App constants
│   │   └── helpers.js              (← NEW) Helper functions
│   │
│   └── app.js                       (← Updated with security)
│
├── client/                          ← Frontend (Next.js/React)
│   └── src/
│       ├── app/
│       │   ├── (public)/            (← NEW) Public routes
│       │   │   ├── page.js         Browse knowledge
│       │   │   └── [id]/page.js    View item
│       │   ├── (auth)/              (← NEW) Auth routes
│       │   ├── (dashboard)/         (← NEW) Protected routes
│       │   ├── page.js             (← Updated) Guest-friendly home
│       │   └── layout.js           (← Updated) Added GuestProvider
│       │
│       ├── contexts/
│       │   ├── AuthContext.js      (User authentication)
│       │   ├── GuestContext.js     (← NEW) Guest state
│       │   └── NavbarContext.js
│       │
│       └── components/
│           ├── ProtectedRoute.js   (← Updated) Auth guard
│           └── PublicRoute.js      (← NEW) Guest wrapper
│
├── GUEST_USER_SYSTEM_COMPLETE.md   (← START HERE)
├── GUEST_USER_ARCHITECTURE.md
├── GUEST_USER_IMPLEMENTATION.md
├── LARGE_SCALE_SECURITY_GUIDE.md
├── AUTHENTICATION.md
└── README.md (this file)
```

##  Key API Endpoints

### Public Browsing (No Auth Required)
```
GET  /api/public/knowledge              List all public items
GET  /api/public/knowledge/:id          View single item
GET  /api/public/knowledge/search?q=    Search public items
GET  /api/public/category/:cat          Filter by category
GET  /api/public/tags?tags=             Filter by tags
GET  /api/public/trending/tags          Trending tags
GET  /api/public/stats                  Public statistics
```

### Guest Sessions (Optional Auth)
```
GET  /api/guest/session/:id             Get guest data
GET  /api/guest/favorites               Get temp favorites
POST /api/guest/favorites/add           Add to favorites
POST /api/guest/favorites/remove        Remove from favorites
POST /api/guest/search/track            Track search
GET  /api/guest/stats                   Guest statistics
```

### Authentication
```
POST /api/auth/register                 Create account
POST /api/auth/login                    Login
POST /api/auth/logout                   Logout
PUT  /api/auth/profile                  Update profile
```

### Protected Endpoints (Requires Auth)
```
GET  /api/knowledge                     User's items
POST /api/knowledge                     Create item
PUT  /api/knowledge/:id                 Edit item
DELETE /api/knowledge/:id               Delete item
```

##  Security Features

###  Implemented

**Network Security:**
- HTTPS/SSL enforcement
- CORS whitelisting
- Security headers (CSP, X-Frame-Options, HSTS, etc.)
- Rate limiting (5-100 req/15min per endpoint)

**API Security:**
- JWT authentication (7-day expiry)
- Input validation on all endpoints
- Output sanitization
- SQL injection prevention
- XSS attack prevention

**Data Security:**
- Bcryptjs password hashing (10 salt rounds)
- Secure Redis storage (2h TTL for guest data)
- Secure cookies (HttpOnly, SameSite)
- No sensitive data in logs
- Encryption-ready

**Access Control:**
- JWT token verification
- Role-based authorization (guest, user, admin)
- Protected route middleware
- Ownership verification

### Rate Limiting

```
Endpoint Category      Limit          Window
────────────────────────────────────────────
Global                 100 req        15 min
Public Browsing        50 req         15 min
Guest Sessions         50 req         15 min
Authentication         5 req          15 min  ← Brute force protection
API Endpoints          30 req         15 min
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  location: String,
  role: enum ['user', 'admin'],
  preferences: {},
  socialLinks: {},
  lastActive: Date,
  isActive: Boolean,
  refreshTokens: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Knowledge Model
```javascript
{
  title: String,
  description: String,
  content: String,
  userId: ObjectId (indexed),
  category: String (indexed),
  tags: [String] (indexed),
  isPublic: Boolean (indexed),
  isActive: Boolean (indexed),
  views: Number,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Redis Guest Session
```javascript
{
  id: String,
  guestId: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  lastActivity: Date,
  favorites: [ObjectId],
  searches: [{ query, timestamp }],
  viewCount: Number,
  metadata: {}
  // TTL: 2 hours
}
```

##  Deployment

### Local Development
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev

# Terminal 3: Redis (if local)
redis-server
```

### Production (Docker)
```bash
docker-compose up -d
# Requires: docker-compose.yml (not included)
```

### Production (Cloud Hosting)
```bash
# 1. Update .env with production values
MONGODB_URI=mongodb+srv://...
REDIS_HOST=redis-cloud-host
JWT_SECRET=production_secret
CORS_ORIGIN=https://yourdomain.com

# 2. Deploy backend
# → Heroku, Railway, Render, AWS, GCP, etc.

# 3. Deploy frontend
# → Vercel, Netlify, AWS Amplify, etc.

# 4. Setup monitoring
# → Sentry, DataDog, New Relic, etc.
```

##  System Architecture

```
                    ┌─────────────────────────────────┐
                    │        Browser (Guest)          │
                    │     (No Authentication)         │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Next.js Frontend (Public) │
                    │   - GuestProvider           │
                    │   - (public) routes         │
                    │   - No forced login         │
                    └──────────────┬──────────────┘
                                   │
    ┌──────────────────────────────┼──────────────────────────────┐
    │                              │                              │
    ▼                              ▼                              ▼
┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│  Public Routes  │    │  Auth Routes        │    │  Protected Route │
│  /api/public/*  │    │  /api/auth/*        │    │  /api/*          │
│  No Auth        │    │  No Auth (register) │    │  JWT Required    │
│  Rate: 50/15min │    │  Rate: 5/15min      │    │  Rate: 30/15min  │
└────────┬────────┘    └────────┬────────────┘    └────────┬─────────┘
         │                      │                         │
         │      Express API    │                         │
         │   with Middleware   │                         │
         │ (Security Headers,  │                         │
         │  Validation, etc.)  │                         │
         │                      │                         │
         └──────────────┬───────┴─────────────┬──────────┘
                        │                     │
           ┌────────────▼─────────┐  ┌────────▼───────┐
           │ MongoDB Database     │  │  Redis Cache   │
           │ - Users             │  │  - Guest data  │
           │ - Knowledge items   │  │  - Rate limits │
           │ - Indexed queries   │  │  - TTL: 2h     │
           └─────────────────────┘  └────────────────┘
```

##  Learning Resources

### For Backend Developers
1. Read: [LARGE_SCALE_SECURITY_GUIDE.md](./LARGE_SCALE_SECURITY_GUIDE.md)
2. Study: `server/utils/validators.js` (input validation)
3. Study: `server/middleware/rateLimit.js` (rate limiting)
4. Study: `server/config/redis.js` (Redis integration)
5. Code: `server/controllers/publicController.js` (public API)

### For Frontend Developers
1. Read: [GUEST_USER_IMPLEMENTATION.md](./GUEST_USER_IMPLEMENTATION.md)
2. Study: `client/src/contexts/GuestContext.js` (state management)
3. Study: `client/src/app/(public)/page.js` (public browsing)
4. Study: `client/src/components/ProtectedRoute.js` (auth guard)
5. Implement: Public search feature

### For DevOps/System Admins
1. Read: [LARGE_SCALE_SECURITY_GUIDE.md](./LARGE_SCALE_SECURITY_GUIDE.md) - Deployment section
2. Setup: Redis (production)
3. Setup: MongoDB (production)
4. Configure: Environment variables
5. Monitor: Health checks and logging

##  Testing

### Manual Testing Checklist

```
Guest User Flow:
  ☐ Visit app without login
  ☐ Browse /public/knowledge
  ☐ Search public items
  ☐ Add to temporary favorites
  ☐ View guest stats
  ☐ Close browser (data expires)

Sign Up Flow:
  ☐ Click "Sign Up"
  ☐ Fill form
  ☐ Verify validation
  ☐ Account created
  ☐ Redirected to dashboard

Login Flow:
  ☐ Click "Sign In"
  ☐ Enter credentials
  ☐ Token stored
  ☐ Redirected to dashboard

Protected Routes:
  ☐ Access /dashboard (needs auth)
  ☐ Try without token (redirected)
  ☐ Login, then access (allowed)

Rate Limiting:
  ☐ Make 51 public requests
  ☐ Should get 429 on 51st
  ☐ After 15min window, should work
```

## Common Issues

### Port Already in Use
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running:
redis-server
# Or use Redis Cloud (managed)
```

### MongoDB Connection Error
```bash
# Check MongoDB URI in .env
# Local: mongodb://localhost:27017/knowbase-ai
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/knowbase-ai

# Test connection:
mongosh "mongodb://localhost:27017/knowbase-ai"
```

### Guest Session Not Working
```bash
# Check Redis keys
redis-cli keys guest:*
# Should see sessions stored

# Check browser localStorage
localStorage.getItem('guestSessionId')
# Should have a session ID

# Clear and retry
localStorage.clear()
# Refresh page
```

##  Support

- **Bugs:** Create GitHub issue
- **Questions:** Check documentation files
- **Deployment:** See [LARGE_SCALE_SECURITY_GUIDE.md](./LARGE_SCALE_SECURITY_GUIDE.md)
- **API:** See `/api-docs` endpoint

##  Performance Metrics

Target performance:
- API response: < 200ms
- Page load: < 2s
- Search query: < 500ms
- Database query: < 100ms

Optimization techniques:
- Redis caching
- Database indexing
- Connection pooling
- Lazy loading
- Code splitting

##  Development Roadmap

### Completed 
-  Guest user system
-  Public data browsing
-  Rate limiting
-  Security hardening
-  Complete documentation

### Planned
- [ ] Email verification
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Advanced admin panel
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] API rate limit dashboard
- [ ] User activity logs

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

##  Acknowledgments

Built with:
- Next.js 14
- Express.js
- MongoDB
- Redis
- Tailwind CSS
- React Hot Toast
- Lucide Icons

---

**Status:** Production Ready | Security Hardened | Scalable | Fully Documented

**Last Updated:** January 2024

**Questions?** Check [GUEST_USER_SYSTEM_COMPLETE.md](./GUEST_USER_SYSTEM_COMPLETE.md) first!
