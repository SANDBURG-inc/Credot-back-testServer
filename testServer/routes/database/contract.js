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

database.get("/contract",function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    let response = url.parse(req.url, true).query;
    const user = {
        html: response.html,
        sign: response.sign,
        id: response.id
      };

      var sql =
      "UPDATE client SET html=? , sign=? WHERE id=?;";

      var params = [
        user["html"],
        user["sign"],
        user["id"]
      ];

      con.query(sql, params, function (err, result) {
        if (err) {
          throw err;
        }
      });

      res.send('update ok')
})

module.exports=database;