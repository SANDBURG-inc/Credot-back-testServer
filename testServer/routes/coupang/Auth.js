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
        await page.goto(
          "https://wing.coupang.com/tenants/finance/wing/contentsurl/dashboard"
        ); //정산현황페이지로 이동
        await page.waitForTimeout(2000); //로드되는 시간을 기다려준다
        
        const data = await page.evaluate(async () => {
          //정산현황에 대한 분기처리
          const calculateExist = document.querySelector(
            "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
          );

          if (calculateExist !== null) {
            //정산현황이 존재할 때

            // const data = await page.$eval(
            //   "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a",
            //   (element) => element.textContent
            // );

            const expectedDate = document.querySelector(
              'strong[id="expectedPayDate"]'
            );

            const arr = [calculateExist.textContent,expectedDate.textContent];
            return arr;
          } else {
            //정산현황이 존재하지 않을 때
            const errorArr = [0];
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
