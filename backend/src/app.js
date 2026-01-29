const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ----------- Core middleware -----------
app.use(express.json());
app.use(cookieParser());

// CORS (for frontend cookie auth)
const allowedOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// ----------- Routes -----------
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

// Health route (DB status helpful)
const mongoose = require("mongoose");
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    db: mongoose.connection.readyState === 1 ? "connected" : "not_connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ----------- 404 -----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------- Global error handler (IMPORTANT for CI/debug) -----------
app.use((err, req, res, next) => {
  console.error("API_ERROR:", err);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

module.exports = app;