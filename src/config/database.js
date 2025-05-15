// Configuração do banco de dados MySQL
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'seguranca_api',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL conectado com sucesso.');
    
    // Sincronizar modelos (criar tabelas se não existirem)
    // force: true irá dropar as tabelas e recriá-las
    // Em ambiente de produção, é melhor usar migrations
    await sequelize.sync({ force: false });
    
    return sequelize;
  } catch (err) {
    console.error(`Erro ao conectar ao MySQL: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };