# Technical Implementation Details

## Authentication System Architecture

### Overview

The authentication system is built using:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js 14 + React 18 + Zustand/Context
- **Authentication**: JWT tokens (7-day expiry)
- **Password Security**: Bcrypt with 10 salt rounds
- **State Management**: React Context API + localStorage

## System Flow Diagrams

### Registration Flow
```
User Input (Form)
    ↓
Client-side Validation
    ↓
POST /api/auth/register
    ↓
Server Validation
    ↓
Check Email Exists
    ↓
Hash Password
    ↓
Create User in DB
    ↓
Generate JWT Token
    ↓
Return User + Token
    ↓
Save Token to localStorage
    ↓
Update Auth Context
    ↓
Redirect to Dashboard
```

### Login Flow
```
Email + Password Input
    ↓
POST /api/auth/login
    ↓
Find User by Email
    ↓
Compare Password
    ↓
Check Account Active
    ↓
Update Last Active
    ↓
Generate JWT Token
    ↓
Return User + Token
    ↓
Save Token to localStorage
    ↓
Update Auth Context
    ↓
Redirect to Dashboard
```

### Protected Route Flow
```
Access /dashboard
    ↓
ProtectedRoute Component
    ↓
Check isAuthenticated
    ↓
Check Auth Loading
    ↓
Not Authenticated? → Redirect to /auth/login
    ↓
Authenticated? → Render Component
```

### Profile Update Flow
```
Edit Form Submission
    ↓
Client Validation
    ↓
PUT /api/auth/profile
    ↓
JWT Middleware Verification
    ↓
Fetch User from DB
    ↓
Validate Input
    ↓
Update User Fields
    ↓
Save to DB
    ↓
Return Updated User
    ↓
Update Auth Context
    ↓
Show Success Toast
```

### Account Deletion Flow
```
Delete Account Form
    ↓
Password Confirmation
    ↓
Show Warning Modal
    ↓
User Confirms
    ↓
DELETE /api/auth/profile
    ↓
JWT Verification
    ↓
Verify Password
    ↓
Delete All Knowledge Items
    ↓
Delete User from DB
    ↓
Clear localStorage
    ↓
Clear Auth Context
    ↓
Logout User
    ↓
Redirect to Home
```

## Component Hierarchy

```
RootLayout
├── AuthProvider
│   └── NavbarProvider
│       ├── Header
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   ├── Auth Buttons (Guest)
│       │   └── User Menu (Authenticated)
│       └── Page Components
│           ├── Home (/)
│           ├── Auth Pages
│           │   ├── Signup (/auth/signup)
│           │   └── Login (/auth/login)
│           ├── Protected Pages
│           │   ├── Dashboard (/dashboard)
│           │   │   └── ProtectedRoute
│           │   ├── Profile (/dashboard/profile)
│           │   │   └── ProtectedRoute
│           │   └── Other Pages
│           │       └── ProtectedRoute
│           └── Public Pages
│               └── Docs (/docs)
```

## Authentication Context API

```javascript
useAuth() → {
  user: {
    _id, name, email, avatar, bio, location,
    role, preferences, socialLinks,
    lastActive, isActive, isEmailVerified,
    createdAt, updatedAt
  },
  token: "eyJhbGci...",
  loading: boolean,
  isAuthenticated: boolean,
  register: (name, email, password, passwordConfirm) → Promise,
  login: (email, password) → Promise,
  logout: () → Promise,
  updateProfile: (updates) → Promise,
  changePassword: (current, newPass, confirm) → Promise,
  deleteAllData: (password) → Promise,
  deleteProfile: (password) → Promise
}
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  avatar: String,
  bio: String (max 500 chars),
  location: String,
  role: String (enum: ['user', 'admin']),
  preferences: {
    theme: String (enum: ['light', 'dark', 'system']),
    notifications: {
      email: Boolean,
      push: Boolean
    }
  },
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String
  },
  lastActive: Date,
  isActive: Boolean,
  isEmailVerified: Boolean,
  refreshTokens: [{
    token: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Request/Response Patterns

### Success Response Pattern
```json
{
  "success": true,
  "message": "Optional message",
  "data": {
    // Response data
  }
}
```

### Error Response Pattern
```json
{
  "success": false,
  "error": "Error description"
}
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

Token Format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTA3MTAwMH0.
signature...
```

## Security Mechanisms

### 1. Password Hashing
```javascript
// Before storing
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// During login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 2. JWT Token
```javascript
// Generate
const token = jwt.sign(
  { id: userId },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify
const decoded = jwt.verify(token, JWT_SECRET);
```

### 3. CORS Protection
```javascript
const corsOptions = {
  origin: ['http://localhost:3000', 'https://knowbase-ai.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 4. Input Validation
```javascript
// Email validation
const emailRegex = /^\S+@\S+\.\S+$/;
const isValid = emailRegex.test(email);

// Password requirements
const minLength = 6;
const isSecure = password.length >= minLength;
```

## State Management

### localStorage
```javascript
// Token persistence
localStorage.setItem('authToken', token);
const token = localStorage.getItem('authToken');
localStorage.removeItem('authToken');
```

### Auth Context State
```javascript
{
  user: null | User,
  token: null | string,
  loading: boolean,
  isAuthenticated: boolean
}
```

### Updates Trigger
- Form submissions
- API responses
- Manual logout
- Token expiration (manual check)

## Error Handling

### Client-Side
```javascript
try {
  const result = await authFunction();
  toast.success('Success message');
} catch (error) {
  toast.error(error.message);
  setError(error.message);
}
```

### Server-Side
```javascript
try {
  // Operation
} catch (error) {
  console.error('Error context:', error);
  res.status(statusCode).json({
    success: false,
    error: 'User-friendly message'
  });
}
```

### Common Error Codes
- `400` - Bad Request (validation)
- `401` - Unauthorized (auth issues)
- `403` - Forbidden (permissions)
- `404` - Not Found
- `500` - Server Error

## Performance Considerations

### Database Optimization
```javascript
// Selective field retrieval
await User.findById(id).select('-password');

// Indexed queries
// Email is indexed for unique constraint
// userId is indexed for cascading deletes
```

### Frontend Optimization
```javascript
// Token caching
const token = localStorage.getItem('authToken');

// Lazy component loading
const ProtectedComponent = lazy(() => import('./component'));

// Memoization
const memoizedUser = useMemo(() => user, [user]);
```

### Network Optimization
```javascript
// Single API call per operation
// No redundant requests
// Batch deletion with MongoDB deleteMany
```

## Deployment Considerations

### Environment Setup
```bash
# Production Server
JWT_SECRET=<strong_random_string>
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
CORS_ORIGIN=https://yourdomain.com

# Production Client
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Security Checklist
- [ ] JWT_SECRET changed to strong random value
- [ ] HTTPS enabled on all endpoints
- [ ] CORS origins restricted to known domains
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] Rate limiting active
- [ ] Environment variables in secrets management
- [ ] SSL certificates valid
- [ ] CSRF protection enabled
- [ ] Content Security Policy headers set

### Scaling Considerations
- Redis session store for token validation
- Database query optimization with indexes
- Load balancing for multiple servers
- CDN for frontend assets
- Caching layer for frequently accessed data

## Testing Scenarios

### Registration Tests
- Valid data → Success
- Duplicate email → Fail
- Weak password → Fail
- Missing fields → Fail
- Invalid email format → Fail

### Login Tests
- Valid credentials → Success
- Invalid password → Fail
- Non-existent email → Fail
- Inactive account → Fail

### Profile Tests
- Update valid data → Success
- Update with empty name → Fail
- Avatar update → Success
- Bio character limit → Validated

### Deletion Tests
- Delete with correct password → Success
- Delete with wrong password → Fail
- Delete data only → Success (account remains)
- Delete account → Success (all data removed)

### Protected Route Tests
- Access with valid token → Success
- Access without token → Redirect to login
- Access with expired token → Redirect to login
- Access with invalid token → Redirect to login

## Monitoring & Logging

### Server Logs
```javascript
console.error('Error context:', error);
console.log('User action:', action, userId);
```

### Client Logs
```javascript
console.error('Auth error:', error);
console.log('Auth state change:', newState);
```

### Metrics to Track
- Registration success rate
- Login success rate
- Failed login attempts (brute force detection)
- Token refresh rate
- Profile update frequency
- Account deletion rate
- API response times
- Database query performance

## Recovery Procedures

### Lost Token
- Clear localStorage
- Login again to get new token

### Forgotten Password
- Implement forgot password flow (placeholder)
- Send reset email with temporary link

### Locked Account
- Implement account lockout after failed attempts
- Send unlock email or reset link

### Data Recovery
- Database backups (MongoDB)
- Point-in-time recovery options
- Transaction logs for audit

## Version Compatibility

### Supported Versions
- Node.js: 18.0.0+
- React: 18.2.0+
- Next.js: 14.0.0+
- MongoDB: 4.0+
- Express: 4.18+

### Breaking Changes
None yet (v1.0.0)

### Deprecated Features
None yet

---

This technical implementation provides a solid foundation for user authentication and can be extended with additional features as needed.
