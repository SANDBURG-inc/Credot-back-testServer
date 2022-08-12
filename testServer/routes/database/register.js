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

database.get("/register", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  let response = url.parse(req.url, true).query;

  const user = {
    name: response.name,
    id: response.id,
    pw: response.pw,
    phoneNum: response.phoneNum,
    bank: response.bank,
    account: response.account,
  };
  var sql =
    "INSERT INTO client(name, id, pw, phoneNum, bank, account) VALUES (?,?,?,?,?,?)";
  console.log(user["name"]);
  var params = [
    user["name"],
    user["id"],
    user["pw"],
    user["phoneNum"],
    user["bank"],
    user["account"],
  ];
  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
    }
  });

  res.send("credotSign");
});

module.exports = database;
