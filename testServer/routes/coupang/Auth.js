var coupang = require("express").Router();
const url = require("url");

coupang.get("/auth", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  (async () => {
    let authError = true;
    let calculateExist = false;

    var queryData = url.parse(req.url, true).query;
    console.log(queryData);

    if (queryData.code) {
      const coupang_code = queryData.code;
      await page.evaluate((code) => {
        console.log("ff");
        document.querySelector('input[name="code"]').value = code;
      }, coupang_code);
      //인증하기
      await page.click("#mfa-submit");
      //인증번호 분기처리
      await page.waitForTimeout(2000);
      authError = await page.evaluate(() => {
        return document.querySelector('span[id="input-error"]') !== null; //오류 : 정상
      });
    }

    if (!authError) {
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
      console.log("ok");
      res.json({ price: data[0], deadline: data[1] });
      return;
    }

    await page.waitForSelector("#wing-top-main-side-menu");
    console.log("ok");
    res.send("authError");
  })();
});

module.exports = coupang;