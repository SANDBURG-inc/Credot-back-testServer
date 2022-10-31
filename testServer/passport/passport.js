const express = require("express");
const router = express.Router();
const mariadb = require("../routes/database/dbConnect");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      var json = JSON.parse(JSON.stringify(user));
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log(user);
        console.log(req.isAuthenticated());
        req.session.save();
        return res.send(json);
      });
    } else {
      console.log("/login fail!!!");
      res.send(false);
    }
  })(req, res, next);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pw",
    },
    (username, password, done) => {
      var sql = "SELECT * FROM client WHERE email=? AND pw=?";
      mariadb.query(sql, [username, password], (err, result) => {
        if (err) console.log("mysql 에러");
        if (result.length === 0) {
          console.log("결과 없음");
          return done(null, false, { message: "Incorrect" });
        } else {
          console.log(result);
          var json = JSON.stringify(result[0]);
          var userinfo = JSON.parse(json);
          console.log("userinfo " + userinfo);
          return done(null, userinfo);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser ", user);
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  console.log("deserializeUser 실행");
  var userinfo;
  var sql = "SELECT * FROM client WHERE email=?";
  mariadb.query(sql, [email], (err, result) => {
    if (err) console.log("mysql 에러");

    console.log("deserializeUser mysql result : ", result);
    var json = JSON.stringify(result[0]);
    userinfo = JSON.parse(json);
    done(null, userinfo);
  });
});

router.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("유효");
  } else {
    console.log("만료된세션");
  }
  console.log(req.isAuthenticated());
  res.send(req.user.email);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

module.exports = router;
