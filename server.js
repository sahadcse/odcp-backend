const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http"); 

// Initialize express
const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Socket.IO Server Setup
const server = http.createServer(app);
const io =socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//  events for signaling and peer-to-peer communication | Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected for consultation');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer); // Send the offer to the other user
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer); // Send the answer back to the other user
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate); // Exchange ICE candidates
  });

  // End Call
  socket.on('end-call', () => {
    socket.broadcast.emit('end-call');
    console.log("Call ended");
  });

  // Mute/Unmute
  socket.on('toggle-mute', (isMuted) => {
    socket.broadcast.emit('toggle-mute', isMuted);
    console.log(`Mute status: ${isMuted}`);
  });

  // Toggle Camera
  socket.on('toggle-camera', (isCameraOn) => {
    socket.broadcast.emit('toggle-camera', isCameraOn);
    console.log(`Camera status: ${isCameraOn}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// On server.js (or wherever your Socket.IO server is set up)
// io.on('connection', (socket) => {
//   console.log("A user connected for consultation");

//   // End Call
//   socket.on('end-call', () => {
//     socket.broadcast.emit('end-call');
//     console.log("Call ended");
//   });

//   // Mute/Unmute
//   socket.on('toggle-mute', (isMuted) => {
//     socket.broadcast.emit('toggle-mute', isMuted);
//     console.log(`Mute status: ${isMuted}`);
//   });

//   // Toggle Camera
//   socket.on('toggle-camera', (isCameraOn) => {
//     socket.broadcast.emit('toggle-camera', isCameraOn);
//     console.log(`Camera status: ${isCameraOn}`);
//   });

//   socket.on('disconnect', () => {
//     console.log("A user disconnected");
//   });
// });



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