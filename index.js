// Express
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// Mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clase-node'
});

// Start connection to database
connection.connect();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hola mundo soy Carlos Paez");
});

app.get("/personajes", (req, res) => {
    connection.query('SELECT * FROM personajes', function(error, results, fields) {
        if (error) {
            return res.status(400).json({ "error": "Consulta no valida" });
        }
        res.status(200).json(results);
    });
});

app.get("/personajes/:id", (req, res) => {

    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ "error": "Parametros no validos" });
    }

    connection.query(`SELECT * FROM personajes WHERE id = ?`, [id], function(error, results, fields) {
        if (error) {
            return res.status(400).json({ "error": "Consulta no valida" });
        }

        if (results.length === 0) {
            return res.status(400).json({ "error": `El personaje con el id ${id} no existe` });
        }

        res.status(200).json(results);
    });
});

// Listening port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});