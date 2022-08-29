var coupang = require("express").Router();
const url = require("url");

coupang.get("/auth", function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  (async () => {
    let authError = false;
    let calculateExist = false;

    var queryData = url.parse(req.url, true).query;
    console.log(queryData);

    if (queryData.code) {
      const coupang_code = queryData.code;
      await page.evaluate((code) => {
        document.querySelector('input[name="code"]').value = code;
      }, coupang_code);
      //인증하기
      await page.click("#mfa-submit");
      //인증번호 분기처리
      await page.waitForTimeout(2000);
      authError = await page.evaluate(() => {
        return document.querySelector('span[id="input-error"]') == null;
      });
    }

    if (authError) {
      //인증번호가 정상이라면
      await page.goto(
        "https://wing.coupang.com/tenants/finance/wing/contentsurl/dashboard"
      ); //정산현황페이지로 이동
      await page.waitForTimeout(2000); //로드되는 시간을 기다려준다

      calculateExist = await page.evaluate(async () => {
        //정산현황 여부 판단
        return (
          document.querySelector(
            "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
          ) !== null
        );
      });
    }

    if (calculateExist) {
      await page.waitForTimeout(2000);
      let data = await page.evaluate(async () => {
        const calculation = document.querySelector(
          "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
        );
        const expectedDate = document.querySelector(
          'strong[id="expectedPayDate"]'
        );
        return [calculation.textContent, expectedDate.textContent];
      });
      let stDate = new Date();
      let endDate = new Date(data[1]);
      let btMs = endDate.getTime() - stDate.getTime();
      var btDay = parseInt(btMs / (1000 * 60 * 60 * 24));
      let fee = parseInt(
        parseFloat(data[0].replace(/,/g, "")) * (0.0004 * btDay)
      );
      console.log("ok");
      res.json({
        price: data[0],
        deadline: data[1],
        btDay: btDay,
        fee: fee,
      });
      return;
    }

    switch (true) {
      case authError:
      case !calculateExist:
        res.send("103");
        break;
      case !authError:
        res.send("104");
        break;
      default:
        //await page.waitForSelector("#wing-top-main-side-menu");
        console.log("ok");
        break;
    }
  })();
});

module.exports = coupang;
