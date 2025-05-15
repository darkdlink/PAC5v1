// Versão 1.0 (Vulnerável) - app.js para MySQL
const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importação das rotas
const userRoutes = require('./routes/users');

// Uso das rotas
app.use('/', userRoutes);

// Rota de teste para a versão vulnerável
app.get('/', (req, res) => {
  res.send('API Vulnerável (V1) está funcionando');
});

// Exportar o router em vez do app completo
module.exports = app;