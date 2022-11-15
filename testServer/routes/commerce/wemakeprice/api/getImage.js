const fs = require("fs");

module.exports = (req, res) => {
  return new Promise(async (resolve, rejects) => {
    await page.goto("https://wpartner.wemakeprice.com/login");
    await page.waitForSelector("#_captchaImage");
    const element = await page.$("#_captchaImage"); // queryselector로 변수 지정 해놓기
    await element.screenshot({ path: __dirname + "apicaptchaImage.png" });
    let data = await fs.readFileSync(__dirname + "apicaptchaImage.png");
    await res.write(data);
    resolve();
  });
};
