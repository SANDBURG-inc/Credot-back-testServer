const router = require("express").Router();
const url = require("url");

router.get("/", (req, res) => {
  var sql = "SELECT title,contents,date FROM notice";
  console.log("?????");
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    return res.send(result);
  });
});

module.exports = router;
