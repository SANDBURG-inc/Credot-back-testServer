const whitelist = [
  "http://localhost:3000",
  "http://credot.kr",
  "http://3.38.232.237:3000",
  "http://3.38.232.237",
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
