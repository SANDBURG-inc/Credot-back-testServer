const router = require("express").Router();
const url = require("url");
const mariadb = require("../dbConnect");

router.get("/", (req, res) => {
  let response = url.parse(req.url, true).query;
  const user = {
    email: response.email,
    sign: response.sign,
    contractDate: response.contractDate,
    deadline: response.deadline,
    ammount: parseFloat(response.ammount.replace(/,/g, "")),
    commerce: response.commerce,
    status: response.status,
  };

  var sql =
    "INSERT INTO contracts(email, sign, contractDate, deadline, ammount, commerce, status) VALUES (?,?,?,?,?,?,?)";

  var params = [
    user["email"],
    user["sign"],
    user["contractDate"],
    user["deadline"],
    user["ammount"],
    user["commerce"],
    user["status"],
  ];
  mariadb.query(sql, params, (err, result) => {
    if (err) {
      throw err;
      return res.send(false);
    }
  });

  return res.send(true);
});

module.exports = router;
