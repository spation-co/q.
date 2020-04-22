const express = require("express"); //importo express anche qui
const mongoose = require("mongoose"); //importo express anche qui
const router = express.Router(); //importo un modolo di express e lo chiamo 'router' cosicchè lo possa usare in questo file collegandolo con un middleware per ogni volta che qualcuno visita /posts
const Post = require("../models/data.js"); //importo il modello del dato creato con mongooseSchema
//const geocoder = require("./geocoder.js");

function isUp2date(lastupdate, timeInterval) {
  var diff = Date.now() - lastupdate.getTime();
  if (diff / (60 * 1000) > timeInterval) {
    return false;
  }
  return true;
}

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db");
  }
);
router.get("/", (req, res) => {
  if (
    req.headers.cookie &&
    req.headers.cookie.indexOf("qspationUserAddress") !== -1
  ) {
    res.render("it/it-list");
  } else {
    res.render("index");
  }
}); // the / sym is root in the host, but i can create any route i want /posts /shop /gallery etc
router.get("/onboarding", (req, res) => {
  res.render("it/it-ob");
});
router.get("/location", (req, res) => {
  res.render("it/it-location");
});
router.get("/current", (req, res) => {
  res.render("it/it-current-supermarket");
});
// router.get('/main', (req,res) => {
//     res.render('it/it-main');
// }); //DEPRECATED ROUTE
router.get("/list", (req, res) => {
  res.render("it/it-list");
});
router.get("/update", (req, res) => {
  res.render("it/it-update");
});
router.get("/update/:id", (req, res) => {
  res.render("it/it-update", { id: req.params.id });
});
router.get("/thanks", (req, res) => {
  res.render("it/it-thanks");
});
router.get("/add", (req, res) => {
  res.render("it/it-add");
});
router.get("/supermarkets", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

/****************************** RETRIEVE A SINGLE SPECIFIC POST BY HIS ID */
//this should happen when the user click on the chosen space/market
router.get("/:postID", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID); //params mi fa accedere ai pezzi della struttura dati postata
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
});

/******************************SUBMIT A POST */
router.post("/", async (req, res) => {
  // db.pois.createIndex( { address: 1 }, {unique:true} )
  //req.body.lastupdate = Date.now();
  const post = new Post(req.body.data);
  try {
    // const unique = await post.index({ address: 1 }, {unique:true}); //to be run once
    const savedPost = await post.save();
    console.log("data sent to the database");
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err }); //res.json produce risposte nel formato json
  }
});

/***************************PATCH A POST */
router.patch("/:postID", async (req, res) => {
  var data = req.body.data;
  if (Object.keys(data).indexOf("people") !== -1) {
    data.lastupdate = new Date();
  }
  console.log(data);
  try {
    const updatePost = await Post.updateOne(
      { _id: req.params.postID }, //becco il post da modificare
      { $set: req.body.data } //specifico cosa modifico e con cosa
    );
    console.log(req.params.postID);
    res.json(updatePost);
  } catch (err) {
    res.json({ message: err });
  }
});

/**************************PUT A POST, AGGIORNAMENTO DI TUTTI I PARAM */
router.put("/:postID", async (req, res) => {
  try {
    if (Object.keys(req.body).indexOf("people") !== -1) {
      req.body.lastupdate = Date.now();
    }
    // console.log();
    //req.body.processingTime = [];
    const putPost = await Post.findByIdAndUpdate(
      req.params.postID, //becco il post da modificare
      req.body,
      { new: true }
    );
    console.log("sent");
    res.json(putPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;