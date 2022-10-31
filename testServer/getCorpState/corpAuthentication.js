const fetch = require("node-fetch");

const getCorpState = async (corpCode) => {
  let serviceKey =
    "3H51tq2Dp6Ry1XP7jXA4AcqpRnAcLcXC2cp%2B0vfgi1QlUEpH32UBxa56nJFWB5JCIRFv2saLmcgQ1iDwv5ecHg%3D%3D";
  let response = await fetch(
    "http://apis.data.go.kr/1130000/MllBsService/getMllBsBiznoInfo?serviceKey=" +
      serviceKey +
      "&pageNo=1&numOfRows=10&resultType=json&bizrno=" +
      corpCode
  );
  let returnData = await response.json();
  return returnData;
};

module.exports = async (res, corpNum) => {
  let stringfiedCode = corpNum.split("-").join("");
  let data = await getCorpState(stringfiedCode);
  if (Object.keys(data.items).length == 0) {
    res.send("통신판매업 등록자가 아닙니다.");
    return 0;
  }
  res.send("인증이 완료되었습니다.");
};
