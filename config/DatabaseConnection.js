var mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dashboard",
  port: "3306",
});

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "regevaqm_pets4HomeUser",
//   password: "sbdi~kBu=}ZO",
//   database: "regevaqm_pets4Home",
// });

db.connect(function (err) {
  if (err) {
    console.log(err, "Error in database");
  } else {
    console.log("MySQL Database Connected Successfully");
  }
});

module.exports = db;
