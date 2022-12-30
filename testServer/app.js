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

const commerceRouter = require("./routes/commerce/commerceController"); //커머스 크롤러 api
const dbRouter = require("./routes/database/databaseController"); //스트라피 사용 전 회원database 조작 api(일단 남겨놓음.)
const getCorpState = require("./getCorpState/corpAuthentication"); //사업자번호 인증 api
const mariadb = require("./routes/database/dbConnect"); //db연결 정보

const app = express();
mariadb.connect(function (err) {
  //mariadb 연결
  if (err) {
    throw err;
  }
  console.log("connection");
});

app.set("views", "./views"); //view 엔진 템플릿.. express generator에의해 생성된 것이므로 무시하세요
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 9000);

app.use(cors(corsOptions)); //Corsoption파일을 미들웨어로 사용. 앞으로 서버의 app.js로 들어오는 모든 요청 객체들은 이 미들웨어를 거침
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
  //사업자번호 인증 라우터
  let queryData = url.parse(req.url, true).query; //리액트에서 요청시 queryString 추출 후 queryData에 할당
  getCorpState(res, queryData.code); // testServer/getCorpState안에 있는 getCorpState함수 호출(리액트에서 주는 code=사업자번호를 queryData에서 추출해서 인자로 보냄)
});

let server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});

module.exports = app;
