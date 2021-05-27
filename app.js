//setando express e cors
const express = require("express");
const cors = require("cors");
const upload = require('./middlewares/uploadImgAnuncio');
const fs = require('fs') // trabalhar com arquivos
const path = require('path') // trabalhar com rotas
const app = express();
const port = 8001;

//importando model
const Anuncio = require("./models/Anuncio");

//usar cors com middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //liberando acesso para que qualquer URL possa requisitar
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); //permitindo os metodos do CRUD
  res.header(
    "Access-Control-Allow-Header",
    "X-PINGOTHER, Content-Type, Authorization"
  ); //liberando para aceitar envio de conteúdo via create
  app.use(cors());
  next();
});

//permitir que a aplicação receba dados em JSON
app.use(express.json());
//transformando o diretório "public/upload" na rota "/files" e setando-os como publico e estaticos para acesso externo
app.use('/files', express.static(path.resolve(__dirname, "public", "upload"))) 

/******************************************** route index ********************************************/
app.get("/", async (req, res) => {
  await Anuncio.findAll({ order: [["id", "DESC"]] }).then(function (anuncios) {
    res.json({ anuncios });
  });
});

/******************************************** route show ********************************************/
app.get("/visualizar/:id", async (req, res) => {
  await Anuncio.findByPk(req.params.id)
    .then((anuncio) => {
      if(anuncio.imagem) {
        var endereco_imagem = "http://localhost:8001/files/anuncios/" + anuncio.imagem; 
      }else {
        var endereco_imagem = "http://localhost:8001/files/anuncios/icone_anuncio.jpg"; 
      }
      return res.json({
          error: false,
          anuncio,
          endereco_imagem
      }).catch(function (erro) {
          return res.status(400).json({
            error: true,
            message: "Erro: anúncio não encontrado!",
          });
        });
    });
});

/******************************************** route create ********************************************/
app.post("/cadastrar", async (req, res) => {

  //pausar o processamento por 3ms
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
  }
  await sleep(3000);
  //create
  const resultCad = await Anuncio.create(req.body)
    .then(function () {
      return res.json({
        error: false,
        message: "Anuncio cadastrado com sucesso",
      });
    })
    .catch(function (erro) {
      return res.status(400).json({
        error: true,
        message: "Erro: Anuncio não cadastrado com sucesso!",
      });
    });
});

/******************************************** route update ********************************************/
app.put("/editar/", async (req, res) => {

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
  }
  await sleep(3000);

  await Anuncio.update(req.body, {
    where: { id: req.body.id },
  }).then(function () {
    return res
      .json({
        error: false,
        message: "Anuncio atualizado com sucesso!",
      })
      .catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: "Anuncio não atualizado com sucesso!",
        });
      });
  });
});
/******************************************** route put imagem  ********************************************/
app.put('/editar-anuncio-img/:id', upload.single('imagem'), async (req, res) => { //upload.single('campo na tabela no db')

  //pausar o processamento por 3ms
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
  }
  await sleep(3000);

  if (req.file) { 
    await Anuncio.findByPk(req.params.id) //deletando imagem antiga do id da pasta public 
      .then(anuncio => {
        const imgAntiga = "./public/upload/anuncios/" + anuncio.dataValues.imagem; //variavel que recebe imagem antiga upada  
        fs.access(imgAntiga, (err) => {    //trabalhando com fs para apagar imagem da pasta via codigo
          if (!err) {
            fs.unlink(imgAntiga, () => { })   //apagando via fs
          }
        })
      }).catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: "Erro: anúncio não encontrado"
        })
      })

    await Anuncio.update({ imagem: req.file.filename }, { where: { id: req.params.id } }) //upando imagem no banco de um anuncio específico com id
      .then(function () {
        return res.json({
          error: false,
          message: "Imagem inserida com sucesso!"
        })
      }).catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: "Erro: falha ao inserir imagem!"
        })
      })

  } else {
    return res.status(400).json({
      error: false,
      message: "Erro: selecione uma imagem válida"
    })
  }
})

/******************************************** route destroy ********************************************/
app.delete("/apagar/:id", async (req, res) => {
  await Anuncio.destroy({
    where: { id: req.params.id },
  }).then(function () {
    return res
      .json({
        error: false,
        message: "Anuncio apagado com sucesso!",
      })
      .catch(function (erro) {
        res.status(400).json({
          error: true,
          message: "Erro: Anuncio não apagado com sucesso!",
        });
      });
  });
});

/******************************************** ouvindo porta ********************************************/

app.listen(port, () => {
  console.log(`Executando em: http://localhost:${port}`);
});
