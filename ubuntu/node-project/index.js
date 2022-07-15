var express = require('express');
var router = express.Router();
const url = require('url');

var puppeteer = require('puppeteer');
(async () => {
    global.browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
      //args: ["--no-sandbox"]
      //headless : false
    });
    global.page = await browser.newPage();
  })();
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Cre dot Api server'});
  res.header("Access-Control-Allow-Origin", 'https://credotdev.imweb.me');

  res.send('OK'); 
});

/* coupan wing */
router.get('/coupang', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'https://credotdev.imweb.me');
    


  var queryData = url.parse(req.url,true).query;

  if(queryData.id && queryData.pw){
      (async () => {

        // const browser = await puppeteer.launch({
        //   //args: ["--no-sandbox", "--disable-setuid-sandbox"]
        //   //args: ["--no-sandbox"]
        //   headless : false
        // });
        // const page = await browser.newPage();
        const coupang_id = queryData.id;
        const coupang_pw = queryData.pw;

        //쿠팡wing 로그인 페이지
        await page.goto('https://wing.coupang.com/login');
        console.log('coupang_id');
        console.log(coupang_id); 
        console.log(coupang_pw);    

        //아이디랑 비밀번호 란에 값을 넣어라
        await page.evaluate((id, pw) => {
        document.querySelector('input[name="username"]').value = id;
        document.querySelector('input[name="password"]').value = pw;
        }, coupang_id, coupang_pw);

        //로그인
        await page.click('input[name="login"]');

        //인증번호 받기_휴대전화
        await page.waitForSelector('input[name="mfaType"]').then(()=>console.log('인증번호 갈거다'))
        await page.click('input[name="mfaType"]');

        //인증 버튼 기다리기
        await page.waitForSelector('#auth-mfa-code');

        //브라우저 꺼라
        //await browser.close();  
        console.log('ok');   
        res.send('OK');   
    })();
  } else{
    res.send("type id and pw [' /?id=???&pw=??? ']");
  }

  //res.render('index', { title: 'Cre dot Api server' , id: queryData.id, pw: queryData.pw});
});

/* coupan wing code*/
router.get('/coupangcode', function(req, res, next) {
  var queryData = url.parse(req.url,true).query;

  if(queryData.code){
      (async () => {

        // const browser = await puppeteer.launch({
        //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
        // });
        // const page = await browser.newPage();
        const coupang_code = queryData.code;

        await page.evaluate((code) => {
        document.querySelector('input[name="code"]').value = code;        
        }, coupang_code);

        //인증하기
        await page.click('#mfa-submit');

        //기다리기
        await page.waitForSelector('#wing-top-main-side-menu');

        //브라우저 꺼라
        await browser.close();  
        console.log('ok');   
        res.send('OK');   
    })();
  } else{
    res.send("type code [' /?code=??? ']");
  }
});


module.exports = router;
