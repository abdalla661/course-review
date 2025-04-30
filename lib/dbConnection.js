import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable!");
}

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectMongodb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "test",
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected Successfully");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    cached.promise = null;
    throw error;
  }
}

if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}
