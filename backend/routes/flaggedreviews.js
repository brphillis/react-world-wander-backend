const router = require("express").Router();
const FlaggedReview = require("../models/FlaggedReview");

//create flagged review
router.post("/", async (req, res) => {
  const newFlaggedReview = new FlaggedReview(req.body);
  try {
    const savedFlaggedReview = await newFlaggedReview.save();
    res.status(200).json(savedFlaggedReview);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all flagged reviews
router.get("/", async (req, res) => {
  try {
    const flaggedReviews = await FlaggedReview.find();
    res.status(200).json(flaggedReviews);
  } catch (err) {
    res.status(500).json(er);
  }
});

//delete a flagged review ( complete the task )
router.put("/deleteFlaggedReview", async (req, res) => {
  const id = req.body.id;

  FlaggedReview.findByIdAndRemove(id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted Flagged Review : ", docs);
      res.json(docs);
    }
  });
});
module.exports = router;
