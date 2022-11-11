const url = require("url");
const modules = require("./modules");

const auth = async (req, res) => {
  let queryData = url.parse(req.url, true).query;
  let authError = await modules.isAuthError(queryData);
  let calculateExist = await modules.isCalculationExists(authError);

  switch (true) {
    case authError & !calculateExist:
      res.send("103");
      break;
    case !authError:
      res.send("104");
      break;
    default:
      await modules.getSettlement(calculateExist);
      console.log("ok");
      break;
  }
};

module.exports = auth;
