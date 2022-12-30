const e = require("express");
const fs = require("fs");

const isCaptcha = async () => {
  return new Promise(async (resolve, reject) => {
    await page.goto("https://wpartner.wemakeprice.com/login", {
      waitUntil: "networkidle2",
    });
    let noCaptcha = await page.evaluate(() => {
      //단순하게 querySelector로 img captcha가 존재하는지 여부 판단
      if (document.querySelector('div[class="img_captcha"]') == null) {
        return true;
      } else {
        return false;
      }
    });
    console.log(noCaptcha);
    noCaptcha ? reject() : resolve(); //captcha 없으면 reject
  });
};

const getImage = (res) => {
  return new Promise(async (resolve, reject) => {
    await page.waitForSelector("#_captchaImage");
    const element = await page.$("#_captchaImage"); // queryselector로 변수 지정 해놓기
    await element.screenshot({ path: __dirname + "apicaptchaImage.png" }); //captcha이미지 캡쳐 후 서버내에 저장
    let data = await fs.readFileSync(__dirname + "apicaptchaImage.png");
    await res.type("image/png"); //응답헤더에 image/png헤더 설정
    await res.write(data); //readFileSync를 통해 동기적으로 읽어온 서버내의 captcha파일을 응답바디에 작성
    await res.send(); //응답전송
    resolve();
  });
};

const refresh = async (res) => {
  console.log("refresh");
  await page.click('a[class="btn_sys sml_m btn_cap_2"]').then(async () => {
    await page.waitForSelector('img[id="_captchaImage"]');
    await page.waitForTimeout(300);
    const element = await page.$("#_captchaImage"); // queryselector로 변수 지정 해놓기
    await element.screenshot({ path: __dirname + "apicaptchaImage.png" });
    let data = await fs.readFileSync(__dirname + "apicaptchaImage.png");
    await res.type("image/png");
    await res.write(data);
    await res.send();
  });
};

const inputCode = async (req) => {
  const wmp_id = req.body.id;
  const wmp_pw = req.body.pw;
  const wmp_input = req.body.input;
  console.log(wmp_id, wmp_pw, wmp_input);
  await page.evaluate(
    (id, pw, input) => {
      document.querySelector('input[name="loginid"]').value = id;
      document.querySelector('input[name="loginpassword"]').value = pw;
      document.querySelector('input[class="inpt_default"]').value = input;
    },
    wmp_id,
    wmp_pw,
    wmp_input
  );
};

const inputWithOutCaptcha = async (req) => {
  const wmp_id = req.body.id;
  const wmp_pw = req.body.pw;
  await page.evaluate(
    (id, pw) => {
      document.querySelector('input[name="loginid"]').value = id;
      document.querySelector('input[name="loginpassword"]').value = pw;
    },
    wmp_id,
    wmp_pw
  );
};

module.exports = {
  isCaptcha,
  getImage,
  refresh,
  inputCode,
  inputWithOutCaptcha,
};
