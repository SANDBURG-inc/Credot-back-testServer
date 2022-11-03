const mariadb = require("../../../database/dbConnect");

module.exports = (req) => {
  const user = {
    email: req.body.uid,
  };
  console.log(user.email);
  if (user["email"] == "") {
    return 0;
  }
  let sql =
    "SELECT ammount FROM contract WHERE email=? and DATE_FORMAT(contractDate,'%Y-%m')=DATE_FORMAT(NOW(),'%Y-%m');";
  let params = [user["email"]];

  mariadb.query(sql, params, (err, result) => {
    if (err) {
      throw err;
    }
    if (Object.keys(result).length == 0) {
      return 0;
    }
    let sum = 0;
    for (let i = 0; i < Object.keys(result).length; i++) {
      sum += parseInt(result[i].ammount);
    }
    return sum;
  });
};
