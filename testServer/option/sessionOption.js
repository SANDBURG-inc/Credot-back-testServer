const session = require("express-session");

const sessionOption = {
  key: "credotCookie",
  secret: "credot",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, //https가 아닌 환경에선 쿠키 전송하지않음
    httpOnly: true, //브라우저에서 쿠키에 대한 정보 획득 불가-xss공격방지
    SameSite: "none",
    maxAge: 24 * 60 * 60 * 1000 * 7,
  },
  rolling: true,
};
module.exports = sessionOption;
