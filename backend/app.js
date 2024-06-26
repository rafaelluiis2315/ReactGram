require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

// Confing json and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB connection
require("./config/db.js");

// routes
const router = require("./routes/Router.js");
app.use(router);

// Lida com erros
app.use((err, req, res, next) => {
    console.error(err.stack);

    if(err.stack.includes("Por favor, envie apenas png ou jpg")){
        return res.status(422).json({errors: ["Por favor, envie apenas png ou jpg"]});
    }

    res.status(500).send("Erro interno do servidor.");

});

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
})