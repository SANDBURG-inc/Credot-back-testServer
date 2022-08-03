var database = require("express").Router();
const url = require("url");
var mariadb = require("mysql");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const con = mariadb.createConnection({
  host: "credot-rds.cccnip9rb8nn.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "sandburg123",
  database: "credotClient",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("You are connected to DB");
});

database.use(
  session({
    secret: "seung8869@",
    resave: true,
    saveUninitialized: false,
    store: new MySQLStore({
      host: "credot-rds.cccnip9rb8nn.ap-northeast-2.rds.amazonaws.com",
      port: 3306,
      user: "admin",
      password: "sandburg123",
      database: "credotClient",
    }),
  })
);
database.use(passport.initialize());
database.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (id, pw, done) {
      con.query("SELECT * FROM client WHERE id = ?;", id, (err, user) => {
        if (err) {
          console.log("에러");
          return done(err);
        }
        if (user.length === 0) {
          console.log("유저 존재x");
          return done(null, false, { message: "유저가 존재하지 않습니다." });
        }
        if (pw !== user[0].pw) {
          console.log("fdsf");
          return done(null, false, { message: "잘못된 비밀번호입니다." });
        }
        console.log("ok");
        return done(null, user);
      });
    }
  )
);
database.get(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login/fail",
  }),
  function (req, res, next) {
    console.log("dd");
  }
);

// database.get("/login", function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   let response = url.parse(req.url, true).query;
//   var id = response.id;
//   var pw = response.pw;

//   var sql =
//     "SELECT * FROM client WHERE id = '" + id + "' and pw = '" + pw + "';";
//   con.query(sql, function (err, result, fields) {
//     if (result.length !== 0) {
//       console.log("로그인성공");
//       res.send("로그인성공");
//     } else {
//       console.log("로그인실패");
//       res.send("로그인실패");
//     }
//     return;
//   });
// });

passport.serializeUser(function (user, done) {
  done(null, user[0].id);
});

passport.deserializeUser(function (id, done) {
  con.query("SELECT * FROM client WHERE id = ?;", id, (err, user) => {
    done(null, user);
  });
});

module.exports = database;
