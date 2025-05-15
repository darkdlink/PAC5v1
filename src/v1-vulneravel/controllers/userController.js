const { sequelize } = require('../../config/database');
const { QueryTypes } = require('sequelize');
const User = require('../../v2-segura/models/User'); 

// Listar todos os usuários - VULNERÁVEL A SQL INJECTION
exports.getAllUsers = async (req, res) => {
  try {
    // VULNERÁVEL: Interpolação direta de string
    const filter = req.query.filter ? ` WHERE username LIKE '%${req.query.filter}%'` : '';
    const query = `SELECT id, username, email, createdAt FROM Users${filter}`;
    
    // VULNERÁVEL: Execução direta de SQL sem parametrização
    const users = await sequelize.query(query, { type: QueryTypes.SELECT });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários'
    });
  }
};

// Obter um usuário por ID - VULNERÁVEL
exports.getUserById = async (req, res) => {
  try {
    // VULNERÁVEL: Interpolação direta do parâmetro
    const query = `SELECT id, username, email, createdAt FROM Users WHERE id = ${req.params.id}`;
    
    // VULNERÁVEL: Execução direta de SQL sem parametrização
    const [user] = await sequelize.query(query, { type: QueryTypes.SELECT });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário'
    });
  }
};

// Criar um novo usuário - VULNERÁVEL A SQL INJECTION e XSS
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // VULNERÁVEL: Interpolação direta dos valores
    const query = `INSERT INTO Users (username, email, password, createdAt, updatedAt) 
                  VALUES ('${username}', '${email}', '${password}', NOW(), NOW())`;
    
    // VULNERÁVEL: Execução direta de SQL sem parametrização
    const [result] = await sequelize.query(query, { type: QueryTypes.INSERT });
    
    // Buscar usuário recém-criado
    const [user] = await sequelize.query(`SELECT id, username, email, createdAt FROM Users WHERE id = ${result}`, 
                           { type: QueryTypes.SELECT });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Atualizar um usuário - VULNERÁVEL A SQL INJECTION e XSS
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.params.id;
    
    // Verificar se os campos foram fornecidos
    if (!username && !email && !password) {
      return res.status(400).json({
        success: false,
        error: 'Forneça pelo menos um campo para atualizar'
      });
    }
    
    // Construir conjunto de valores para atualização
    const updates = [];
    if (username) updates.push(`username = '${username}'`);
    if (email) updates.push(`email = '${email}'`);
    if (password) updates.push(`password = '${password}'`);
    
    // VULNERÁVEL: Interpolação direta dos valores
    const query = `UPDATE Users SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ${userId}`;
    
    // VULNERÁVEL: Execução direta de SQL sem parametrização
    await sequelize.query(query, { type: QueryTypes.UPDATE });
    
    // Buscar usuário atualizado
    const [user] = await sequelize.query(`SELECT id, username, email, createdAt FROM Users WHERE id = ${userId}`, 
                           { type: QueryTypes.SELECT });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Excluir um usuário - VULNERÁVEL
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // VULNERÁVEL: Interpolação direta do parâmetro
    const query = `DELETE FROM Users WHERE id = ${userId}`;
    
    // VULNERÁVEL: Execução direta de SQL sem parametrização
    const [result] = await sequelize.query(query, { type: QueryTypes.DELETE });
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir usuário'
    });
  }
};

// Login vulnerável a ataques de injeção SQL
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // VULNERÁVEL: Interpolação direta dos valores
    // Um atacante pode usar: username: "' OR 1=1 -- " e password: "qualquer coisa"
    // para fazer bypass da autenticação
    const query = `SELECT id, username, email FROM Users 
                  WHERE username = '${username}' AND password = '${password}'`;
    
    // VULNERÁVEL: Execução direta de SQL sem parametrização
    const [user] = await sequelize.query(query, { type: QueryTypes.SELECT });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login'
    });
  }
};