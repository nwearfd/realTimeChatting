require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Socket.IO
const io = new Server(server, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Simple in-memory map of socketId -> user info
const onlineUsers = new Map();

io.use((socket, next) => {
    // 토큰은 클라이언트에서 socket.auth.token 로 전달
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded.user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    const user = socket.user; // { id, username }
    onlineUsers.set(socket.id, user);
    console.log('connected', socket.id, user);

    // Broadcast current online users (simple)
    io.emit('onlineUsers', Array.from(onlineUsers.values()));

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${user.username} joined ${room}`);
        // inform room
        socket.to(room).emit('message', {
            system: true,
            text: `${user.username} 님이 입장했습니다.`,
            createdAt: new Date()
        });
    });

    socket.on('chatMessage', async (data) => {
        // data: { room, text }
        const { room, text } = data;
        const msg = new Message({
            room,
            userId: user.id,
            username: user.username,
            text,
        });
        try {
            await msg.save();
            io.to(room).emit('message', {
                _id: msg._id,
                room,
                username: user.username,
                text,
                createdAt: msg.createdAt
            });
        } catch (err) {
            console.error('message save error', err);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers.values()));
        console.log('disconnected', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
