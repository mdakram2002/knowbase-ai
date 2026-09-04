# Quick Start Guide - Authentication System

##  Getting Started

This guide will help you set up and run the complete authentication system for KnowBase AI.

## Prerequisites

- Node.js 18.0.0 or higher
- MongoDB (local or Atlas)
- npm or yarn
- A code editor (VS Code recommended)

## 1. Server Setup

### Step 1: Navigate to server directory
```bash
cd server
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create .env file
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/knowbase-ai
JWT_SECRET=your_super_secret_jwt_key_change_this_123456789
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
CORS_ORIGIN=http://localhost:3000
```

** Important**: Change `JWT_SECRET` to a strong random string in production.

### Step 4: Start MongoDB
Make sure MongoDB is running (local or Atlas connection string in .env)

### Step 5: Start the server
```bash
npm run dev
```

Expected output:
```
Database connected successfully
Server is running on port 5000
```

## 2. Client Setup

### Step 1: Navigate to client directory
```bash
cd client
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create .env.local file
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Start the frontend
```bash
npm run dev
```

Expected output:
```
Ready in 2.5s
```

## 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 4. Test the Authentication Flow

### Test Sign Up
1. Go to http://localhost:3000
2. Click "Sign Up" button in navbar
3. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: test123456
   - Confirm Password: test123456
4. Click "Create Account"
5. You should be redirected to dashboard

### Test Login
1. Go to http://localhost:3000
2. Click "Sign In" button
3. Enter credentials:
   - Email: john@example.com
   - Password: test123456
4. Click "Sign In"
5. You should be redirected to dashboard

### Test Profile Update
1. Click on profile menu (top right)
2. Select "Profile"
3. Click "Edit Profile"
4. Update name, bio, or location
5. Click "Save Changes"
6. Verify changes are saved

### Test Change Password
1. Go to Profile page
2. Click "Change Password" button
3. Enter:
   - Current Password: test123456
   - New Password: newPassword123
   - Confirm Password: newPassword123
4. Click "Update Password"
5. Login again with new password to verify

### Test Logout
1. Click user menu (top right)
2. Click "Sign out"
3. You should be redirected to home page
4. Login/Signup buttons should be visible

### Test Account Deletion
1. Go to Profile page
2. Click "Delete Account" button (in red Danger Zone)
3. Enter your password
4. Check the confirmation checkbox
5. Click "Delete Account"
6. You should be logged out and redirected to home
7. Verify you cannot login with that email anymore

## 5. API Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "test123456",
    "passwordConfirm": "test123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "test123456"
  }'
```

### Get Current User (use token from login response)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "bio": "Knowledge enthusiast",
    "location": "San Francisco"
  }'
```

## 6. Environment Variables Checklist

### Server (.env)
- [ ] `PORT` set to 5000
- [ ] `NODE_ENV` set to development
- [ ] `MONGODB_URI` configured (local or Atlas)
- [ ] `JWT_SECRET` set to strong random string
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` set (if using AI features)
- [ ] `CORS_ORIGIN` set to http://localhost:3000

### Client (.env.local)
- [ ] `NEXT_PUBLIC_API_URL` set to http://localhost:5000/api
- [ ] `NEXT_PUBLIC_APP_URL` set to http://localhost:3000

## 7. Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (server)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (client)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running locally or Atlas connection is correct
- Check MONGODB_URI in .env
- Verify network access if using MongoDB Atlas

### CORS Errors
- Ensure CORS_ORIGIN in server .env includes http://localhost:3000
- Clear browser cache
- Check browser console for specific error

### Token Not Working
- Ensure JWT_SECRET is same in both requests
- Check token expiration (7 days)
- Clear localStorage and login again

### Password Change Not Working
- Confirm current password is correct
- Ensure new password meets minimum requirements (6 chars)
- Check that passwords match

## 8. Next Steps

1. **Customize**: Modify signup/login forms as needed
2. **Styling**: Adjust colors and styling in Tailwind config
3. **Database**: Set up MongoDB Atlas for production
4. **Deployment**: Deploy to Vercel (frontend) and hosting service (backend)
5. **Security**: Update JWT_SECRET, set HTTPS, enable email verification
6. **Features**: Add OAuth, 2FA, email notifications

## 9. File Structure

```
project/
├── server/
│   ├── controllers/
│   │   └── authController.js ( Enhanced with new methods)
│   ├── models/
│   │   └── User.js ( Updated with new fields)
│   ├── routes/
│   │   └── authRoutes.js ( New endpoints added)
│   ├── middleware/
│   │   └── auth.js ( Improved JWT handling)
│   ├── .env ( Configure here)
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js ( Auth-aware home)
│   │   │   ├── auth/
│   │   │   │   ├── signup/page.js ( New)
│   │   │   │   └── login/page.js ( New)
│   │   │   ├── dashboard/
│   │   │   │   └── profile/page.js ( Updated)
│   │   │   └── layout.js ( Added AuthProvider)
│   │   ├── contexts/
│   │   │   ├── AuthContext.js ( New)
│   │   │   └── NavbarContext.js
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js ( New)
│   │   │   └── layout/
│   │   │       └── Header.js ( Updated with auth)
│   │   └── store/
│   │       └── useKnowledgeStore.js
│   ├── .env.local ( Configure here)
│   └── package.json
│
└── AUTHENTICATION.md ( Full documentation)
```

## 10. Key Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login to account |
| GET | /api/auth/me | Yes | Get user info |
| PUT | /api/auth/profile | Yes | Update profile |
| POST | /api/auth/change-password | Yes | Change password |
| DELETE | /api/auth/profile | Yes | Delete account |
| DELETE | /api/auth/data | Yes | Delete data only |
| POST | /api/auth/logout | Yes | Logout |

## 11. Support & Documentation

- Full API Documentation: See [AUTHENTICATION.md](./AUTHENTICATION.md)
- Frontend Hook Usage: See `/client/src/contexts/AuthContext.js`
- Protected Routes: See `/client/src/components/ProtectedRoute.js`
- Example Pages: See `/client/src/app/auth/` and `/client/src/app/dashboard/profile/`

## 12. Security Reminders

 **Before Production Deployment:**

1. Change `JWT_SECRET` to a cryptographically random string
2. Enable HTTPS on all endpoints
3. Set `NODE_ENV` to production
4. Configure proper CORS origins
5. Enable rate limiting
6. Set up HTTPS/SSL certificates
7. Use environment secrets management (not .env files)
8. Enable database backups
9. Monitor error logs
10. Implement rate limiting on auth endpoints

---

**Happy Coding! **

If you encounter any issues, check the troubleshooting section or refer to [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed information.
