const url = require("url");
const modules = require("./modules");

module.exports = async (req, res) => {
  let queryData = url.parse(req.url, true).query;

  let _authError = await modules.isAuthError(queryData);
  console.log("authError:", _authError);
  let _calculateExist = await modules.isCalculationExists(_authError);
  console.log("calculateExist:", _calculateExist);

  switch (true) {
    case !_authError & !_calculateExist: //auth error = false이고 정산현황 없을때
      res.send("103");
      break;
    case _authError: //autherror 존재할때
      res.send("104");
      break;
    default:
      await modules.getSettlement(req, _calculateExist, res);
      console.log("ok");
      break;
  }
};
