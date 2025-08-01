// src/server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const boardRoutes = require("./routes/boardRoutes");
const cardRoutes = require("./routes/cardRoutes");
const setupSwagger = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => callback(null, origin), // Cho mọi domain
  credentials: true, // Cho phép gửi cookie, header
}));

app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use("/boards", boardRoutes);
app.use("/cards", cardRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
