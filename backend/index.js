const express = require('express');
const cors = require('cors');
const client = require('./db');
const taskRoutes = require('./routes/tasks');

require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

client.connect(); 

app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/tasks`);
});

