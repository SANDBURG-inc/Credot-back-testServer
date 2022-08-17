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

database.get("/checkEmail", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  let response = url.parse(req.url, true).query;
  let compareBool = false;
  const user = {
    id: response.id,
  };

  var sql = "SELECT * FROM client WHERE id=?;";

  var params = [user["id"]];

  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
    }

    compareBool = Boolean(Object.keys(result).length);
    return res.send(compareBool);
  });
});

module.exports = database;
