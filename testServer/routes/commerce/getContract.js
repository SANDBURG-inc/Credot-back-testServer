const mariadb = require("../database/dbConnect");
const fetch = require("node-fetch");

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    const user = {
      email: req.body.uid,
    };
    console.log(user.email);
    if (user["email"] == "") {
      resolve(0);
    }
    let sql =
      "SELECT ammount FROM contracts WHERE email=? and DATE_FORMAT(contract_date,'%Y-%m')=DATE_FORMAT(NOW(),'%Y-%m');";
    let params = [user["email"]];

    mariadb.query(sql, params, (err, result) => {
      if (err) {
        throw err;
      }
      if (Object.keys(result).length == 0) {
        console.log("sss");
        resolve(0);
      }
      let sum = 0;
      for (let i = 0; i < Object.keys(result).length; i++) {
        sum += parseInt(result[i].ammount);
      }
      resolve(sum);
    });
  });
};
