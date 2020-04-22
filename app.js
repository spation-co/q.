const express = require("express");
const app = express(); //create routes
const mongoose = require("mongoose");
const path = require("path");
var ejs = require("ejs");
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require("cors");
app.set("view engine", "ejs");
const Post = require("./models/data.js");
const port = 80;
app.set("views", path.join(__dirname, "q.spation.co"));
app.use(express.static(path.join(__dirname, "/q.spation.co")));
app.listen(port); //start listening on port specified

/****************************************** ROUTES */
const postRoute = require("./routes/post"); //import routes modules as required

// app.post('/addSpace', (req,res) => {
//     console.log(req.data);
//     res.end();
// });
/***************************************** MIDDLEWARE logic to run when we hit a route (useful for auth verification) */
app.use(bodyParser.json());
app.use("/", postRoute); //middleware per usare la route corretta quando ci troviamo su /post

/***************************************** CONNECT TO DB */
