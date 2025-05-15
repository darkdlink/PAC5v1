// Middleware de validação - Versão 2.0 (Segura)
const { body, validationResult } = require('express-validator');

// Validação para criação de usuário
exports.validateUserCreation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('O nome de usuário deve ter entre 3 e 30 caracteres')
    .escape() // Sanitiza contra XSS
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('O nome de usuário deve conter apenas letras, números e underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail() // Normaliza email
    .escape(), // Sanitiza contra XSS
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validação para atualização de usuário
exports.validateUserUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('O nome de usuário deve ter entre 3 e 30 caracteres')
    .escape()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('O nome de usuário deve conter apenas letras, números e underscores'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .escape(),
  
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validação para login
exports.validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Nome de usuário é obrigatório')
    .escape(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];