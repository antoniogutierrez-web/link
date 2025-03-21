// routes/users.js
const express = require('express');
const User = require('../models/User');
const { verifyAdmin } = require('../middleware/authMiddleware');
 // Ajusta la ruta a donde ubiques authMiddleware

const router = express.Router();

// Obtener la lista de todos los usuarios (solo para admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // No mostrar contraseñas
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID (solo para admin)
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario (solo para admin)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.role !== undefined) updateData.role = req.body.role;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario (solo para admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
