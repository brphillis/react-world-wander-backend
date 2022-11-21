const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      max: 12,
      unique: false,
    },
    pinList: {
      type: Array,
      require: true,
      max: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
