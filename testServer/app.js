const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const logger = require("morgan");
const http = require("http");
const mariadb = require("mysql");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var coupangRouter1 = require("./routes/coupang/Crawl");
var coupangRouter2 = require("./routes/coupang/Auth");

var dbRouter1 = require("./routes/database/extractContract");
var dbRouter2 = require("./routes/database/register");
var dbRouter3 = require("./routes/database/contract");
var dbRouter4 = require("./routes/database/changepw");
var dbRouter5 = require("./routes/database/checkEmail");
var exports = (module.exports = {});

var app = express();

app.use(cors({ origin: "http://credot.kr", credentials: true }));

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// set Port
app.set("port", process.env.PORT || 9000);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("seung8869@"));
app.use(
  session({
    secret: "seung8869@",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30000, secure: false, httpOnly: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
//app.get();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

passport.serializeUser(function (user, done) {
  console.log("serializeUser ", user);
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  console.log("deserializeUser email ", email);
  var userinfo;
  var sql = "SELECT * FROM client WHERE email=?";
  con.query(sql, [email], function (err, result) {
    if (err) console.log("mysql 에러");

    console.log("deserializeUser mysql result : ", result);
    var json = JSON.stringify(result[0]);
    userinfo = JSON.parse(json);
    done(null, userinfo);
  });
});

app.get("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      // 로그인 성공
      console.log("req.user : " + JSON.stringify(user));
      var json = JSON.parse(JSON.stringify(user));

      // customCallback 사용시 req.logIn()메서드 필수
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.send(json);
      });
    } else {
      // 로그인 실패
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
    function (username, password, done) {
      var sql = "SELECT * FROM client WHERE email=? AND pw=?";
      con.query(sql, [username, password], function (err, result) {
        if (err) console.log("mysql 에러");
        // 입력받은 email과 비밀번호에 일치하는 회원정보가 없는 경우
        if (result.length === 0) {
          console.log("결과 없음");
          return done(null, false, { message: "Incorrect" });
        } else {
          console.log(result);
          var json = JSON.stringify(result[0]);
          var userinfo = JSON.parse(json);
          console.log("test");
          console.log("userinfo " + userinfo);
          return done(null, userinfo); // result값으로 받아진 회원정보를 return해줌
        }
      });
    }
  )
);

app.get("/logout", isLogin, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  await req.logOut(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });

  console.log(req.user);
});

function isLogin(req, res, next) {
  if (req.user) {
    console.log("ddd");
    next();
  } else {
    res.send("로그인도안돼있는데 로그아웃?");
  }
}

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/coupang", coupangRouter1, coupangRouter2);
app.use("/database", dbRouter1, dbRouter2, dbRouter3, dbRouter4, dbRouter5);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});

module.exports = app;
