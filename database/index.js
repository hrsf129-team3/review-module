var mysql = require('mysql');

//database connection
var mysqlConfig = require('./config.js');
var db = mysql.createConnection(mysqlConfig);

var getReviews = function(callback) {
  console.log("Fetching reviews...");
  db.query(`select * from review_info order by review_id`, function(error, results) {
    if(error) {
      console.log(error);
    } else {
      callback(results);
    }
  });
}

var getReviewsByNewest = function(callback) {
  console.log("Fetching reviews...");
  db.query(`select * from review_info order by review_date desc`, function(error, results) {
    if(error) {
      console.log(error);
    } else {
      callback(results);
    }
  });
}

module.exports.getReviews = getReviews;