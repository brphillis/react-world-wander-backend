const mongoose = require("mongoose");

const FlaggedReviewSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    reviewCreator: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 15,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlaggedReview", FlaggedReviewSchema);
