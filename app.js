//setando express e cors
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

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

//importando banco
// const db = require("./models/db.js");

/*********** routes ***********/

/*********** route index ***********/
app.get("/", async (req, res) => {
  await Anuncio.findAll({ order: [["id", "DESC"]] }).then(function (anuncios) {
    res.json({ anuncios });
  });
});

/*********** route show ***********/
app.get("/visualizar/:id", async (req, res) => {
  await Anuncio.findByPk(req.params.id).then((anuncio) => {
    return res
      .json({
        error: false,
        anuncio,
      })
      .catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: "Erro: anúncio não encontrado!",
        });
      });
  });
});

/*********** route create ***********/
app.post("/cadastrar", async (req, res) => {
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

/*********** route update ***********/
app.put("/editar/:id", async (req, res) => {
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

/*********** route destroy ***********/
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

app.listen(port, () => {
  console.log(`Executando em: http://localhost:${port}`);
});
