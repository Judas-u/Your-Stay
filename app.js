const express = require('express');
const app = express();  
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const wrapAsync = require('./utils/wrapAsync');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const {listingSchema} = require("./schema.js");
const  Review = require("./models/review.js");


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

// Basic route
app.get("/", (req, res) => {
  res.send("Hi I am root!");
});


const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};


// Index route 
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings }); 
}));

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new"); 
});

// Show route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  res.render("listings/show", { listing }); 
}));


// Create Route
app.post("/listings", 
  validateListing,
  wrapAsync(async (req, res,) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));


// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  res.render("listings/edit", { listing });  
}));

// Update Route
app.put("/listings/:id",validateListing,
   wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError("Listing not found", 404);
  }
  res.redirect("/listings");
}));

// Reviwes 
app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  
  console.log("new review saved");
  res.redirect(`/listings/${listing._id}`);  // ✅ only redirect
}));



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