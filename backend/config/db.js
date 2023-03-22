const mongoose = require("mongoose");

// connection
const { DB_USER, DB_PASS } = process.env;

const conn = async () => {
    try {
        const dbConn = await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ijmusti.mongodb.net/?retryWrites=true&w=majority`
        );

        console.log("Conectou com sucesso!!!");

        return dbConn;
    } catch (error) {
        console.log(error);
        throw new Error("Não foi possível conectar ao banco de dados.");
    }
};

conn();

module.exports = conn;