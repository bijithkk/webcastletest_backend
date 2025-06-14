const express = require('express');
const cors = require('cors');

const productRouter = require('./routes/productRoutes');

// APP config
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/product', productRouter);

module.exports = app;