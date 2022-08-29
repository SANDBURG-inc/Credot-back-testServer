var database = require("express").Router();
const url = require("url");
var mariadb = require("mysql");

const con = mariadb.createConnection({
  host: "credot-rds.cccnip9rb8nn.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "sandburg123",
  database: "credotClient",
});

con.connect(function (err) {
  if (err) throw err;
});

database.get("/contract", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
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
    "INSERT INTO contract(email, sign, contractDate, deadline, ammount, commerce, status) VALUES (?,?,?,?,?,?,?)";

  var params = [
    user["email"],
    user["sign"],
    user["contractDate"],
    user["deadline"],
    user["ammount"],
    user["commerce"],
    user["status"],
  ];
  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
      return res.send(false);
    }
  });

  return res.send(true);
});

module.exports = database;
