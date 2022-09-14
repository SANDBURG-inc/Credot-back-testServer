const router = require("express").Router();
const url = require("url");

router.get("/", function (req, res, next) {
  let response = url.parse(req.url, true).query;

  const user = {
    name: response.name,
    email: response.email,
    pw: response.pw,
    phoneNum: response.phoneNum,
    bank: response.bank,
    account: response.account,
    corporateName: response.corporateName,
    ceo: response.ceo,
    businessLoc: response.businessLoc,
    corporateNum: response.corporateNum,
  };
  var sql =
    "INSERT INTO client(name, email, pw, phoneNum, bank, account, corporateName, ceo, businessLoc, corporateNum) VALUES (?,?,?,?,?,?,?,?,?,?)";
  console.log(user["name"]);

  var params = [
    user["name"],
    user["email"],
    user["pw"],
    user["phoneNum"],
    user["bank"],
    user["account"],
    user["corporateName"],
    user["ceo"],
    user["businessLoc"],
    user["corporateNum"],
  ];
  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
      return res.send(false);
    }
    return res.send(true);
  });
});

module.exports = router;
