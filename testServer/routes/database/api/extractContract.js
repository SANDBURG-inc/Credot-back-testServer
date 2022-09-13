var router = require("express").Router();
const url = require("url");

router.get("/", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  let response = url.parse(req.url, true).query;

  const user = {
    email: response.email,
  };
  var sql =
    "SELECT contractDate,deadline,ammount,commerce,status FROM contract WHERE email=?;";
  var params = [user["email"]];

  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
    }

    return res.send(result);
  });
});

module.exports = router;
