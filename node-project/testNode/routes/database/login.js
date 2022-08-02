var database = require("express").Router();
const url = require("url");
var mariadb = require("mysql");

database.get("/login", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  let response = url.parse(req.url, true).query;
  var id = response.id;
  var pw = response.pw;

  var sql =
    "SELECT * FROM client WHERE id = '" + id + "' and pw = '" + pw + "';";
  con.query(sql, function (err, result, fields) {
    if (result.length !== 0) {
      console.log("로그인성공");
      res.send("로그인성공");
    } else {
      console.log("로그인실패");
      res.send("로그인실패");
    }
    return;
  });
});

module.exports = database;
