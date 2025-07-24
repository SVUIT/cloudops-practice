// src/server.js
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const cardRoutes = require("./routes/cardRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Register routes
app.use("/users", userRoutes);
app.use("/boards", boardRoutes);
app.use("/cards", cardRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});