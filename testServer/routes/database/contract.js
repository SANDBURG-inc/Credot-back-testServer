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
    id: response.id,
    sign: response.sign,
    date: response.date,
    deadline: response.deadline,
    ammount: response.ammount,
    commerce: response.commerce,
    status: response.status,
  };

  var sql =
    "INSERT INTO client(id, sign, date, deadline, ammount, commerce, status) VALUES (?,?,?,?,?,?,?)";

  var params = [
    user["id"],
    user["sign"],
    user["date"],
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
