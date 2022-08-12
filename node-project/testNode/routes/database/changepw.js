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

  database.get("/changepw",function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    let response = url.parse(req.url, true).query;
    let compareBool = false;
    
    const user = {
        currentid: response.currentid,
        currentpw: response.currentpw,
        futurepw: response.futurepw,
      };

      var compareSQL =
      "SELECT * FROM client WHERE id=? AND pw=?;";

      var updateSQL =
      "UPDATE client SET pw=? WHERE pw=? AND id=?;";

      var compareParams = [
        user["currentid"],
        user["currentpw"]
      ];

      var updateParams = [
        user["futurepw"],
        user["currentpw"],
        user["currentid"]
      ];

      con.query(compareSQL, compareParams, function (err, result) {
        if (err) {
          throw err;
        }
        console.log(result)
        
        compareBool=Boolean(Object.keys(result).length)
        
        switch(compareBool){
          case true:
            con.query(updateSQL, updateParams, function (err, result) {
                 if (err) {
                   throw err;
                 }
                 res.send('비밀번호 변경완료')
               });
               break;
          case false:
            res.send('비밀번호가 다릅니다!')
            break;
        }
      });
  })



  module.exports=database;