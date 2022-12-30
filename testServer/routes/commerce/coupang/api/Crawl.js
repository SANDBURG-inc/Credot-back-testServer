const url = require("url");
const modules = require("./modules");

module.exports = async (req, res) => {
  let queryData = url.parse(req.url, true).query;

  let _idpwError = await modules.isIdPwError(queryData, res); //아이디와 비번에 문제가 없는지 확인하고 boolean을 return
  console.log("_idpwError:", _idpwError);
  let _isLoginAuth = await modules.isLoginAuth(_idpwError); //아이디와 비번에 문제가 없는지를 판단한 _idpwError를 인자로 하여 인증절차가 있는지를 판단
  console.log("_isLoginAuth:", _isLoginAuth);
  let _calculateExist = await modules.isCalculationExists(_isLoginAuth); //위의 절차에서 문제가 없다면 대시보드에 진입하여 정산금의 존재여부 판단
  console.log("_isCalculationExist:", _calculateExist);
  modules.getSettlement(req, _calculateExist, res); //위의 과정에서 전부 문제가 없다면 정산금을 가지고 온다.

  console.log(_idpwError, _isLoginAuth, _calculateExist);

  switch (true) {
    case _idpwError: // 아이디 비밀번호에 문제가 있다면?
      res.send("101");
      break;
    case _isLoginAuth: //인증절차가 있다면
      // await page.waitForSelector("#btnEmail");
      // await page.click("#btnEmail");
      await page.waitForSelector('input[name="mfaType"]'); //인증번호 입력요소를 기다리고,
      await page.click('input[name="mfaType"]'); // 인증하기 버튼을 클릭
      await page.waitForSelector("#auth-mfa-code"); // 인증번호 입력폼 요소를 wait함
      res.send("200");
      break;
    case !_isLoginAuth & !_calculateExist: //인증절차가 존재하지 않지만 대시보드에 정상 진입하였지만, 정산금이 없는 경우
      res.send("102");
      break;
    default:
  }
};
