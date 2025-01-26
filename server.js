const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const http = require("http");

const Consultation = require("./models/consultationRecordModel");

// Initialize express
const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO Server Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
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

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});

//--------------------------------- Socket.IO ---------------------------------

// Store room participants with roles
const rooms = new Map(); // Changed to Map for better structure

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  const joinRoom = (roomName, role) => {
    if (!roomName || typeof roomName !== 'string') {
      console.error('Invalid room name:', roomName);
      return null;
    }

    console.log(`Joining room ${roomName} as ${role} with socket ${socket.id}`);
    
    let room = rooms.get(roomName);
    if (!room) {
      room = { 
        patient: null, 
        doctor: null, 
        isActive: false,
        createdAt: Date.now()
      };
      rooms.set(roomName, room);
      console.log(`Created new room ${roomName}`);
    }

    // Clear existing role if someone else had it
    if (role === 'patient' && room.patient && room.patient !== socket.id) {
      console.log(`Replacing existing patient in room ${roomName}`);
    } else if (role === 'doctor' && room.doctor && room.doctor !== socket.id) {
      console.log(`Replacing existing doctor in room ${roomName}`);
    }

    // Update room state
    if (role === 'patient') {
      room.patient = socket.id;
    } else if (role === 'doctor') {
      room.doctor = socket.id;
      room.isActive = true;
    }

    socket.join(roomName);
    console.log(`Updated room ${roomName} state:`, room);
    return room;
  };

  // Handle signaling with improved broadcasting
  socket.on('signal', ({ room_name, signal }) => {
    try {
      const room = rooms.get(room_name);
      if (!room) {
        console.log('Room not found:', room_name);
        return;
      }

      const isDoctor = room.doctor === socket.id;
      const targetId = isDoctor ? room.patient : room.doctor;
      
      console.log(`Signal (${signal.sdp ? 'SDP' : 'ICE'}) from ${isDoctor ? 'doctor' : 'patient'} to ${isDoctor ? 'patient' : 'doctor'}`);
      
      if (targetId) {
        // Forward the signal immediately
        io.to(targetId).emit('signal', { 
          signal,
          from: socket.id
        });
      } else {
        console.log('Target peer not found in room');
      }
    } catch (error) {
      console.error('Signal error:', error);
      socket.emit('error', { message: 'Failed to relay signal' });
    }
  });

  socket.on('patientJoin', async ({ room_name }) => {
    try {
      console.log(`Patient ${socket.id} joining room ${room_name}`);
      const room = joinRoom(room_name, 'patient');
      
      socket.emit('joined', { role: 'patient', room: room_name });
      
      if (room.doctor) {
        io.to(room_name).emit('ready-to-connect', {
          participants: {
            patient: room.patient,
            doctor: room.doctor
          }
        });
      }
    } catch (error) {
      console.error('Patient join error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('doctorJoin', async ({ room_name }) => {
    try {
      if (!room_name) {
        socket.emit('error', { message: 'Room name is required' });
        return;
      }

      console.log(`Doctor ${socket.id} joining room ${room_name}`);
      const room = joinRoom(room_name, 'doctor');
      
      if (!room) {
        socket.emit('error', { message: 'Failed to join room' });
        return;
      }
      
      // Emit join confirmation
      socket.emit('joined', { 
        role: 'doctor', 
        room: room_name,
        roomState: {
          hasPatient: !!room.patient,
          isActive: room.isActive
        }
      });
      
      // If patient is already in room, trigger connection
      if (room.patient) {
        io.to(room_name).emit('ready-to-connect', {
          participants: {
            patient: room.patient,
            doctor: socket.id
          }
        });
      }
    } catch (error) {
      console.error('Doctor join error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle disconnection with improved cleanup
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and clean up rooms where this socket was participating
    for (const [roomName, room] of rooms.entries()) {
      if (room.patient === socket.id || room.doctor === socket.id) {
        io.to(roomName).emit('peer-disconnected', { id: socket.id });
        
        if (room.patient === socket.id) room.patient = null;
        if (room.doctor === socket.id) {
          room.doctor = null;
          room.isActive = false;
        }
        
        // Remove room if empty
        if (!room.patient && !room.doctor) {
          rooms.delete(roomName);
        }
      }
    }
  });

  // Add periodic room state logging
  setInterval(() => {
    console.log('\nCurrent rooms state:');
    for (const [roomName, room] of rooms.entries()) {
      console.log(`Room ${roomName}:`, {
        patient: room.patient,
        doctor: room.doctor,
        isActive: room.isActive
      });
    }
  }, 10000);

  // Clean up invalid rooms periodically
  setInterval(() => {
    for (const [roomName, room] of rooms.entries()) {
      // Remove rooms that are empty or older than 2 hours
      if ((!room.patient && !room.doctor) || 
          (Date.now() - room.createdAt > 2 * 60 * 60 * 1000)) {
        rooms.delete(roomName);
        console.log(`Cleaned up room ${roomName}`);
      }
    }
  }, 30000);
});

//--------------------------------- Socket.IO ---------------------------------

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;