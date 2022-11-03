const whitelist = [
  "https://credot.kr:3000",
  "http://localhost:3000",
  "http://3.38.232.237:3000",
  "http://3.38.232.237",
];

const corsOptions = {
  origin: whitelist,
  credentials: true,
};

module.exports = corsOptions;
