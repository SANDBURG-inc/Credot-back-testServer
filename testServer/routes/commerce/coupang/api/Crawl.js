const router = require("express").Router();
const url = require("url");
const mariadb = require("mysql");

function getContract(req) {
  if (req.user == undefined) {
    return 0;
  }
  const user = {
    email: req.user.email,
  };
  var sql =
    "SELECT ammount FROM contract WHERE email=? and DATE_FORMAT(contractDate,'%Y-%m')=DATE_FORMAT(NOW(),'%Y-%m');";
  var params = [user["email"]];

  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
    }
    if (Object.keys(result).length == 0) {
      return 0;
    }
    var sum = 0;
    for (var i = 0; i < Object.keys(result).length; i++) {
      sum += parseInt(result[i].ammount);
    }
    return sum;
  });
}

router.post("/", function (req, res, next) {
  var idpwError = false;
  var dashError = false;
  var calculateExist = false;

  var queryData = url.parse(req.url, true).query;

  (async () => {
    if (queryData.id && queryData.pw) {
      const coupang_id = queryData.id;
      const coupang_pw = queryData.pw;

      //쿠팡wing 로그인 페이지
      await page.goto("https://wing.coupang.com/login");

      //아이디랑 비밀번호 란에 값을 넣기
      await page.evaluate(
        (id, pw) => {
          document.querySelector('input[name="username"]').value = id;
          document.querySelector('input[name="password"]').value = pw;
        },
        coupang_id,
        coupang_pw
      );

      //로그인
      await page.click('input[name="login"]');

      //idpw 분기처리
      await page.waitForTimeout(3000);
      idpwError = await page.evaluate(() => {
        //idpw에러 판단
        var check = document.querySelector('span[id="input-error"]') !== null;
        return check; //오류:정상
      });
      console.log("idpwError:" + idpwError);
    }

    if (!idpwError) {
      //idpw분기처리

      dashError = await page.evaluate(async () => {
        //대시보드 에러 판단
        return (
          document.querySelector('button[id="top-header-hamburger"]') !== null
        );
      });

      console.log("dashError:" + dashError);
    }

    if (dashError) {
      //아이디비번이 정상이지만 접속로그때문에 대시보드로 바로 진입할때
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
      var btDay = parseInt(
        (endDate.getTime() - stDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      let fee = parseInt(
        parseFloat(data[0].replace(/,/g, "")) * (0.0004 * btDay)
      );
      console.log("ok");
      res.json({
        price: data[0] - getContract(req),
        deadline: data[1],
        btDay: btDay,
        fee: fee,
      });
      return;
    }

    switch (true) {
      case idpwError:
        res.send("101");
        break;
      case dashError:
      case !calculateExist:
        res.send("102");
        break;
      default:
        await page.waitForSelector("#btnEmail");
        await page.click("#btnEmail");
        // await page.waitForSelector('input[name="mfaType"]');
        // await page.click('input[name="mfaType"]');
        //인증 버튼 기다리기
        await page.waitForSelector("#auth-mfa-code");
        res.send("200");
        break;
    }
  })();
});

module.exports = router;
