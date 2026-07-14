// lib/mongoose.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    await mongoose.connect(MONGODB_URI);

    // ✅ This will confirm exact DB name in terminal
    console.log("✅ Connected to DB:", mongoose.connection.db.databaseName);
    console.log("✅ Host:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}
