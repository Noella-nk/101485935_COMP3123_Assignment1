
require("dotenv").config();
const connectDB = require("./config/database");

const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")

const app = express();
const PORT = process.env.PORT || 3000;

// Security and request middleware
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message: "Too many requests. Please try again later."
    }
  })
);

// Health-check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "COMP3123 Assignment 1 API is running"
  });
});


 // User authentication routes
app.use("/api/users", require("./routes/userRoutes"));

// Employee routes
app.use("/api/employees", require("./routes/employeeRoutes"));


// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

// Start the server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

startServer();

