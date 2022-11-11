const url = require("url");
const modules = require("./modules");

const crawl = async (req, res) => {
  let queryData = url.parse(req.url, true).query;
  let idpwError = await modules.isIdPwError(queryData, false);
  let isLoginAuth = await modules.isLoginAuth(idpwError);
  let calculateExist = await modules.isCalculationExists(isLoginAuth);
  await modules.getSettlement(req, calculateExist, res);
  console.log(idpwError, isLoginAuth, calculateExist);

  switch (true) {
    case idpwError:
      res.send("101");
      break;
    case !isLoginAuth & !calculateExist:
      res.send("102");
      break;
    case !isLoginAuth:
      await page.waitForSelector("#btnEmail");
      await page.click("#btnEmail");
      // await page.waitForSelector('input[name="mfaType"]');
      // await page.click('input[name="mfaType"]');
      await page.waitForSelector("#auth-mfa-code");
      res.send("200");
      break;
    default:
  }
};

module.exports = crawl;
