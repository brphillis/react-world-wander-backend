const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const verifyRoute = require("./routes/verify");
const flaggedReviewRoute = require("./routes/flaggedreviews");

dotenv.config();

app.use(express.json({ limit: "50mb" }));

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/flaggedreviews", flaggedReviewRoute);

app.listen(8800, () => {
  console.log("backend server running");
});
