const express = require("express");
const router = express.Router();

const coupangRouter = require("./coupang/coupangController.js");
const tmonRouter = require("./tmon/tmonController.js");
const wemakepriceRouter = require("./wemakeprice/wmpController.js");

const puppeteer = require("puppeteer"); //puppeteer require
(async () => {
  global.browser = await puppeteer
    .launch({
      //puppeteer 런칭
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      //args: ["--no-sandbox"]
      headless: false, //headless는 test할때만 true로 두고, 배포 시엔 반드시 false
    })
    .then(console.log("pupp open"));
  global.page = await browser.newPage().then(console.log("pupp open"));
})();

router.use("/coupang", coupangRouter); //쿠팡 라우터를 미들웨어로 사용하겠다 선언
router.use("/tmon", tmonRouter); //티몬 라우터도 마찬가지. commerceController에 들어오는 요청들은 세가지의 미들웨어를 거침.
router.use("/wmp", wemakepriceRouter); //same as above

module.exports = router;
