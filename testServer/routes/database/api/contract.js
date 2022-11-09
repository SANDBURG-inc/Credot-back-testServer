const router = require("express").Router();
const url = require("url");
const mariadb = require("../dbConnect");
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  let response = url.parse(req.url, true).query;
  const user = {
    email: response.email,
    sign: response.sign,
    contractDate: response.contractDate,
    deadline: response.deadline,
    ammount: parseFloat(response.ammount.replace(/,/g, "")),
    commerce: response.commerce,
    status: response.status,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body:
      '{"data":{"email":' +
      user.email +
      ',"sign":' +
      user.sign +
      ',"commerce":' +
      user.commerce +
      ',"ammount":' +
      user.ammount +
      ',"contractDate":' +
      user.contractDate +
      ',"deadline":' +
      user.deadline +
      "}}",
  };

  let success = await fetch("https://cms.credot.kr/api/contracts", options);
  let returnData = await success.json();
  if (returnData.error != undefined) {
    return res.status(400);
  }
  return res.send(true);
});

module.exports = router;
