const url = require("url");
const modules = require("./modules");

const crawl = async (req, res) => {
  let queryData = url.parse(req.url, true).query;
  let idpwError = await modules.isIdPwError(queryData);
  if (idpwError) {
    res.send("아이디랑 비밀번호를 확인해주세요");
    return;
  }
  await page.goto(
    "https://spc-settlement.tmon.co.kr/statement/partner?flag=due"
  );
  await page.click('button[class="btn orange"]');
  await page.waitForTimeout(2000);
  data = await page.evaluate(() => {
    return document.querySelector('p[class="pointClr fw-b fz14"]').innerText;
  });
  res.send(data);
};

module.exports = crawl;
