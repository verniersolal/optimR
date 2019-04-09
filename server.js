const express = require("express");
const cors = require("cors"); //cors est necessaire pour l'appel externe des routes
const bodyParser = require("body-parser");
const routes  = require("./routes/routes");

const app = express();
app.use(cors());
app.use(bodyParser.json({type : 'application/json'}));
// swagger est l'outil qui permet de créer de la documentation
app.use("/optimr/", routes);


app.listen(3100, () => {
    console.log("Serveur en écoute...");
});
exports.app = app;