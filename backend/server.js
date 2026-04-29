const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(require('helmet')());
app.use(require('morgan')('combined'));

const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/employee-expenses', require('./routes/employeeExpenses'));
app.use('/api/timesheets', require('./routes/timesheets'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/products', require('./routes/products'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/purchase-orders', require('./routes/purchaseOrders'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/project-tasks', require('./routes/projectTasks'));
app.use('/api/project-materials', require('./routes/projectMaterials'));
app.use('/api/contractors', require('./routes/contractors'));
app.use('/api/work-orders', require('./routes/workOrders'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/customs', require('./routes/customs'));
app.use('/api/currencies', require('./routes/currencies'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/rent-payments', require('./routes/rentPayments'));
app.use('/api/hotel/rooms', require('./routes/hotelRooms'));
app.use('/api/hotel/bookings', require('./routes/hotelBookings'));
app.use('/api/hotel/guests', require('./routes/hotelGuests'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/stock-alerts', require('./routes/stockAlerts'));
app.use('/api/cash', require('./routes/cash'));
app.use('/api/tax', require('./routes/tax'));
app.use('/api/deferred-revenue', require('./routes/deferredRevenue'));
app.use('/api/fixed-assets', require('./routes/fixedAssets'));
app.use('/api/intercompany', require('./routes/intercompany'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/recurring', require('./routes/recurring'));
app.use('/api/kpis', require('./routes/kpis'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/announcements', require('./routes/announcements'));

// Health check & Swagger
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tsemex ERP API is running' });
});

// TODO: Add Swagger docs later

// Socket.io setup
const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
  if (!token) {
    socket.user = { id: 'anonymous', role: 'guest' };
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    socket.user = { id: 'anonymous', role: 'guest' };
    next();
  }
});

// Socket connection events
io.on('connection', (socket) => {
  console.log(`User ${socket.user.id} connected`);
  
  // Join user rooms
  socket.join(`user_${socket.user.id}`);
  
  socket.on('joinRoom', (roomId) => {
    socket.join(`room_${roomId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const message = new Message({
        roomId: data.roomId,
        sender: socket.user.id,
        content: data.content
      });
      await message.save();
      
      // Update room lastMessage
      await ChatRoom.findByIdAndUpdate(data.roomId, { 
        lastMessage: message._id 
      });

      // Broadcast to room
      io.to(`room_${data.roomId}`).emit('newMessage', message);
      
    } catch (err) {
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

// Error Handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server with Socket.io running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
