const express = require("express");
const router = express.Router();
const crawl = require("./api/Crawl.js");
const auth = require("./api/Auth.js");

router.get("/crawl", async (req, res) => {
  crawl(req, res);
});
router.get("/auth", async (req, res) => {
  auth(req, res);
});

module.exports = router;
