const mongoose = require("mongoose");
require("dotenv").config();

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      const MONGODB_URI =
        process.env.MONGODB_URI;

      if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not set");
      }

      console.log("Connecting to MongoDB...");
      
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("MongoDB connected successfully");

      // Handle connection events
      mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
      });
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
    } catch (error) {
      console.error("Error disconnecting MongoDB:", error);
    }
  }
}

module.exports = new Database();
