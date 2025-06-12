const express= require('express');
const app = express();
const db = require('./db') // Import the database connection
require('dotenv').config();
const mongoose = require('mongoose');
app.use(express.json()); // Must come before routes

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//import the router files

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
// Use the  routers

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
