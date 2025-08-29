import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in the environment");
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB from db.js");
        return mongoose; // ✅ You must return the mongoose connection here
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
