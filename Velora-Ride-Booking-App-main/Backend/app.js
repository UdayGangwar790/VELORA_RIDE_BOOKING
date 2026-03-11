require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/db");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/map.routes");
const rideRoutes = require("./routes/ride.routes");

const app = express();

// Connect Database
connectDB();

// CORS configuration
app.use(
  cors({
    origin: process.env.SOCKET_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("🚖 Velora Ride Booking API Running");
});

// Routes
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;