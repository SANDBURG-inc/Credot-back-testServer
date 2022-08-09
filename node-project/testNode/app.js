const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const logger = require("morgan");
const http = require('http');
const mariadb = require("mysql");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var coupangRouter1 = require("./routes/coupang/Crawl");
var coupangRouter2 = require("./routes/coupang/Auth");
//var dbRouter1 = require("./routes/database/login");
var dbRouter2 = require("./routes/database/register");
var dbRouter3 = require("./routes/database/contract");

var app = express();

const cors = require('cors');
app.use(cors({origin: "http://localhost:3000", credentials:true}));

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
app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:30000, 
          secure:false,
          httpOnly:false}
}));
app.use(passport.initialize());
app.use(passport.session());
//app.get();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


passport.serializeUser(function(user, done) {
  console.log("serializeUser ", user)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializeUser id ", id)
    var userinfo;
    var sql = 'SELECT * FROM client WHERE id=?';
    con.query(sql , [id], function (err, result) {
      if(err) console.log('mysql 에러');     
     
      console.log("deserializeUser mysql result : " , result);
      var json = JSON.stringify(result[0]);
      userinfo = JSON.parse(json);
      done(null, userinfo);
    })    
});

app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    
    if(user){ // 로그인 성공
      console.log("req.user : "+ JSON.stringify(user));
      var json = JSON.parse(JSON.stringify(user));
      
      // customCallback 사용시 req.logIn()메서드 필수
      req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.send(json);
        });

    }else{	// 로그인 실패
      console.log("/login fail!!!");
      res.send([]);
    }
  })(req, res, next);
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw'
  },
  function(username, password, done) {
    var sql = 'SELECT * FROM client WHERE id=? AND pw=?';
    con.query(sql , [username, password], function (err, result) {
      if(err) console.log('mysql 에러');
      // 입력받은 ID와 비밀번호에 일치하는 회원정보가 없는 경우   
      if(result.length === 0){
        console.log("결과 없음");
        return done(null, false, { message: 'Incorrect' });
      }else{
        console.log(result);
        var json = JSON.stringify(result[0]);
        var userinfo = JSON.parse(json);
        console.log('test');
        console.log("userinfo " + userinfo);
        return done(null, userinfo);  // result값으로 받아진 회원정보를 return해줌
      }
    })
  }
));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/coupang", coupangRouter1, coupangRouter2);
app.use("/database", dbRouter2,dbRouter3);

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

app.get('/logout', async (req, res) => {
  await req.logout();
  res.clearCookie("connect.sid", {path:"/",httpOnly:true})
  return res.redirect('/')
})

function isLogin(req,res,next){
  if(req.user){
    console.log('ddd');
    next()
  }
  else{
    res.send('로그인도안돼있는데 로그아웃?');
  }
}

var server = app.listen(app.get("port"), () => {
  console.log("Express server listening in port " + server.address().port);
});

module.exports = app;
