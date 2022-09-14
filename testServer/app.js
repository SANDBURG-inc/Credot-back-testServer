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

const commerceRouter = require("./routes/commerce/commerceController");
const dbRouter = require("./routes/database/databaseController");

const app = express();

const whitelist = [
  "http://localhost:3000",
  "http://credot.kr",
  "http://3.38.232.237:3000",
  "http://3.38.232.237",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("NOT allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

global.con = mariadb.createConnection({
  host: "credot-rds.cccnip9rb8nn.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "sandburg123",
  database: "credotClient",
});

con.connect(function (err) {
  if (err) throw err;
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
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
    cookie: {
      secure: true,
      httpOnly: true,
      SameSite: "none",
      maxAge: 600000,
      domain: ".credot.kr",
    },
    rolling: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      console.log("req.user : " + JSON.stringify(user));
      var json = JSON.parse(JSON.stringify(user));
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        console.log(user);
        res.cookie("seunghuncookie", {
          secure: true,
          httpOnly: true,
          SameSite: "none",
          maxAge: 600000,
          domain: ".credot.kr",
        });
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
    function (username, password, done) {
      var sql = "SELECT * FROM client WHERE email=? AND pw=?";
      con.query(sql, [username, password], function (err, result) {
        if (err) console.log("mysql 에러");
        if (result.length === 0) {
          console.log("결과 없음");
          return done(null, false, { message: "Incorrect" });
        } else {
          console.log(result);
          var json = JSON.stringify(result[0]);
          var userinfo = JSON.parse(json);
          console.log("test");
          console.log("userinfo " + userinfo);
          return done(null, userinfo);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("serializeUser ", user);
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  console.log(LOG + "deserializeUser email ", email);
  var userinfo;
  var sql = "SELECT * FROM client WHERE email=?";
  con.query(sql, [email], function (err, result) {
    if (err) console.log("mysql 에러");

    console.log(LOG + "deserializeUser mysql result : ", result);
    var json = JSON.stringify(result[0]);
    userinfo = JSON.parse(json);
    done(null, userinfo);
  });
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/", function (req, res, next) {
  res.send("ok");
});

app.use("/commerce", commerceRouter);
app.use("/database", dbRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

var server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});

module.exports = app;
