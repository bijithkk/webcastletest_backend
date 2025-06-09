const express = require('express');
const cors = require('cors');

// const adminAuthRouter = require('./routes/admin/authRoutes');

// APP config
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
// app.use('/api/v1/admin/auth', adminAuthRouter);

module.exports = app;