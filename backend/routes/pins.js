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

//get all pin images
router.post("/getAllPinImages", async (req, res) => {
  const id = req.body.id;
  try {
    const mergedImages = [];
    const pins = await Pin.findById(id);
    for (var i = 0; i < pins.review.length; i++) {
      for (var j = 0; j < pins.review[i].pictures.length; j++) {
        mergedImages.push(pins.review[i].pictures[j]);
      }
    }
    res.status(200).json(mergedImages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//gets requested amount of reviews
router.post("/getLimitedReviews", async (req, res) => {
  const id = req.body.id;

  const startIndex = req.body.startIndex;
  const endIndex = req.body.endIndex;

  try {
    const mergedReviews = [];
    const reviews = await Pin.findById(id);

    reviews.review.forEach((e, i = startIndex) => {
      if (i < endIndex) {
        mergedReviews.push(e);
      }
    });

    res.status(200).json(mergedReviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

//add review
router.put("/addReview", async (req, res) => {
  const id = req.body.id;

  Pin.findByIdAndUpdate(
    id,
    {
      // prettier-ignore
      $push: {
        'review': {
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

//add a like
router.put("/addLike", async (req, res) => {
  currentUser = req.body.currentUser;
  const id = req.body.id;
  const index = req.body.index;

  Pin.findByIdAndUpdate(
    id,
    {
      // prettier-ignore
      $push: { ['review.' + index + '.likes'] :  currentUser  },
    },
    { new: false },
    (err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    }
  );
});

//delete a like
router.put("/deleteLike", async (req, res) => {
  currentUser = req.body.currentUser;
  const id = req.body.id;
  const index = req.body.index;

  Pin.findByIdAndUpdate(
    id,
    {
      // prettier-ignore
      $pull: { ['review.' + index + '.likes'] :  currentUser  },
    },
    { new: false },
    (err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    }
  );
});

module.exports = router;
