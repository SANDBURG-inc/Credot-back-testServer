const express = require("express");
const router = express.Router();
const crawl = require("./api/crawl.js");
const {
  isCaptcha,
  getImage,
  refresh,
  inputCode,
  inputWithOutCaptcha,
} = require("./api/getImageModule.js");
const fs = require("fs");

router.use("/crawl", async (req, res, next) => {
  switch (req.query.option) {
    case "isCaptcha":
      await isCaptcha(req, res)
        .then(() => {
          res.status(200);
        })
        .catch(() => {
          inputWithOutCaptcha(req, res);
          next();
        });
      break;
    case "getImage":
      await getImage(req, res);
      break;
    case "refresh":
      await refresh(req, res);
      break;
    case "input":
      await inputCode(req, res);
      next();
      break;
  }
});

router.post("/crawl", async (req, res) => {
  crawl(req, res);
});

module.exports = router;
