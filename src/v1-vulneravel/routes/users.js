// Rotas de usuários - Versão 1.0 (Vulnerável)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas CRUD para usuários
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Rota de login vulnerável
router.post('/login', userController.loginUser);

module.exports = router;