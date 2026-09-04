# Authentication System Guide

## Overview

KnowBase AI now features a complete authentication system with user registration, login, profile management, and account deletion functionality.

## Features

### 1. User Authentication
- **Sign Up (Register)**: Create a new account with email and password
- **Sign In (Login)**: Authenticate with email and password
- **JWT Token**: Secure token-based authentication
- **Auto-refresh**: Tokens persist in localStorage for seamless sessions
- **Sign Out**: Logout and redirect to home page

### 2. Profile Management
- **View Profile**: See all account information
- **Update Profile**: Edit name, bio, location, and avatar
- **Change Password**: Update account password with current password verification
- **Delete Account**: Permanently delete account and all associated data
- **Delete Data**: Delete all knowledge items while keeping the account

### 3. Guest User Support
- **Home Page**: Accessible without authentication
- **Auth Pages**: Dedicated signup and login pages
- **Navigation**: Different UI for authenticated vs guest users
- **Protected Routes**: Dashboard and profile pages require authentication

### 4. Security Features
- **Password Hashing**: Bcrypt with salt rounds
- **Token Verification**: JWT-based authentication middleware
- **Password Confirmation**: Match validation for new passwords
- **Account Verification**: Confirmation required for account deletion
- **Rate Limiting**: Protect against brute force attacks

## API Endpoints

### Authentication Routes

#### Public Routes
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with credentials

#### Protected Routes (Require JWT Token)
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `DELETE /api/auth/profile` - Delete account and data
- `DELETE /api/auth/data` - Delete all data only
- `POST /api/auth/logout` - Logout

## API Request/Response Examples

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "passwordConfirm": "securePassword123"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
      "bio": "",
      "location": "",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

### Update Profile
```bash
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Knowledge enthusiast",
  "location": "San Francisco",
  "avatar": "https://..."
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Change Password
```bash
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Delete Account
```bash
DELETE /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "currentPassword123"
}

Response (200):
{
  "success": true,
  "message": "Account and all associated data deleted successfully"
}
```

### Delete All Data
```bash
DELETE /api/auth/data
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "currentPassword123"
}

Response (200):
{
  "success": true,
  "message": "All data deleted successfully. Your account remains active."
}
```

## Frontend Implementation

### AuthContext Hook
Use the `useAuth()` hook to access authentication functions in any component:

```javascript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const {
    user,           // Current user object
    token,          // JWT token
    loading,        // Loading state
    isAuthenticated, // Boolean
    register,       // (name, email, password, passwordConfirm)
    login,          // (email, password)
    logout,         // ()
    updateProfile,  // (updates)
    changePassword, // (currentPassword, newPassword, confirmPassword)
    deleteAllData,  // (password)
    deleteProfile   // (password)
  } = useAuth();

  return (
    // Your component JSX
  );
}
```

### Protected Route Component
Wrap components that require authentication:

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProtectedComponent() {
  return (
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

### Example: Login Flow
```javascript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login('user@example.com', 'password123');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  )  -
}
```

## Pages

### Public Pages
- `/` - Home page (shows different UI for authenticated vs guest users)
- `/auth/signup` - Sign up page
- `/auth/login` - Login page
- `/docs` - Documentation

### Protected Pages
- `/dashboard` - Main dashboard
- `/dashboard/profile` - Profile settings
- `/dashboard/notes` - Notes management
- `/dashboard/knowledge` - Knowledge management
- `/dashboard/links` - Links management
- `/dashboard/settings` - Settings

## User Model Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (default: generated avatar URL),
  bio: String,
  location: String,
  role: String (enum: ['user', 'admin'], default: 'user'),
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
  refreshTokens: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Server (.env)
```
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb://localhost:27017/knowbase-ai
CORS_ORIGIN=http://localhost:3000
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Security Best Practices

1. **JWT Secret**: Use a strong, random string in production
2. **HTTPS**: Always use HTTPS in production
3. **Password**: Minimum 6 characters (configurable)
4. **Rate Limiting**: Enabled on auth routes
5. **CORS**: Configured to specific origins
6. **Token Storage**: Stored in localStorage (can be upgraded to httpOnly cookies)
7. **Password Hashing**: Bcrypt with salt rounds (10)

## Error Handling

Common error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials, expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user not found)
- `500` - Server Error

## Setup Instructions

1. **Install Dependencies**
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd client
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` in server directory
   - Set `JWT_SECRET` to a random string
   - Set `MONGODB_URI` to your database connection
   - In client, set `NEXT_PUBLIC_API_URL`

3. **Start Development**
   ```bash
   # Terminal 1: Server
   cd server
   npm run dev

   # Terminal 2: Client
   cd client
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Features Implemented

  - User Registration with validation
  - User Login with JWT tokens
  - Profile viewing and editing
  - Password change with verification
  - Account deletion with data purge
  - Selective data deletion
  - Protected routes with auth check
  - Auth context for state management
  - Toast notifications for feedback
  - Responsive UI for all devices
  - Error handling and validation
  - Token persistence with localStorage
  - Auto-logout on token expiration
  - Redirect to home on logout

## Future Enhancements

- [ ] Email verification
- [ ] Forgot password functionality
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] Refresh token rotation
- [ ] Account recovery options
- [ ] Activity logs
- [ ] Role-based access control (RBAC)
- [ ] Admin panel

## Troubleshooting

### Token Expired
- Clear localStorage and login again
- Check server JWT_SECRET matches

### CORS Errors
- Verify CORS_ORIGIN in server .env
- Check if frontend URL is in allowed origins

### Database Connection
- Ensure MongoDB is running
- Verify MONGODB_URI is correct

### Password Change Failed
- Confirm current password is correct
- Ensure new password meets requirements

## Support

For issues or questions, refer to:
- API Documentation: `/api-docs`
- Server Logs: Check terminal output
- Client Console: Browser DevTools Console
