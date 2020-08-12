var mysql = require('mysql');

//database connection
var mysqlConfig = require('./config.js');
var db = mysql.createConnection(mysqlConfig);

var getReviews = function(callback) {
  console.log("Fetching reviews...");
  db.query(`select * from review_info`, function(error, results) {
    if(error) {
      console.log(error);
    } else {
      callback(results);
    }
  });
}

module.exports.getReviews = getReviews;