const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const AppError = require("./AppError");

const app = express();
const port = 8080;

mongoose.connect('mongodb://localhost:27017/yelp-camp');
//Online Mongo DB Atlas
// mongoose.connect("mongodb+srv://luckyvarshith24:21Epnx8vum1GIyFR@cluster.kc4rv28.mongodb.net/");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

// app.get('/newcampground', async (req, res) => {
//     const newcamp = new Campground({title : "test", description : "this is a test campground", price : "999"})
//     await newcamp.save();
//     res.send(newcamp);
// })

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Some Thing Went Wrong!" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Serving on http://localhost:${port}`);
});
