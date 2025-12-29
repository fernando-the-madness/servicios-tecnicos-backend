import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import { initChat } from './controllers/chatController.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api', (_, res) => res.json({ msg: 'Backend funcionando ✅' }));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error con MongoDB:', err));

// Socket.io básico
io.on('connection', socket => {
  console.log('🟢 Usuario conectado:', socket.id);
  socket.on('disconnect', () => console.log('🔴 Usuario desconectado'));
});

initChat(io);

// Puerto dinámico para Railway
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));