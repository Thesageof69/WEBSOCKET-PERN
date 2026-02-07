require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
require('./database');

const { router } = require('./userRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
