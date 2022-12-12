const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
      max: 20,
    },
    aboutMe: {
      type: String,
      require: false,
      min: 25,
      max: 250,
    },
    visited: {
      type: Array,
      require: false,
    },
    toVisit: {
      type: Array,
      require: false,
    },
    contributions: {
      type: Number,
      require: false,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
