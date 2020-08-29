//IMPORTO EXPRESS
const express = require("express");
//HAGO QUE LA CONSTANTE APP SEA UNA FUNCION EXPRESS
const app = express();
//ASIGNO UN PUERTO
const PORT = process.env.PORT || 5000;
//
//CREO UNA INSTANCIA DE MONOOSE PARA CONECTAME
// A LA BASE DE DATOS MONGO DE MONGO.ATLAS
const mongoose = require("mongoose");

const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("conectado a mongo");
});
mongoose.connection.on("error", () => {
  console.log("error al conectar mongo", err);
});
//------------------------------

//IMPORTO EL MODELO DE USUARIO
require("./models/User");
require("./models/Post");
//-----------------------------

//RUTAS

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/Post"));
app.use(require("./routes/User"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//HAGO QUE LA APP ESCUCHE POR EL PUERTO 'PORT'
app.listen(PORT, () => {
  //HAGO UN CONSOLE LOG PARA QUE POR CONSOLA ME MUESTRE CUANDO ME CONECTO A UN PUERTO
  console.log("corriendo en el puerto", PORT);
});
//---------------------------------------------
