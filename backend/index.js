const express = require("express");
const cors = require("cors");
const app = express();

require('dotenv').config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
const mongoose = require('./connection');
const userRoutes = require('./routes/UserRoutes');
const eventRoutes = require('./routes/EventRoute');
const PORT = process.env.PORT || 5000;

app.use('/user', userRoutes);
app.use('/event', eventRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
