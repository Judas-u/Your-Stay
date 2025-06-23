const express = require('express');
const app = express();  
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("Hi I am root !");
});

// Index route 
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // Correct path: "listings/index"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});

// Show route 
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const  listing = await Listing.findById(id);
    res.render("listings/show", { listing }); 
});

// Test route to create a sample listing (commented out as in your original)
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Beachside Stay",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("successful testing");
// });

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});