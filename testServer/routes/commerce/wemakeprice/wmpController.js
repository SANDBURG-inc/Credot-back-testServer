const express = require("express");
const router = express.Router();
const crawl = require("./api/crawl.js");
const {
  isCaptcha,
  getImage,
  refresh,
  inputCode,
  inputWithOutCaptcha,
} = require("./api/getImageModule.js");
const fs = require("fs");

router.use("/crawl", async (req, res, next) => {
  //정산금을 크롤링해오기 전 위메프같은 경우는 홈페이지 차원에서 자동입력방지문자를 입력받으므로 이에 대한 분기처리를 해준다.
  switch (
    req.query.option //react단에서 위메프 정산하기 버튼을 처음 클릭했을때 querystring에 option을 만들어놓았고 option이 무엇인지에 따라 실행 함수가 다르다.
  ) {
    case "isCaptcha": //만약 react단에서 요청을 보낼때 쿼리스트링이 isCaptcha라면(자동입력방지문자를 요청한다면)
      await isCaptcha() //isCaptcha함수를 통해 자동입력방지문자jpg가 위메프 판매자센터 사이트내에 존재하는지 판단
        .then(() => {
          //captcha resolve
          res.send(200);
        })
        .catch(() => {
          //만약 없다면? inputWithOutCaptcha라는 captcha(자동입력방지문자)가 없을 때 아이디와 비밀번호만 입력하는 함수 실행
          //captcha reject
          inputWithOutCaptcha(req);
          next(); //현재 미들웨어에서 판단을 유보하고 다음 라우터로 넘긴다.
        });
      break;
    case "getImage":
      await getImage(res);
      break;
    case "refresh": //사용자가 captcha를 새로고침 요청을 했을 때
      await refresh(res);
      break;
    case "input": // 사용자가 입력한 아이디와 비밀번호,그리고 captcha 인증코드를 puppeteer내에서 입력한다.
      await inputCode(req);
      next(); //현재 미들웨어에서 판단을 유보하고 다음 라우터로 넘긴다.
      break;
  }
});

//주석만으로는 설명에 한계가 있으므로 직접 위메프 판매자센터를 들어가서 일일히 대조해보며 이해하기 바람.

router.post("/crawl", async (req, res) => {
  crawl(req, res);
});

module.exports = router;
