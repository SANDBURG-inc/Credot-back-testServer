const express = require("express");
const router = express.Router();

const crawlRouter = require("./api/Crawl.js");
const authRouter = require("./api/Auth.js");

router.get("/", (req, res) => {
  res.send("coupang");
});

router.use("/crawl", crawlRouter);
router.use("/auth", authRouter);

module.exports = router;
