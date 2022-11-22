const e = require("express");
const fs = require("fs");

const isCaptcha = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    await page.goto("https://wpartner.wemakeprice.com/login", {
      waitUntil: "networkidle2",
    });
    let noCaptcha = await page.evaluate(() => {
      if (document.querySelector('img[id="_captchaImage"]') == null) {
        return true;
      } else {
        return false;
      }
    });
    noCaptcha ? reject() : resolve();
  });
};

const getImage = (req, res) => {
  return new Promise(async (resolve, reject) => {
    await page.waitForSelector("#_captchaImage");
    const element = await page.$("#_captchaImage"); // queryselector로 변수 지정 해놓기
    await element.screenshot({ path: __dirname + "apicaptchaImage.png" });
    let data = await fs.readFileSync(__dirname + "apicaptchaImage.png");
    await res.type("image/png");
    await res.write(data);
    await res.send();
    resolve();
  });
};

const refresh = async (req, res) => {
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

const inputCode = async (req, res) => {
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

const inputWithOutCaptcha = async (req, res) => {
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
