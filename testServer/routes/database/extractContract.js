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

// database.get("/extractContract", function (req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   let response = url.parse(req.url, true).query;

//   const user = {
//     email: response.email,
//   };
//   var sql =
//     "SELECT contractDate,deadline,ammount,commerce,status FROM contract WHERE email=?;";
//   var params = [user["email"]];

//   con.query(sql, params, function (err, result) {
//     if (err) {
//       throw err;
//     }

//     return res.send(result);
//   });
// });

database.get("/extractContract", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  let response = url.parse(req.url, true).query;

  const user = {
    email: response.email,
  };
  var sql =
    "SELECT ammount FROM contract WHERE email=? and DATE_FORMAT(contractDate,'%Y-%m')=DATE_FORMAT(NOW(),'%Y-%m');";
  var params = [user["email"]];

  con.query(sql, params, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(Object.keys(result).length);
    var sum = 0;
    for (var i = 0; i < Object.keys(result).length; i++) {
      console.log(typeof result[i].ammount);
      console.log(typeof parseInt(result[i].ammount));
      sum += parseInt(result[i].ammount);
      console.log(sum);
    }

    console.log(result[0].ammount + result[1].ammount + result[2].ammount);

    return res.send(result);
  });
});

module.exports = database;
