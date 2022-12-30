const url = require("url");
const modules = require("./modules");

module.exports = async (req, res) => {
  let queryData = url.parse(req.url, true).query;

  let _authError = await modules.isAuthError(queryData);
  console.log("authError:", _authError);
  let _calculateExist = await modules.isCalculationExists(_authError);
  console.log("calculateExist:", _calculateExist);

  switch (true) {
    case !_authError & !_calculateExist: //인증절차에서 사용자가 인증번호를 잘 입력해서 정산대시보드에 진입했지만 정산현황이 존재하지 않을 때
      res.send("103");
      break;
    case _authError: //인증절차에서 사용자가 잘못된 인증번호를 입력했을때
      res.send("104");
      break;
    default: //위의 경우가 아니라면 정산금을 가지고 온다.
      await modules.getSettlement(req, _calculateExist, res);
      console.log("ok");
      break;
  }
};
