// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const apiRouter = require('./routes/api/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => console.log('MongoDB connection error:', err));

app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));