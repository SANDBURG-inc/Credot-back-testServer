const express = require("express");
const router = express.Router();
const crawl = require("./api/crawl.js");

router.post("/crawl", async (req, res) => {
  crawl(req, res);
});

module.exports = router;
