const router = require("express").Router();
const FlaggedReview = require("../models/FlaggedReview");

router.post("/", async (req, res) => {
  const newFlaggedReview = new FlaggedReview(req.body);
  try {
    const savedFlaggedReview = await newFlaggedReview.save();
    res.status(200).json(savedFlaggedReview);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
