var coupang = require("express").Router();
const url = require("url");

coupang.get("/auth", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  var queryData = url.parse(req.url, true).query;
  console.log(queryData);
  if (queryData.code) {
    (async () => {
      // const browser = await puppeteer.launch({
      //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
      // });
      // const page = await browser.newPage();
      const coupang_code = queryData.code;

      await page.evaluate((code) => {
        document.querySelector('input[name="code"]').value = code;
      }, coupang_code);

      //인증하기
      await page.click("#mfa-submit");

      //인증번호 분기처리
      await page.waitForTimeout(2000);
      const authError = await page.evaluate(() => {
        if (document.querySelector('span[id="input-error"]') !== null) {
          return true; //인증번호오류
        } //인증번호정상
        else {
          return false;
        }
      });
      if (authError) {
        //인증번호 오류
        res.send("authError");
        await page.close();
        return;
      } else {
        //인증번호가 정상이라면
        const calculateExist = await page.evaluate(async () => {
          //정산현황에 대한 분기처리
          const calculation = document.querySelector(
            "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
          );
          const expectedDate = document.querySelector(
            'strong[id="expectedPayDate"]'
          );

          const arr = [calculation.textContent, expectedDate.textContent];
          const errorArr = [0];

          if (calculation !== null) {
            //정산현황이 존재할 때
            await page.waitForSelector(
              "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
            );

            // const data = await page.$eval(
            //   "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a",
            //   (element) => element.textContent
            // );
            return arr;
          } else {
            //정산현황이 존재하지 않을 때
            return errorArr;
          }
        });
      }

      console.log("대시보드 접속");
      //기다리기
      //page.waitForNavigation( );
      await page.waitForSelector("#wing-top-main-side-menu");

      // //정산 현황 접속
      // await page.goto('https://wing.coupang.com/tenants/finance/wing/contentsurl/dashboard');
      // await page.waitForSelector('#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a');
      // let data = await page.$eval('#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a', (element) => element.textContent);
      // console.log(data);

      //브라우저 꺼라
      console.log("ok");
      res.json({ price: calculation });
    })();
  } else {
    res.send("type code [' /?code=??? ']");
  }
});

module.exports = coupang;
