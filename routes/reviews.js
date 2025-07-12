const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

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

// Post Reviwes Route
router.post("/", validateReview, wrapAsync(async (req, res) => {

    // console.log(req.params.id);

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();


  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${listing._id}`);  // ✅ only redirect
}));


// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {  
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;