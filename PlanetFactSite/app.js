const { log } = console;
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();

const port = 3015;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/Public/views'));

app.use(express.static(path.join(__dirname, '/Public')));

const planets = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
);

app.get("/", (req, res) => {
    const mercury = planets.find(p => p.name === "Mercury");

    res.render("home", {
        planet: mercury,
        planets,
        section: "overview",
    });
});

app.get("/planet/:name", (req, res) => {
    const planetName = req.params.name.toLowerCase();
    const section = req.query.section || "overview";

    const planet = planets.find(
        p => p.name.toLowerCase() === planetName
    );

    if (!planet || !planet[section]) {
        return res.status(404).send("Planet not found");
    }

    res.render("home", {
        planet,
        planets,
        section,
    });
});

app.listen(port, (err) => {
    if (err) {
        log("Error starting the server")
    } else
        log(`Server running in the port: ${port}`);
});