const url = require("url");
const modules = require("./modules");

const crawl = async (req, res) => {
  let queryData = url.parse(req.url, true).query;
  let idpwError = await modules.isIdPwError(queryData, false, res);
  // res.send(idpwError);
};

module.exports = crawl;
