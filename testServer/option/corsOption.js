const whitelist = [
  "http://localhost:3000",
  "https://credot.kr",
  "http://3.38.232.237:3000",
  "http://3.38.232.237",
  "http://credotAPI-269032711.ap-northeast-2.elb.amazonaws.com",
  "credotAPI-269032711.ap-northeast-2.elb.amazonaws.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("NOT allowed"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
