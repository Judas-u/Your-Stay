const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pasportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

User.plugin(pasportLocalMongoose);

module.exports = mongoose.model("User", userSchema);