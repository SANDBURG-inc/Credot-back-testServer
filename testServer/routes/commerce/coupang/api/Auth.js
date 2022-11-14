const url = require("url");
const modules = require("./modules");

module.exports = async (req, res) => {
  let queryData = url.parse(req.url, true).query;

  let _authError = await modules.isAuthError(queryData);
  console.log("authError:", _authError);
  let _calculateExist = await modules.isCalculationExists(_authError);
  console.log("calculateExist:", _calculateExist);

  switch (true) {
    case _authError & !_calculateExist:
      res.send("103");
      break;
    case !_authError:
      res.send("104");
      break;
    default:
      await modules.getSettlement(req, _calculateExist, res);
      console.log("ok");
      break;
  }
};
