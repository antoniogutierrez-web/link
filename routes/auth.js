const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
});

// Ruta para iniciar sesión (login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas.' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

module.exports = router;
