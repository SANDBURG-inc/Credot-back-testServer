const url = require("url");
const modules = require("./modules");

const crawl = async (req, res) => {
  let queryData = url.parse(req.url, true).query;
  let idpwError = await modules.isIdPwError(queryData, false);
  let dashError = await modules.isDashError(idpwError);
  let calculateExist = await modules.isCalculationExists(dashError);
  await modules.getSettlement(req, calculateExist);
  console.log(idpwError, dashError, calculateExist);

  switch (true) {
    case idpwError:
      res.send("101");
      break;
    case !dashError & !calculateExist:
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
};

module.exports = crawl;
