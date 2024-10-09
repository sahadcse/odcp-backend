const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const router = require('./routes')

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use(router);

// Test API
app.get('/', (req, res) => res.send('API Running'));

// Start Server
const PORT = process.env.PORT || 5555;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));