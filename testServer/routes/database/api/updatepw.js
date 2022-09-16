const router = require("express").Router();
const url = require("url");

router.get("/", (req, res) => {
  let response = url.parse(req.url, true).query;
  let compareBool = false;

  const user = {
    currentemail: response.currentemail,
    currentpw: response.currentpw,
    futurepw: response.futurepw,
  };

  var compareSQL = "SELECT * FROM client WHERE email=? AND pw=?;";

  var updateSQL = "UPDATE client SET pw=? WHERE pw=? AND email=?;";

  var compareParams = [user["currentemail"], user["currentpw"]];

  var updateParams = [
    user["futurepw"],
    user["currentpw"],
    user["currentemail"],
  ];

  con.query(compareSQL, compareParams, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);

    compareBool = Boolean(Object.keys(result).length);

    switch (compareBool) {
      case true:
        con.query(updateSQL, updateParams, (err, result) => {
          if (err) {
            throw err;
          }
          res.send("비밀번호 변경완료");
        });
        break;
      case false:
        res.send("비밀번호가 다릅니다!");
        break;
    }
  });
});

module.exports = router;
