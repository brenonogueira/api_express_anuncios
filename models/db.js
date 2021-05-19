const { Sequelize } = require('sequelize');

//criando conexão com o banco de dados
const sequelize = new Sequelize('imersao', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

//confirmando se a conexão foi feita com sucesso
sequelize.authenticate().then(function(){
    console.log("Conexão com o DB realizada com sucesso!")
}).catch(function(err){
    console.log("Erro! conexão com o DB não realizada com sucesso!")
})

module.exports = sequelize;