const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Verificar se o token está presente no cabeçalho de autorização
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extrair token do cabeçalho
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado a acessar esta rota'
      });
    }
    
    try {
      // Verificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_aqui');
      
      // Verificar se o usuário ainda existe - SEGURO: Usando métodos do Sequelize
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'O usuário associado a este token não existe mais'
        });
      }
      
      // Adicionar o usuário à requisição
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  } catch (err) {
    console.error('Erro no middleware de autenticação:', err);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor durante autenticação'
    });
  }
};