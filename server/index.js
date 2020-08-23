//library declarations
var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database');
const path = require('path');
const expressStaticGzip = require("express-static-gzip");
const prodPath = path.join(__dirname, '../client/production');

var app = express();

app.use( bodyParser.json() );

//root directory declaration
//app.use(express.static(__dirname + '/../client/production'));
app.use(expressStaticGzip(prodPath, { enableBrotli: true, orderPreference: ['br'] }));

//helper function declarations

//API declarations
//checks database for reviews and returns results.  This sorts by "recommended" reviews.
app.get('/reviews', function(req, res) {
  db.getReviews(function(results) {
    console.log(results);
    res.send(results);
  })
});

app.get('/newest', function(req, res) {
  db.getReviewsByNewest(function(results) {
    console.log(results);
    res.send(results);
  })
});

//start listener
app.listen(3000, function() {
  console.log('listening on port 3000!');
});

