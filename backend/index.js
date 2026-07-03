const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
const mongoose = require('./connection');
const cors = require('cors');
app.use(cors());
const userRoutes = require('./routes/UserRoutes');
const eventRoutes = require('./routes/EventRoute');

app.use('/user', userRoutes);
app.use('/event', eventRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
