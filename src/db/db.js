const mongoose = require("mongoose");
const dns = require("node:dns");

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from the backend .env file");
  }

  // Optional override for networks where Node's default SRV resolver fails.
  if (process.env.MONGO_DNS_SERVERS) {
    dns.setServers(process.env.MONGO_DNS_SERVERS.split(",").map(s => s.trim()).filter(Boolean));
  }

  // Let startup handle failure instead of accepting requests without a database.
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
}

module.exports = connectDB;
