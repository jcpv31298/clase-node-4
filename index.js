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
    database: 'celulares'
});

// Start connection to database
connection.connect();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hola mundo soy Carlos Paez");
});

app.get("/celular", (req, res) => {
    connection.query('SELECT * FROM celular', function(error, results, fields) {
        if (error) {
            return res.status(400).json({ error: "Consulta no valida" });
        }
        res.status(200).json(results);
    });
});

app.get("/celular/:id", (req, res) => {

    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ error: "Parametros no validos" });
    }

    connection.query(`SELECT * FROM celular WHERE id = ?`, [id], function(error, results, fields) {
        if (error) {
            return res.status(400).json({ error: "Consulta no valida" });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: `El celular con el id ${id} no existe` });
        }

        res.status(200).json(results);
    });
});

app.post("/celular", (req, res) => {

    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;

    connection.query('INSERT INTO celular(marca,modelo,descripcion,precio) VALUES(?,?,?,?)', [marca, modelo, descripcion, precio], function(error, results, fields) {
        if (error) {
            return res.status(400).json({ "error": "Consulta no valida" });
        }
        res.status(200).json({ success: "Registro insertado correctamente." });
    });
});

// Listening port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});