const Sequelize = require('sequelize');
const sequelize = require('./db');

// conexão com o banco
const db = require('./db');

//criando model e tables
const Anuncio = db.define('anuncios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: true
    }
    
})

//Criar tabela
Anuncio.sync(); 

//exportando o anuncio
module.exports = Anuncio;