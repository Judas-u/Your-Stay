const express = require('express');
const app = express();  // ← You need this line!
const mongoose = require("mongoose");

app.get("/", (req, res) => {
    res.send("Hi I am root !");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});