// Versão 2.0 (Segura) - app.js para MySQL
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware de segurança
app.use(helmet()); // Adiciona cabeçalhos de segurança
app.use(xss()); // Sanitiza entradas contra XSS
app.use(cookieParser()); // Para processamento de cookies (CSRF)

// Limitar requisições para prevenir ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
});
app.use(limiter);

// Configurar body parser
app.use(express.json({ limit: '10kb' })); // Limitar tamanho do corpo da requisição
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Importação das rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Middleware para adicionar tokens CSRF
app.use((req, res, next) => {
  // Cria um token CSRF único por sessão/requisição
  const csrfToken = require('crypto').randomBytes(16).toString('hex');
  
  // Define o token como um cookie HTTP-only
  res.cookie('XSRF-TOKEN', csrfToken, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict' 
  });
  
  // Também envia o token no cabeçalho para o cliente usar em requisições futuras
  res.header('X-CSRF-Token', csrfToken);
  
  next();
});

// Middleware para verificar tokens CSRF em rotas sensíveis
const csrfProtection = (req, res, next) => {
  const token = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];
  
  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token inválido ou ausente'
    });
  }
  
  next();
};

// Aplicar proteção CSRF a rotas PUT, POST e DELETE
app.use('/users/:id', (req, res, next) => {
  if (['PUT', 'DELETE'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// Uso das rotas
app.use('/auth', authRoutes);
app.use('/', userRoutes);

// Rota de teste para a versão segura
app.get('/', (req, res) => {
  res.send('API Segura (V2) está funcionando');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Exportar o router em vez do app completo
module.exports = app;