var express = require("express");
var router = express.Router();

var puppeteer = require("puppeteer");
(async () => {
  global.browser = await puppeteer
    .launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      //args: ["--no-sandbox"]
      headless: false,
    })
    .then(console.log("pupp open"));
  global.page = await browser.newPage().then(console.log("pupp open"));
})();

router.get("/", function (req, res, next) {
  //res.render('index', { title: 'Cre dot Api server'});
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.send("OK");
});

module.exports = router;
