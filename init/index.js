const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "687642b9c4e5d6b6c63e5943",
  }));
  await Listing.insertMany(listingsWithOwner);
  console.log("data was initialized");
};

initDB();
