// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     type: String,
//     default: "https://unsplash.com/photos/people-enter-and-exit-central-market-through-its-entrance-hUZ6PW4VgmY",
//     set: (v) =>
//       v === ""
//         ? "https://unsplash.com/photos/people-enter-and-exit-central-market-through-its-entrance-hUZ6PW4VgmY"
//         : v,
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
