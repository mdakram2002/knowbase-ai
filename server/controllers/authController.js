const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Knowledge = require('../models/Knowledge');
const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  validateEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    return password && password.length >= 6;
  }

  async register(req, res) {
    try {
      const { name, email, password, passwordConfirm } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and password are required'
        });
      }

      if (!this.validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      if (!this.validatePassword(password)) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters'
        });
      }

      if (password !== passwordConfirm) {
        return res.status(400).json({
          success: false,
          error: 'Passwords do not match'
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      const token = this.generateToken(user._id);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: user.toPublicProfile(),
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed. Please try again.'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user with password field
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account is deactivated'
        });
      }

      user.lastActive = Date.now();
      const token = this.generateToken(user._id);
      user.addRefreshToken(token);
      await user.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toPublicProfile(),
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed. Please try again.'
      });
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user.toPublicProfile()
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, bio, location, avatar, socialLinks, preferences } = req.body;

      const updates = {};
      if (name) updates.name = name.trim();
      if (bio !== undefined) updates.bio = bio;
      if (location !== undefined) updates.location = location;
      if (avatar) updates.avatar = avatar;
      if (socialLinks) updates.socialLinks = socialLinks;
      if (preferences) updates.preferences = preferences;

      const user = await User.findByIdAndUpdate(
        req.userId,
        updates,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user.toPublicProfile()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'All password fields are required'
        });
      }

      if (!this.validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 6 characters'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Passwords do not match'
        });
      }

      const user = await User.findById(req.userId).select('+password');

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  }

  async deleteProfile(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'Password is required to delete account'
        });
      }

      const user = await User.findById(req.userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Password is incorrect'
        });
      }

      await Knowledge.deleteMany({ userId: req.userId });

      await User.findByIdAndDelete(req.userId);

      res.json({
        success: true,
        message: 'Account and all associated data deleted successfully'
      });
    } catch (error) {
      console.error('Delete profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete profile'
      });
    }
  }

  async deleteAllData(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'Password is required'
        });
      }

      const user = await User.findById(req.userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Password is incorrect'
        });
      }

      await Knowledge.deleteMany({ userId: req.userId });

      res.json({
        success: true,
        message: 'All data deleted successfully. Your account remains active.'
      });
    } catch (error) {
      console.error('Delete data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete data'
      });
    }
  }

  async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }
}

module.exports = new AuthController();