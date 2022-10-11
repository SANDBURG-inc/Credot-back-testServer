const fetch = require("node-fetch");

module.exports = (res) => {
  var data = {
    b_no: ["1208800767"], // 사업자번호 "xxxxxxx" 로 조회 시,
  };

  fetch(
    "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=3H51tq2Dp6Ry1XP7jXA4AcqpRnAcLcXC2cp%2B0vfgi1QlUEpH32UBxa56nJFWB5JCIRFv2saLmcgQ1iDwv5ecHg%3D%3D",
    {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  )
    .then((response) => {
      console.log(response);
      return response.text();
    })
    .then((response) => {
      res.send(response);
    });
};
