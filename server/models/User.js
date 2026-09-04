const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  avatar: {
    type: String,
    default: "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  },

  bio: {
    type: String,
    default: "",
    maxlength: [500, "Bio cannot exceed 500 characters"],
  },

  location: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
  },

  socialLinks: {
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },

  lastActive: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  refreshTokens: [
    {
      token: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.toPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  delete user.__v;
  return user;
};

// Instance method to add refresh token
userSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push({ token, createdAt: new Date() });
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

// Instance method to remove refresh token
userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
