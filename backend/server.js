const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const questionRoutes = require("./api/questionRoutes");
const testRoutes = require("./api/testRoutes");
const taketestRoutes = require("./api/taketestRoutes");
dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(cors());  // Enable CORS for frontend communication

// Database connection
connectDB();

// API Routes
app.use("/api/questions", questionRoutes);
app.use("/api/dashboard", testRoutes);
app.use("/api/test", taketestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
