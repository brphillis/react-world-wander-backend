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

//edit a review
router.put("/updateReview", async (req, res) => {
  const id = req.body.id;
  const reviewid = req.body.reviewId;
  const title = req.body.title;
  const desc = req.body.desc;
  const rating = req.body.rating;
  const pictures = req.body.pictures;

  Pin.findOneAndUpdate(
    {
      _id: id,
      review: {
        $elemMatch: {
          _id: reviewid,
        },
      },
    },
    {
      $set: {
        "review.$[outer].title": title,
        "review.$[outer].desc": desc,
        "review.$[outer].rating": rating,
        "review.$[outer].pictures": pictures,
      },
    },
    {
      arrayFilters: [{ "outer._id": reviewid }],
    },

    (err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    }
  );
});

//get a review
router.post("/getReview", async (req, res) => {
  const id = req.body.id;
  const reviewid = req.body.reviewid;

  Pin.findOne(
    { _id: id },
    { review: { $elemMatch: { _id: reviewid } } },

    (err, doc) => {
      if (err) return console.log(err);
      res.json(doc.review);
    }
  );
});

//delete a review
router.put("/deleteReview", async (req, res) => {
  const id = req.body.id;
  const reviewid = req.body.reviewId;
  console.log(req);

  Pin.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $pull: { review: { _id: reviewid } },
    },
    (err, doc) => {
      if (err) {
        return console.log(err);
      } else {
        if (doc.review.length === 1) {
          Pin.findOneAndDelete(id, (err) => {
            if (err) {
              return res.send(err);
            } else {
              return res.status(200).json({ success: true });
            }
          });
        } else {
          res.json(doc);
        }
      }
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
