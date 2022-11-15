const url = require("url");
const modules = require("./modules");

module.exports = async (req, res) => {
  let queryData = url.parse(req.url, true).query;

  let _idpwError = await modules.isIdPwError(queryData, res);
  console.log("_idpwError:", _idpwError);
  let _isLoginAuth = await modules.isLoginAuth(_idpwError);
  console.log("_isLoginAuth:", _isLoginAuth);
  let _calculateExist = await modules.isCalculationExists(_isLoginAuth);
  console.log("_isCalculationExist:", _calculateExist);
  modules.getSettlement(req, _calculateExist, res);

  console.log(_idpwError, _isLoginAuth, _calculateExist);

  switch (true) {
    case _idpwError:
      res.send("101");
      break;
    case _isLoginAuth:
      // await page.waitForSelector("#btnEmail");
      // await page.click("#btnEmail");
      await page.waitForSelector('input[name="mfaType"]');
      await page.click('input[name="mfaType"]');
      await page.waitForSelector("#auth-mfa-code");
      res.send("200");
      break;
    case !_isLoginAuth & !_calculateExist:
      res.send("102");
      break;
    default:
  }
};
