const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//ACCESS & REFRESH TOKENS
let refreshTokens = [];
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, "myRefreshSecretKey");
};

router.post("/refresh", (req, res) => {
  //retrieve refresh token from user
  const refreshToken = req.body.token;

  //send error if not valid
  if (!refreshToken) {
    return res.status(401).json("You are not authenticated");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("refresh token is not valid");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
  //if valid, create new access token and send to user
});

//VERIFY
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//UPDATE PROFILE PICTURE
router.put("/updateProfilePicture", async (req, res) => {
  const id = req.body.id;
  const profilePicture = req.body.profilePicture;

  User.findByIdAndUpdate(
    id,
    { $set: { profilePicture: profilePicture } },
    { new: false },
    (err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    }
  );
});

//GET PROFILE PICTURE
router.post("/getProfilePicture", async (req, res) => {
  const username = req.body.username;
  try {
    const users = await User.find({ username: username });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //find user
    let accessToken = null;
    let refreshToken = null;
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      accessToken = generateAccessToken(user);
      refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
    } else {
      res.status(400).json("Wrong username or password");
      return;
    }

    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("Wrong username or password");
      return;
    }

    //send response
    res.status(200).json({
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGOUT
router.post("/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("you logged out successfully");
});

//DELETE
router.delete("/:id", verify, (req, res) => {
  if (req.user._id === req.params._id || req.body.username === "adminman") {
    const { id } = req.body;

    User.findOneAndDelete(id, (err) => {
      if (err) {
        return res.send(err);
      } else {
        return res.status(200).json({ success: true });
      }
    });
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

module.exports = router;
