# System Architecture Overview

##  High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐      │
│  │              NEXT.JS FRONTEND (localhost:3000)               │       │
│  ├───────────────────────────────────────────────────────────────┤      │
│  │                                                               │      │
│  │  Pages:                                                       │      │
│  │  ├─ / (Home)                                                 │    │
│  │  ├─ /auth/signup (Signup Page)                               │    │
│  │  ├─ /auth/login (Login Page)                                 │    │
│  │  ├─ /dashboard (Protected - Dashboard)                       │    │
│  │  └─ /dashboard/profile (Protected - Profile)                 │    │
│  │                                                               │    │
│  │  Components:                                                  │    │
│  │  ├─ AuthContext (Global State)                               │    │
│  │  ├─ ProtectedRoute (Access Control)                          │    │
│  │  ├─ Header (Navigation)                                      │    │
│  │  └─ Form Components                                          │    │
│  │                                                               │    │
│  │  State:                                                       │    │
│  │  ├─ user (Current User)                                      │    │
│  │  ├─ token (JWT Token)                                        │    │
│  │  ├─ isAuthenticated (Boolean)                                │    │
│  │  └─ loading (Boolean)                                        │    │
│  │                                                               │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                ↕ (HTTP)                                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │           localStorage                                          │  │
│  │           - authToken                                          │  │
│  │           - rememberEmail (optional)                           │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↕ (HTTP with JWT)
         ┌────────────────────────────────────────────────┐
         │                   NETWORK                      │
         └────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS.JS BACKEND                               │
│                      (localhost:5000)                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Routes:                                                                │
│  ├─ POST   /api/auth/register        (Public)                          │
│  ├─ POST   /api/auth/login           (Public)                          │
│  ├─ GET    /api/auth/me              (Protected)                       │
│  ├─ PUT    /api/auth/profile         (Protected)                       │
│  ├─ POST   /api/auth/change-password (Protected)                       │
│  ├─ DELETE /api/auth/profile         (Protected)                       │
│  ├─ DELETE /api/auth/data            (Protected)                       │
│  └─ POST   /api/auth/logout          (Protected)                       │
│                                                                         │
│  Middleware:                                                            │
│  ├─ verifyToken (JWT verification)                                     │
│  ├─ optionalAuth (Optional authentication)                             │
│  ├─ errorHandler (Error handling)                                      │
│  ├─ CORS (Cross-origin protection)                                     │
│  └─ Rate Limiter (Brute force protection)                              │
│                                                                         │
│  Controllers:                                                           │
│  └─ authController                                                      │
│     ├─ register()                                                      │
│     ├─ login()                                                         │
│     ├─ getCurrentUser()                                                │
│     ├─ updateProfile()                                                │
│     ├─ changePassword()                                               │
│     ├─ deleteProfile()                                                │
│     ├─ deleteAllData()                                                │
│     └─ logout()                                                       │
│                                                                         │
│  Services:                                                              │
│  └─ JWT Token Generation & Verification                               │
│     └─ Password Hashing (bcrypt)                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↕ (MongoDB Protocol)
         ┌────────────────────────────────────────────────┐
         │                   NETWORK                      │
         └────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────────────┐
│                        MONGODB DATABASE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Collections:                                                           │
│  ├─ users                                                              │
│  │  ├─ _id (ObjectId)                                                 │
│  │  ├─ name (String)                                                  │
│  │  ├─ email (String, indexed, unique)                                │
│  │  ├─ password (String, hashed with bcrypt)                          │
│  │  ├─ avatar (String)                                                │
│  │  ├─ bio (String)                                                   │
│  │  ├─ location (String)                                              │
│  │  ├─ role (enum: user, admin)                                       │
│  │  ├─ preferences (nested object)                                    │
│  │  ├─ socialLinks (nested object)                                    │
│  │  ├─ lastActive (Date)                                              │
│  │  ├─ isActive (Boolean)                                             │
│  │  ├─ isEmailVerified (Boolean)                                      │
│  │  ├─ refreshTokens (Array)                                          │
│  │  ├─ createdAt (Date)                                               │
│  │  └─ updatedAt (Date)                                               │
│  │                                                                     │
│  └─ knowledge (cascade deleted when user deleted)                     │
│     ├─ userId (Foreign key)                                           │
│     └─ ... (other knowledge fields)                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

##  Request/Response Flow

### Registration Example
```
┌─ User enters form data
│
├─ Frontend: Form validation
│
├─ Frontend: POST /api/auth/register
│  {
│    "name": "John Doe",
│    "email": "john@example.com",
│    "password": "hashed...",
│    "passwordConfirm": "hashed..."
│  }
│
├─ Backend: Validate input
│
├─ Backend: Check email exists → No
│
├─ Backend: Hash password with bcrypt
│
├─ Backend: Create user in MongoDB
│
├─ Backend: Generate JWT token
│
├─ Backend: Response 201
│  {
│    "success": true,
│    "data": {
│      "user": {...},
│      "token": "eyJ..."
│    }
│  }
│
├─ Frontend: Save token to localStorage
│
├─ Frontend: Update AuthContext
│
└─ Frontend: Redirect to /dashboard
```

### Login Example
```
┌─ User enters email + password
│
├─ Frontend: Form validation
│
├─ Frontend: POST /api/auth/login
│  {
│    "email": "john@example.com",
│    "password": "password123"
│  }
│
├─ Backend: Find user by email
│
├─ Backend: Compare password with bcrypt
│
├─ Backend: Password matches? → Yes
│
├─ Backend: Update lastActive timestamp
│
├─ Backend: Generate JWT token
│
├─ Backend: Response 200
│  {
│    "success": true,
│    "data": {
│      "user": {...},
│      "token": "eyJ..."
│    }
│  }
│
├─ Frontend: Save token to localStorage
│
├─ Frontend: Update AuthContext with user
│
├─ Frontend: Check ProtectedRoute
│
├─ ProtectedRoute: isAuthenticated = true
│
└─ Frontend: Render /dashboard
```

### Protected Route Example
```
┌─ User navigates to /dashboard
│
├─ Frontend: Render ProtectedRoute component
│
├─ ProtectedRoute: Check localStorage for token
│
├─ ProtectedRoute: Call useAuth()
│
├─ AuthContext: Check isAuthenticated state
│
├─ AuthContext: isAuthenticated = true?
│ 
│  ├─ YES: Render Dashboard component
│  │  └─ User sees dashboard
│  │
│  └─ NO: Redirect to /auth/login
│     └─ User sees login form
│
└─ End
```

### Update Profile Example
```
┌─ User edits profile form
│
├─ Frontend: Client-side validation
│
├─ Frontend: PUT /api/auth/profile
│  Header: Authorization: Bearer eyJ...
│  Body: {
│    "name": "Jane Doe",
│    "bio": "Updated bio",
│    "location": "New York"
│  }
│
├─ Backend: JWT Middleware
│  └─ Verify token signature
│  └─ Check expiration
│  └─ Extract userId from token payload
│
├─ Backend: Validate input
│
├─ Backend: Find user by userId
│
├─ Backend: Update user fields
│
├─ Backend: Save to MongoDB
│
├─ Backend: Response 200
│  {
│    "success": true,
│    "message": "Profile updated successfully",
│    "data": {...updated user...}
│  }
│
├─ Frontend: Update AuthContext
│
├─ Frontend: Display success toast
│
└─ Frontend: Re-render with new data
```

##  Security Flow

```
Password Security:
┌──────────────┐
│ Plain Text   │
│ Password     │
└──────┬───────┘
       │ bcrypt.hash(password, salt=10)
       ↓
┌──────────────┐
│ $2b$10$...   │ ← Stored in DB
│ (Hashed)     │
└──────────────┘

Login Verification:
┌──────────────┐
│ User enters  │
│ password     │
└──────┬───────┘
       │
       ├─ bcrypt.compare(input, stored_hash)
       │
       ├─ Match? YES → Generate Token
       │         NO → Return Error
       │
       ↓
     Token
```

```
JWT Token Security:
┌─────────────────────────────────┐
│ Header: {"alg":"HS256",...}     │
├─────────────────────────────────┤
│ Payload: {"id":"507f1f77..."}   │
├─────────────────────────────────┤
│ Signature: HMACSHA256(           │
│   header.payload,               │
│   JWT_SECRET                    │
│ )                               │
└─────────────────────────────────┘
         ↓
  Sent in Authorization header
  Verified on every protected request
```

##  Data Flow Sequence

### Complete Authentication Cycle

```
[User] → [Browser] → [Frontend App] → [Backend API] → [Database]
   ↓         ↓           ↓                ↓              ↓
  Enter   localStorage   Context       MongoDB          User
  data    auth token     manages      operations       stored
           state         state
   ↑         ↑           ↑                ↑              ↑
   └─────────┴───────────┴────────────────┴──────────────┘
             Secure flow with JWT tokens
```

##  Component Communication

```
App Layout
├── AuthProvider
│   └── Provides useAuth() hook
│       ├── user
│       ├── token
│       ├── isAuthenticated
│       └── functions (register, login, etc.)
│
└── Header
    ├── Conditional render based on useAuth()
    ├── Guest: Show "Sign In" / "Sign Up"
    └── Auth: Show User Menu
        ├── Profile
        ├── Settings
        └── Logout
            └── Calls useAuth().logout()
                ├── API: POST /api/auth/logout
                ├── Clear localStorage
                ├── Update Context
                └── Redirect to home
```

##  State Management Flow

```
Initial Load:
└─ AuthProvider mounts
   ├─ Check localStorage for token
   ├─ Token exists?
   │  ├─ YES: Fetch user with token
   │  │  └─ GET /api/auth/me
   │  │     └─ Update state with user
   │  └─ NO: Keep state empty
   └─ Set loading = false

User Actions:
├─ Sign Up: register() → API → Save token → Update state
├─ Login: login() → API → Save token → Update state
├─ Update: updateProfile() → API → Update state
├─ Logout: logout() → Clear everything → Redirect
└─ Delete: deleteProfile() → Clear everything → Redirect
```

##  Performance Optimization

```
Optimization Strategies:
├─ Token Caching
│  └─ localStorage.getItem() = 0 API calls on reload
│
├─ Selective Field Retrieval
│  └─ exclude password from API responses
│
├─ Database Indexing
│  └─ email indexed for fast lookups
│
├─ Lazy Loading
│  └─ Protected routes loaded only when needed
│
└─ Bundle Optimization
   └─ Code splitting with Next.js
```

---

This architecture provides:
-  Clear separation of concerns
-  Secure authentication flow
-  Efficient state management
-  Scalable backend design
-  Responsive frontend
-  Database integrity
