const fs = require("fs");
const http = require("http");

const serverStaticFiles = (res, path, contentType, responseCode = 200) => {
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      res.setHeader("Content-Type", "image/png");
      res.writeHead(500, { "Content-Type": "image/png" });
      return res.end("500 - 서버에러");
    }
    res.writeHead(responseCode, { "Content-Type": contentType });
    res.end(data);
  });
};

const isIdPwError = async (queryData, res) => {
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
  await element.screenshot({ path: __dirname + "captchaImage.png" });

  data = fs.readFileSync("apicaptchaImage.png");

  res.writeHead(200, { "Content-Type": "image/png" });
  res.write(data);
  res.end();

  return false;
};

module.exports = {
  isIdPwError,
};
