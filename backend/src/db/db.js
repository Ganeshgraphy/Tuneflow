const mongoose = require("mongoose");
const dns = require("node:dns");

let connectionPromise = null;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  // Reuse an existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Reuse an ongoing connection attempt
  if (!connectionPromise) {
    if (process.env.MONGO_DNS_SERVERS) {
      dns.setServers(
        process.env.MONGO_DNS_SERVERS
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      );
    }

    connectionPromise = mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
      }
    ).catch(error => {
      connectionPromise = null;
      console.error("MongoDB connection failed:", error);
      throw error;
    });
  }

  await connectionPromise;

  console.log("MongoDB connected");

  return mongoose.connection;
}

module.exports = connectDB;