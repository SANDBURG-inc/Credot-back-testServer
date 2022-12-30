const express = require("express");
const router = express.Router();
const crawl = require("./api/Crawl");
const auth = require("./api/Auth.js");
//쿠팡 관련된 모듈들은 coupang controller에 의해 라우팅이 관리됌.
router.post("/crawl", async (req, res) => {
  //쿠팡윙 아이디비번으로 로그인시 인증절차가 있기전까지 실행되는 라우터
  crawl(req, res);
});
router.get("/auth", async (req, res) => {
  //쿠팡윙 인증 관련 라우터
  auth(req, res);
});

module.exports = router;
