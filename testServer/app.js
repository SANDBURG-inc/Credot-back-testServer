const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const logger = require("morgan");
const http = require("http");
const mariadb = require("./routes/database/dbConnect");
const cors = require("cors");
const session = require("express-session");
const corsOptions = require("./option/corsOption");
const sessionOption = require("./option/sessionOption");

const commerceRouter = require("./routes/commerce/commerceController");
const dbRouter = require("./routes/database/databaseController");

const app = express();

mariadb.connect((err) => {
  if (err) throw err;
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 9000);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("유효");
  } else {
    console.log("만료된세션");
  }
  console.log(req.isAuthenticated());
  console.log(req.user);
  res.send(req.session.cookie);
});

app.post("/login", (req, res, next) => {
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
      con.query(sql, [username, password], (err, result) => {
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
  con.query(sql, [email], (err, result) => {
    if (err) console.log("mysql 에러");

    console.log(LOG + "deserializeUser mysql result : ", result);
    var json = JSON.stringify(result[0]);
    userinfo = JSON.parse(json);
    done(null, userinfo);
  });
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use("/commerce", commerceRouter);
app.use("/database", dbRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

var server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});

module.exports = app;
