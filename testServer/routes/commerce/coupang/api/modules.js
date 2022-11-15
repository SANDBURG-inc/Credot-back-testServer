const getContract = require("../../getContract");

const isIdPwError = async (queryData) => {
  return new Promise(async (resolve, reject) => {
    const coupang_id = queryData.id;
    const coupang_pw = queryData.pw;

    //쿠팡wing 로그인 페이지
    await page.goto("https://wing.coupang.com/login", {
      waitUntil: "networkidle2",
    });

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
    await page.waitForTimeout(1000);

    let ischangeBtn = await page.evaluate(() => {
      //idpw에러 판단
      let check = document.querySelector('button[class="change-btn"]') !== null;
      return check; //있으면 true, 없으면 false
    });

    if (ischangeBtn) {
      await page.click('button[class="icon-close"]');
    }

    //idpw 분기처리
    await page.waitForTimeout(2000);
    let idpwError = await page.evaluate(() => {
      //idpw에러 판단
      let check = document.querySelector('span[id="input-error"]') !== null;
      return check; //오류:정상
    });
    resolve(idpwError);
  });
};

const isLoginAuth = async (idpwError) => {
  return new Promise(async (resolve, reject) => {
    if (idpwError == false) {
      //idpw분기처리
      let isAuth = await page.evaluate(() => {
        if (
          document.querySelector('button[id="top-header-hamburger"]') !== null
        ) {
          //햄버거가 있으면
          return false; //대시보드로 바로 드간거
        } else {
          return true; //안드간거
        }
      });
      resolve(isAuth);
    }
    resolve(true);
  });
};

const isCalculationExists = async (isLoginAuth) => {
  return new Promise(async (resolve, reject) => {
    if (!isLoginAuth) {
      //아이디비번이 정상이지만 접속로그때문에 대시보드로 바로 진입할때
      await page.goto(
        "https://wing.coupang.com/tenants/finance/wing/contentsurl/dashboard"
      ); //정산현황페이지로 이동

      await page.waitForSelector(
        "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
      );

      let calculateExist = await page.evaluate(async () => {
        //정산현황 여부 판단
        return (
          document.querySelector(
            "#seller-dashboard > div.dashboard-widget > div > strong:nth-child(3) > a"
          ) !== null
        );
      });
      resolve(calculateExist);
    } else {
      resolve(false);
    }
  });
};

const isAuthError = async (queryData) => {
  return new Promise(async (resolve, reject) => {
    const coupang_code = queryData.code;
    await page.evaluate((code) => {
      document.querySelector('input[name="code"]').value = code;
    }, coupang_code);
    //인증하기
    await page.click("#mfa-submit");
    //인증번호 분기처리
    await page.waitForTimeout(2000);
    authError = await page.evaluate(() => {
      if (document.querySelector('span[id="input-error"]') == null) {
        return false;
      } else {
        return true;
      }
    });
    resolve(authError);
  });
};

const getSettlement = async (req, calculateExist, res) => {
  return new Promise(async (resolve, reject) => {
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
      let btDay = await parseInt(
        (endDate.getTime() - stDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      prevContract = await getContract(req);
      let price = parseFloat(data[0].replace(/,/g, "")) - prevContract;
      let fee = await parseInt(parseFloat(price) * (0.004 * btDay));
      res.json({
        price: price,
        deadline: data[1],
        btDay: btDay,
        fee: fee,
      });
      resolve(console.log("전송완료"));
    } else {
      resolve(console.log("정산현황 존재x"));
    }
  });
};

module.exports = {
  isIdPwError,
  isLoginAuth,
  isAuthError,
  isCalculationExists,
  getSettlement,
};
