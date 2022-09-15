const router = require("express").Router();
const url = require("url");
const mariadb = require("mysql");

router.get("/", (req, res) => {
  let response = url.parse(req.url, true).query;
  let compareBool = false;
  const user = {
    email: response.email,
  };

  var sql = "SELECT * FROM client WHERE email=?;";

  var params = [user["email"]];

  con.query(sql, params, (err, result) => {
    if (err) {
      throw err;
    }
    compareBool = Boolean(Object.keys(result).length);
    return res.send(compareBool);
  });
});

module.exports = router;
