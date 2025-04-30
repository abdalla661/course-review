import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable!");
}

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectMongodb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "test",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    cached.promise = null;
    throw error;
  }
}

global.mongoose = cached;
