const express = require('express');
const app = express();  
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const listings  = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

const session = require("express-session")
const flash = require("connect-flash");

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// cookies Session

const sessionOptions = {
  secret: "babjikibooty",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

// Basic route
app.get("/", (req, res) => {
  res.send("Hi I am root!");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
})

//  Path -> routes/listing
app.use("/listings", listings);
//  Path -> routes/reviews
app.use("/listings/:id/reviews", reviews);


// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});