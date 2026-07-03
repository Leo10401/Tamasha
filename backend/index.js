const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
const mongoose = require('./connection');
const cors = require('cors');
app.use(cors());
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
