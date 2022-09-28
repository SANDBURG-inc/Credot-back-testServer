const router = require("express").Router();
const mariadb = require("../dbConnect");

router.get("/", (req, res) => {
  const sql = "SELECT title, img, contents, date FROM media";
  mariadb.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    return res.send(result);
  });
});

module.exports = router;
