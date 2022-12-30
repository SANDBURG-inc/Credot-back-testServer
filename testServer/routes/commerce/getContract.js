const mariadb = require("../database/dbConnect");
const fetch = require("node-fetch"); //nodejs에서는 es6의 fetch를 공식지원하지 않으므로 node-fetch 라이브러리를 사용한다.

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    const user = {
      email: req.body.uid, //리액트에서 커머스 정산을 실행할 때 body에 담겨있는 uid(userId)를 redux로 부터 받아와 db에 질의
    };
    console.log(user.email);
    if (user["email"] == "") {
      //uid가 빈 값이면 promise객체는 0 반환
      resolve(0);
    }
    let sql = // contract 테이블에서 uid(=email)의 조건과 일치하고, 계약일자의 year와 month가 겹치는 달의 일자가 또 존재한다면 금액정보를 가져옴
      "SELECT ammount FROM contracts WHERE email=? and DATE_FORMAT(contract_date,'%Y-%m')=DATE_FORMAT(NOW(),'%Y-%m');";
    let params = [user["email"]];

    mariadb.query(sql, params, (err, result) => {
      if (err) {
        throw err;
      }
      if (Object.keys(result).length == 0) {
        resolve(0); //uid가 존재하고 이를 바탕으로 질의 했을 때 db에 일치하는 정보가 없다면 0 반환
      }
      let sum = 0;
      for (let i = 0; i < Object.keys(result).length; i++) {
        sum += parseInt(result[i].ammount); //필터에 적용된 모든 정산금액들을 더함
      }
      resolve(sum); //promise객체가 sum 반환
    });
  });
};
