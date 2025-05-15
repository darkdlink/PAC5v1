// Rotas de autenticação - Versão 2.0 (Segura)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserCreation, validateLogin } = require('../middleware/validation');

// Rota de registro
router.post('/register', validateUserCreation, authController.register);

// Rota de login
router.post('/login', validateLogin, authController.login);

module.exports = router;