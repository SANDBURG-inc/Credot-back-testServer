const router = require("express").Router();

router.get("/", (req, res) => {
  var sql = "SELECT title,contents FROM faq";
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    return res.send(result);
  });
});

module.exports = router;
