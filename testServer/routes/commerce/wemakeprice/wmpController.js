const express = require("express");
const router = express.Router();
const crawl = require("./api/crawl.js");
const getImage = require("./api/getImage.js");
const fs = require("fs");

router.get("/crawl", async (req, res) => {
  crawl(req, res);
});
router.get("/getImage", async (req, res) => {
  getImage(req, res);
});

module.exports = router;
