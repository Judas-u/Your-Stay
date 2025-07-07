const express = require('express');
const app = express();  
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.use(methodOverride("_method")); // For PUT and DELETE requests
app.engine("ejs", ejsMate); // Use ejsMate for layout support
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' directory


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

// New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new"); 

})


// Show route 
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const  listing = await Listing.findById(id);
    res.render("listings/show", { listing }); 
});



//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});


//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });  
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});


//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
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