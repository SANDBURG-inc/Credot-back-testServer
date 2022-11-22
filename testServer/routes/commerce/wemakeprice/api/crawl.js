const url = require("url");
const modules = require("./modules");

const crawl = async (req, res) => {
  let queryData = url.parse(req.url, true).query;
  let idpwError = await modules.isIdPwError(queryData, res);
  let isModal = await modules.isCorpModal();
  console.log("idpwError: ", idpwError);
  console.log(isModal);
};

module.exports = crawl;
