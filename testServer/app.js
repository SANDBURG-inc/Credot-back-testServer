const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const corsOptions = require("./option/corsOption");
const sessionOption = require("./option/sessionOption");
const url = require("url");

const commerceRouter = require("./routes/commerce/commerceController");
const dbRouter = require("./routes/database/databaseController");
const getCorpState = require("./getCorpState/corpAuthentication");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 9000);

//app.use(cors(corsOptions));
app.use(session(sessionOption));
app.use(cookieParser());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/commerce", commerceRouter);
app.use("/database", dbRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.get("/corpAuth", (req, res) => {
  console.log("dd");
  let queryData = url.parse(req.url, true).query;
  getCorpState(res, queryData.code);
});

let server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});

module.exports = app;
