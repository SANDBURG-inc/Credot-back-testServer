var coupang = require("express").Router();
const url = require("url");

coupang.get("/crawl", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  var queryData = url.parse(req.url, true).query;

  if (queryData.id && queryData.pw) {
    (async () => {
      // const browser = await puppeteer.launch({
      //   //args: ["--no-sandbox", "--disable-setuid-sandbox"]
      //   //args: ["--no-sandbox"]
      //   headless : false
      // });
      // const page = await browser.newPage();
      const coupang_id = queryData.id;
      const coupang_pw = queryData.pw;

      //쿠팡wing 로그인 페이지
      await page.goto("https://wing.coupang.com/login");
      console.log("coupang_id");
      console.log(coupang_id);
      console.log(coupang_pw);

      //아이디랑 비밀번호 란에 값을 넣어라
      await page.evaluate(
        (id, pw) => {
          document.querySelector('input[name="username"]').value = id;
          document.querySelector('input[name="password"]').value = pw;
        },
        coupang_id,
        coupang_pw
      );
      //test

      //로그인
      await page.click('input[name="login"]');
      console.log("loginClicked");

      //분기처리
      //먼저 idpw 분기처리
      await page.waitForTimeout(2000);
      const idpwError = await page.evaluate(() => {
        //아이디비번 오류처리를 idpwError에 boolean 값으로 저장
        if (document.querySelector('span[id="input-error"]') !== null) {
          return true; //아이디비번오류
        } //아이디비번 정상일때
        else {
          return false;
        }
      });
      console.log("idpwError:" + idpwError);

      if (idpwError) {
        //아이디비번에 오류있을때
        res.send("idpwError");
      } else {
        //아이디비번이 정상일때

        const dashError = await page.evaluate(async () => {
          //대시보드가 바로 접속되느냐 인증번호를 받느냐
          if (
            document.querySelector('button[id="top-header-hamburger"]') !== null
          ) {
            //아이디비번이 정상이지만 접속로그때문에 대시보드로 바로 진입할때
            return true;
          } else {
            //인증번호 받기로 넘어갈때
            return false;
          }
        });

        console.log("dashError:" + dashError);

        if (dashError) {
          //아이디비번이 정상이지만 접속로그때문에 대시보드로 바로 진입할때
          await page.goto(
            "https://wing.coupang.com/tenants/finance/wing/contentsurl/dashboard"
          ); //정산현황페이지로 이동

          await page.waitForTimeout(1000); //로드되는 시간을 기다려준다
          console.log("dad");

          const calculation = await page.evaluate(async () => {
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
              return calculateExist.textContent;
            } else {
              //정산현황이 존재하지 않을 때
              return 100;
            }
          });
          console.log(calculation);

          //브라우저 꺼라

          console.log("ok");
          res.json({ price: calculation });
          return;
        } else {
          // 인증번호 받기로 넘어갈때

          //인증번호 받기_메일
          await page.waitForSelector("#btnEmail");
          await page.click("#btnEmail");

          //인증 버튼 기다리기
          await page.waitForSelector("#auth-mfa-code");
          res.send("auth");
        }
      }

      // //인증번호 받기_휴대전화
      // await page.waitForSelector('input[name="mfaType"]');
      // await page.click('input[name="mfaType"]');

      //브라우저 꺼라
      //await browser.close();
    })();
  }

  //res.render('index', { title: 'Cre dot Api server' , id: queryData.id, pw: queryData.pw});
});

module.exports = coupang;
