require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");

const catRoutes = require("./routes/catRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    exposedHeaders: ["Content-Length", "X-Foo"],
  })
);

// Cross-Origin-Resource-Policy Header
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("dev"));

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Serving static files from:", path.join(__dirname, "uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to the Cat Pics API! Use /api/cats to interact.");
});

// Setup Swagger Documentation
setupSwagger(app);

// Routes
app.use("/api/cats", catRoutes);
app.use("/api/auth", authRoutes);

// Only connect to MongoDB when NOT running tests
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

// Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
