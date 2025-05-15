// Rotas de usuários - Versão 2.0 (Segura)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

// Rotas CRUD para usuários com proteção adequada
router.get('/users', userController.getAllUsers); // Rota pública
router.get('/users/:id', userController.getUserById); // Rota pública

// Rotas protegidas - requerem autenticação
router.put('/users/:id', protect, validateUserUpdate, userController.updateUser);
router.delete('/users/:id', protect, userController.deleteUser);

module.exports = router;