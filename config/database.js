
const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  console.log("MongoDB URI loaded:", Boolean(uri));
  console.log("URI contains placeholder:", /<.*?>/.test(uri));
  console.log("Cluster:", uri.match(/@([^/]+)/)?.[1] ?? "Not detected");

  await mongoose.connect(uri);

  console.log("MongoDB Atlas connected successfully");
}

module.exports = connectDB;
