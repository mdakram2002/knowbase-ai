# Guest User Architecture - Comprehensive Plan

## Requirements Summary

1. **Guest Users** - Access without login
2. **Limited Access** - View public data only
3. **Public Routes** - No forced authentication
4. **Performance** - Redis for temporary sessions
5. **Security** - CORS, rate limiting, validation
6. **Scalability** - Large-scale product ready
7. **Structure** - Organized folder layout

## New Folder Structure

```
server/
├── config/
│   ├── database.js (existing)
│   ├── gemini.js (existing)
│   ├── redis.js (NEW - Redis config)
│   └── security.js (NEW - Security config)
│
├── middleware/
│   ├── auth.js (existing - update for guest)
│   ├── errorHandler.js (existing)
│   ├── guestSession.js (NEW - Guest tracking)
│   ├── rateLimit.js (NEW - Rate limiting)
│   ├── validation.js (NEW - Input validation)
│   ├── security.js (NEW - Security headers)
│   └── cors.js (NEW - CORS config)
│
├── controllers/
│   ├── authController.js (existing)
│   ├── aiController.js (existing)
│   ├── knowledgeController.js (existing)
│   ├── guestController.js (NEW - Guest actions)
│   └── publicController.js (NEW - Public data)
│
├── routes/
│   ├── authRoutes.js (existing)
│   ├── knowledgeRoutes.js (existing)
│   ├── aiRoutes.js (existing)
│   ├── publicRoutes.js (NEW - Public endpoints)
│   ├── guestRoutes.js (NEW - Guest endpoints)
│   └── index.js (NEW - Route organizer)
│
├── models/
│   ├── User.js (existing)
│   ├── Knowledge.js (existing)
│   └── GuestSession.js (NEW - Guest tracking)
│
├── services/
│   ├── KnowledgeService.js (existing)
│   ├── AIService.js (existing)
│   ├── GuestService.js (NEW - Guest logic)
│   ├── SecurityService.js (NEW - Security ops)
│   └── RedisService.js (NEW - Redis ops)
│
├── utils/
│   ├── constants.js (NEW - App constants)
│   ├── errors.js (NEW - Error classes)
│   ├── validators.js (NEW - Validation rules)
│   └── helpers.js (NEW - Helper functions)
│
├── .env.example (update with Redis)
├── server.js (existing)
└── app.js (update with new middleware)

client/
├── src/
│   ├── app/
│   │   ├── page.js (update - no forced login)
│   │   ├── layout.js (update)
│   │   ├── (public)/
│   │   │   ├── layout.js (NEW - Public layout)
│   │   │   ├── page.js (rename from dashboard)
│   │   │   ├── knowledge/
│   │   │   │   └── page.js (NEW - Public knowledge)
│   │   │   ├── [id]/
│   │   │   │   └── page.js (NEW - Public detail)
│   │   │   └── search/
│   │   │       └── page.js (NEW - Public search)
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.js (NEW)
│   │   │   ├── signup/page.js (NEW)
│   │   │   └── layout.js (NEW)
│   │   │
│   │   └── (dashboard)/
│   │       ├── layout.js (NEW)
│   │       ├── dashboard/page.js (NEW)
│   │       ├── profile/page.js (existing)
│   │       └── ... (other private pages)
│   │
│   ├── contexts/
│   │   ├── AuthContext.js (update)
│   │   ├── GuestContext.js (NEW - Guest state)
│   │   └── NavbarContext.js (existing)
│   │
│   ├── components/
│   │   ├── ProtectedRoute.js (update)
│   │   ├── GuestRoute.js (NEW - Guest allowed)
│   │   ├── PublicRoute.js (NEW - Public access)
│   │   ├── layout/
│   │   │   ├── Header.js (update)
│   │   │   └── ...
│   │   ├── auth/ (NEW folder)
│   │   ├── guest/ (NEW folder)
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useAuth.js (existing)
│   │   ├── useGuest.js (NEW)
│   │   └── usePublicData.js (NEW)
│   │
│   └── services/
│       ├── api.js (update for guest)
│       ├── guest.js (NEW)
│       └── public.js (NEW)
```

## Access Control Matrix

| Feature | Guest | Auth | Admin |
|---------|-------|------|-------|
| View Home | [OK] | [OK] | [OK] |
| View Public Knowledge | [OK] | [OK] | [OK] |
| Search Public Data | [OK] | [OK] | [OK] |
| Create Knowledge | [NO] | [OK] | [OK] |
| Edit Own Knowledge | [NO] | [OK] | [OK] |
| View Dashboard | [NO] | [OK] | [OK] |
| Manage Profile | [NO] | [OK] | [OK] |
| Access Settings | [NO] | [OK] | [OK] |
| Admin Panel | [NO] | [NO] | [OK] |
| Delete Items | [NO] | Own only | All |

## API Endpoints Structure

### Public Endpoints (No Auth Required)
```
GET    /api/public/knowledge         - List public knowledge
GET    /api/public/knowledge/:id     - Get knowledge detail
GET    /api/public/knowledge/search  - Search public knowledge
GET    /api/public/ai/query          - AI query (limited)
```

### Guest Endpoints (Optional Session)
```
POST   /api/guest/session            - Create guest session
GET    /api/guest/session/:id        - Get guest session
PUT    /api/guest/favorites          - Add to favorites (temp)
GET    /api/guest/favorites          - Get saved favorites
```

### Protected Endpoints (Auth Required)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
...
```

### Authenticated Endpoints
```
POST   /api/knowledge                - Create
GET    /api/knowledge                - List user's
PUT    /api/knowledge/:id            - Update
DELETE /api/knowledge/:id            - Delete
...
```

## Security Layers

### 1. CORS Protection
- Whitelist specific origins
- Restrict methods (GET, POST, etc.)
- Handle preflight requests

### 2. Rate Limiting
- Global: 100 req/15min per IP
- Auth endpoints: 5 req/15min per IP
- Public endpoints: 50 req/15min per IP

### 3. Input Validation
- Sanitize all inputs
- Validate data types
- Check string lengths
- Pagination limits

### 4. Security Headers
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy
- Strict-Transport-Security

### 5. API Security
- JWT token verification
- Guest session validation
- IP-based throttling
- Request logging

##  Redis Schema for Guest Sessions

```
KEY: guest:session:{sessionId}
VALUE: {
  id: string,
  ipAddress: string,
  userAgent: string,
  createdAt: timestamp,
  lastActivity: timestamp,
  favorites: [knowledgeIds],
  searches: [queries],
  metadata: {
    country: string,
    browser: string
  },
  expiresIn: 7200 (2 hours)
}

KEY: guest:favorites:{sessionId}:{knowledgeId}
VALUE: timestamp (for quick lookup)

KEY: guest:activity:{sessionId}
VALUE: [
  { action: 'view', itemId: string, timestamp },
  { action: 'search', query: string, timestamp }
]
```

##  Migration Strategy

### Phase 1: Backend Setup (Current)
1. Setup Redis configuration
2. Create middleware for guests
3. Create security middleware
4. Implement rate limiting
5. Add public endpoints

### Phase 2: Frontend Update
1. Update routing structure (group by public/auth/dashboard)
2. Remove forced login redirects
3. Add guest context
4. Update navigation

### Phase 3: Integration
1. Connect frontend to guest endpoints
2. Test guest and auth flows
3. Performance optimization

### Phase 4: Documentation
1. API documentation
2. Security guidelines
3. Deployment guide

##  Performance Considerations

### Redis Usage
- Store temporary guest data
- Cache public knowledge
- Rate limit tracking
- Session management

### Caching Strategy
- Cache public items (5 min)
- Cache search results (2 min)
- Cache user data (1 min for auth)

### Database Optimization
- Index public flag
- Index creation date
- Paginate results (max 50 per page)
- Select only needed fields

##  Large-Scale Readiness

   CORS properly configured
   Rate limiting implemented
   Input validation on all endpoints
   Security headers enabled
   Redis for performance
   Organized folder structure
   Error handling standardized
   Logging and monitoring ready
   Scalable architecture
   Guest and auth separation

---

##  Implementation Order

1. Create folder structure
2. Setup Redis config
3. Create security middleware
4. Create guest system
5. Create public endpoints
6. Update frontend routing
7. Test all flows
8. Documentation

This architecture supports:
- Thousands of daily guest users
- Efficient caching
- Secure data access
- Clear separation of concerns
- Easy maintenance and scaling
