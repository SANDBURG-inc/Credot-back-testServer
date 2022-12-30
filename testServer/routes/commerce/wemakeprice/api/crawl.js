const url = require("url");
const modules = require("./modules");

const crawl = async (req, res) => {
  let queryData = url.parse(req.url, true).query; //crawl로 요청을 보내면 query data추출
  let idpwError = await modules.isIdPwError(queryData, res); //idpwError를 query data를 이용해 판단
  let isModal = await modules.isCorpModal(); //사업자 인증 모달이뜨는지 판단
  console.log("idpwError: ", idpwError);
  console.log(isModal);
};

module.exports = crawl;
