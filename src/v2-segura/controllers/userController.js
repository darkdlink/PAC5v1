// Controlador de usuário - Versão 2.0 (Segura) para MySQL
const User = require('../models/User'); // Caminho corrigido
const bcrypt = require('bcrypt');

// Listar todos os usuários - SEGURO
exports.getAllUsers = async (req, res) => {
  try {
    // SEGURO: Usando métodos do Sequelize
    let users;
    
    if (req.query.filter) {
      // SEGURO: Usando parâmetros nomeados em vez de interpolação direta
      users = await User.findAll({
        where: {
          username: {
            [User.sequelize.Op.like]: `%${req.query.filter}%`
          }
        },
        attributes: ['id', 'username', 'email', 'createdAt']
      });
    } else {
      users = await User.findAll({
        attributes: ['id', 'username', 'email', 'createdAt']
      });
    }
    
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

// Obter um usuário por ID - SEGURO
exports.getUserById = async (req, res) => {
  try {
    // Validação de ID - garantir que é um número inteiro
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuário inválido'
      });
    }
    
    // SEGURO: Usando métodos do Sequelize
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'createdAt']
    });
    
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

// Atualizar um usuário - SEGURO
exports.updateUser = async (req, res) => {
  try {
    // Verificar se o usuário está tentando atualizar suas próprias informações
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a atualizar este usuário'
      });
    }
    
    const updateData = {};
    
    // Adicionar apenas campos permitidos ao objeto de atualização
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    
    // Se houver uma nova senha, hashear antes de salvar
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    
    // SEGURO: Usando métodos do Sequelize
    const [updated] = await User.update(updateData, {
      where: { id: req.params.id }
    });
    
    if (updated === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Buscar o usuário atualizado
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'createdAt']
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário'
    });
  }
};

// Excluir um usuário - SEGURO
exports.deleteUser = async (req, res) => {
  try {
    // Verificar se o usuário está tentando excluir sua própria conta
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a excluir este usuário'
      });
    }
    
    // SEGURO: Usando métodos do Sequelize
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
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