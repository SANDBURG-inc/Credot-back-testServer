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
      await isCaptcha()
        .then(() => {
          //captcha resolve
          res.send(200);
        })
        .catch(() => {
          //captcha reject
          inputWithOutCaptcha(req);
          next();
        });
      break;
    case "getImage":
      await getImage(res);
      break;
    case "refresh":
      await refresh(res);
      break;
    case "input":
      await inputCode(req);
      next();
      break;
  }
});

router.post("/crawl", async (req, res) => {
  crawl(req, res);
});

module.exports = router;
