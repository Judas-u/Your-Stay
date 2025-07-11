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
const {listingSchema, reviewSchema} = require("./schema.js");
const  Review = require("./models/review.js");

const listings  = require("./routes/listing.js");



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


 

// ✅ Corrected: Validate Review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);  // ← Fixed
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

app.use("/listings", listings);





// Post Reviwes Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  
  console.log("new review saved");
  res.redirect(`/listings/${listing._id}`);  // ✅ only redirect
}));

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {  
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
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