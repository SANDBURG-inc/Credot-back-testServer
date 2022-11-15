const fs = require("fs");

const isIdPwError = async (queryData, res) => {
  return new Promise(async (resolve, reject) => {
    const wmp_id = queryData.id;
    const wmp_pw = queryData.pw;

    await page.goto("https://wpartner.wemakeprice.com/login");

    await page.evaluate(
      (id, pw) => {
        document.querySelector('input[name="loginid"]').value = id;
        document.querySelector('input[name="loginpassword"]').value = pw;
      },
      wmp_id,
      wmp_pw
    );
    await page.waitForSelector("#_captchaImage");
    const element = await page.$("#_captchaImage"); // queryselector로 변수 지정 해놓기
    await element.screenshot({ path: __dirname + "apicaptchaImage.png" });
    let data = await fs.readFileSync(__dirname + "apicaptchaImage.png");
  });
};

module.exports = {
  isIdPwError,
};
