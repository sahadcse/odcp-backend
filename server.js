const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const socketIo = require("socket.io");
const http = require("http");

// Initialize express
const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO Server Setup
const server = http.createServer(app);
const io =socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});



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


// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Export server for testing
(module.exports = server), io;