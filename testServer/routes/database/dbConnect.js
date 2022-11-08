const mariadb = require("mysql");
connection = mariadb.createConnection({
  host: "3.34.155.60",
  port: 3306,
  user: "sandburg",
  password: "sandburg123!",
  database: "credot_database",
  ssl: false,
});
module.exports = connection;
