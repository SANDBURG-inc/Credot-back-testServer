const express = require("express");
const router = express.Router();
const crawl = require("./api/crawl.js");
const fs = require("fs");

router.get("/crawl", async (req, res) => {
  crawl(req, res);
});

module.exports = router;
