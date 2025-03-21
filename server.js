// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Ruta básica
app.get('/', (req, res) => {
  res.send('Plataforma de Gestión de Usuarios');
});

// Montar rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// <--- Aquí faltaba montar las rutas de usuarios
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Servir archivos estáticos (para el front-end)
app.use(express.static('public'));

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
