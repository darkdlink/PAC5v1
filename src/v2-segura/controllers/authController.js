// Controlador de autenticação - Versão 2.0 (Segura) para MySQL
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função para gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sua_chave_secreta_aqui', {
    expiresIn: '1h'
  });
};

// Registrar um novo usuário - SEGURO
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verificar se o usuário já existe - SEGURO: Usando métodos do Sequelize
    const userExists = await User.findOne({ 
      where: {
        [User.sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'Usuário ou email já existe'
      });
    }
    
    // Hash da senha - SEGURO: Usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Criar usuário com senha criptografada - SEGURO: Usando métodos do Sequelize
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    
    // Gerar token JWT
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar usuário'
    });
  }
};

// Login de usuário - SEGURO
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Buscar usuário pelo nome de usuário - SEGURO: Usando métodos do Sequelize
    const user = await User.findOne({ 
      where: { username }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }
    
    // Verificar se a senha está correta - SEGURO: Usando bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }
    
    // Gerar token JWT
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login'
    });
  }
};