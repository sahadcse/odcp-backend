const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const setupSocket = require("./socket/socketManager");

const Consultation = require("./models/consultationRecordModel");

// Initialize express
const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Import routes
const router = require("./routes");

// Load env vars
dotenv.config();

// Connect Database
connectDB();

// Define Routes
app.use(router);

// Test API
app.get("/", (req, res) => res.send("API Running"));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;