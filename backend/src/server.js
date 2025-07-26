// src/server.js
require('dotenv').config();
const express = require("express");
const boardRoutes = require("./routes/boardRoutes");
const cardRoutes = require("./routes/cardRoutes");
const setupSwagger = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Swagger docs
setupSwagger(app);

// Register routes
app.use("/boards", boardRoutes);
app.use("/cards", cardRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});