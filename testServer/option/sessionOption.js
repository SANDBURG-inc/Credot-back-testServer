const session = require("express-session");
const Memorystore = require("memorystore")(session);

const sessionOption = {
  key: "credotCookie",
  secret: "credot",
  resave: false,
  saveUninitialized: true,
  store: new Memorystore({ checkPeriod: 600000 }),
  cookie: {
    secure: false,
    httpOnly: true,
    SameSite: "none",
    maxAge: 24 * 60 * 60 * 1000 * 7,
  },
};
module.exports = sessionOption;
