var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var coupangRouter1 = require("./routes/coupang/Crawl");
var coupangRouter2 = require("./routes/coupang/Auth");
var dbRouter1 = require("./routes/database/login");
var dbRouter2 = require("./routes/database/register");

var app = express();

const cors = require('cors');

const corsOptions = {
  origin: "http://credot.kr",
  credentials: true
}

app.use(cors(corsOptions));

const mariadb = require("./database/mariadb.js");
mariadb.connect;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// set Port
app.set("port", process.env.PORT || 9000);

app.use(logger("dev"));



//app.get();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/coupang", coupangRouter1, coupangRouter2);
app.use("/database", dbRouter1, dbRouter2);

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

const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

module.exports = app;

var server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});
