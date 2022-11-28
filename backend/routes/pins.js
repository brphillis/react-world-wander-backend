const router = require("express").Router();
const Pin = require("../models/Pin");

//create pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(er);
  }
});

//add Review
router.put("/addReview", async (req, res) => {
  console.log(req.body.username);
  const id = req.body.id;

  // prettier-ignore
  Pin.findByIdAndUpdate(
    id,
    {
      $push: {
        review: {
          username: req.body.username,
          title: req.body.title,
          desc: req.body.desc,
          rating: req.body.rating,
          pictures: req.body.pictures,
        },
      },
    },

    { new: false },
    (err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    }
  );
});

module.exports = router;
