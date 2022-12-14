const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 15,
    },
    pinType: {
      type: String,
      required: false,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    pinColor: {
      type: String,
      required: false,
    },
    review: [
      {
        username: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          min: 3,
          max: 25,
        },
        desc: {
          type: String,
          required: true,
          min: 30,
          max: 1000,
        },
        rating: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
        },
        pictures: {
          type: Array,
          required: false,
        },
        likes: {
          type: Array,
          required: false,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);
