// Arquivo principal para executar ambas as versões com MySQL
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados MySQL
connectDB()
  .then(() => {
    console.log('MySQL conectado com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1);
  });

// Importar as aplicações (v1 e v2)
const appV1 = require('./src/v1-vulneravel/app');
const appV2 = require('./src/v2-segura/app');

// Usar as aplicações como middleware
app.use('/api/v1', appV1);
app.use('/api/v2', appV2);

// Rota raiz
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API de Segurança - N2</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .secure {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          hr {
            margin: 30px 0;
            border: 0;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <h1>API de Segurança - N2</h1>
        
        <div class="warning">
          <h2>Versão 1.0 (Vulnerável)</h2>
          <p>Esta versão contém vulnerabilidades intencionais para fins educacionais:</p>
          <ul>
            <li>SQL Injection</li>
            <li>Cross-Site Scripting (XSS)</li>
            <li>Cross-Site Request Forgery (CSRF)</li>
          </ul>
          <p>Endpoints disponíveis em: <code>/api/v1/...</code></p>
        </div>
        
        <hr>
        
        <div class="secure">
          <h2>Versão 2.0 (Segura)</h2>
          <p>Esta versão implementa medidas de segurança para mitigar as vulnerabilidades:</p>
          <ul>
            <li>Autenticação JWT</li>
            <li>Validação e sanitização de entrada</li>
            <li>Proteção contra injeção SQL</li>
            <li>Tokens CSRF</li>
            <li>Cabeçalhos de segurança</li>
          </ul>
          <p>Endpoints disponíveis em: <code>/api/v2/...</code></p>
        </div>
        
        <hr>
        
        <p>Consulte o README.md para instruções detalhadas sobre como usar as APIs.</p>
      </body>
    </html>
  `);
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`- API Vulnerável: http://localhost:${PORT}/api/v1`);
  console.log(`- API Segura: http://localhost:${PORT}/api/v2`);
});

module.exports = app;