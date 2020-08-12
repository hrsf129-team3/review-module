//library declarations
var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database');

var app = express();

app.use( bodyParser.json() );

//root directory declaration
app.use(express.static(__dirname + '/../client/production'));

//helper function declarations

//API declarations
//checks database for reviews and returns results
app.get('/reviews', function(req, res) {
  db.getReviews(function(results) {
    console.log(results);
    res.send(results);
  })
});

//start listener
app.listen(3000, function() {
  console.log('listening on port 3000!');
});

