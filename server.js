
require("dotenv").config();

const connectDB = require("./config/database");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Create a local logs directory if it does not exist
const logDirectory = path.join(__dirname, "logs");
fs.mkdirSync(logDirectory, { recursive: true });

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

const errorLogStream = fs.createWriteStream(
  path.join(logDirectory, "error.log"),
  { flags: "a" }
);

// Security and request middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// Log requests to both the terminal and a local file
app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

// General API rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message: "Too many requests. Please try again later.",
    },
  })
);

// Health-check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "COMP3123 Assignment 1 API is running",
  });
});

// API routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/emp", require("./routes/employeeRoutes"));

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const logEntry = [
    new Date().toISOString(),
    `${req.method} ${req.originalUrl}`,
    err.stack || err.message || "Unknown error",
    "",
  ].join("\n");

  errorLogStream.write(`${logEntry}\n`);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;

  return res.status(status).json({
    status: "error",
    message: status >= 500 ? "Internal server error" : err.message,
  });
});

// Start the server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access logs: ${path.join(logDirectory, "access.log")}`);
      console.log(`Error logs: ${path.join(logDirectory, "error.log")}`);
    });
  } catch (error) {
    const message = `${new Date().toISOString()} - Startup failed: ${
      error.stack || error.message
    }\n`;

    fs.appendFileSync(
      path.join(logDirectory, "error.log"),
      message
    );

    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

startServer();
