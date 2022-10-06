const mariadb = require("mysql");
connection = mariadb.createConnection({
  host: "13.125.82.93",
  port: 3306,
  user: "sandburg",
  password: "sandburg123!",
  database: "credotClient",
});
module.exports = connection;
