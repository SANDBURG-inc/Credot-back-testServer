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
  let stDate = new Date();
  let last = new Date(2020, stDate.getMonth() - 1, 0); //지난달 말일 구하기
  last.setDate(last.getDate() + 35); // 지난달 말일에 35일 더해서 update
  let btDay = await parseInt(
    (last.getTime() - stDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  let fee = await parseInt(
    parseFloat(data.replace(/,/g, "")) * (0.004 * btDay)
  );
  res.json({
    price: parseFloat(data),
    deadline: last,
    btDay: btDay,
    fee: fee,
  });
};

module.exports = crawl;
