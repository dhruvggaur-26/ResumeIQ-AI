const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ResumeIQ AI API is running",
  });
});

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/resume", require("./routes/resumeRoutes"));
module.exports = app;