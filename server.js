const express = require("express");
const cors = require("cors"); //cors est necessaire pour l'appel externe des routes
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const session = require('express-session');

const app = express();
// Template Engine
app.engine('ejs', require('express-ejs-extend'));

app.use(cors());
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

// Session
app.use(session({secret: "secret password", resave: false, saveUninitialized: true,}));

// swagger est l'outil qui permet de créer de la documentation
app.use("/optimr/", routes);
app.use(express.static('./'));
app.listen(3100, () => {
    console.log("Serveur en écoute...");
});
exports.app = app;