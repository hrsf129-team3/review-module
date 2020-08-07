//application declarations
var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql');

var app = express();

app.use( bodyParser.json() );


//root directory declaration
app.use(express.static(__dirname + '/../client/production'));


//API declarations

//start listener
app.listen(3000, function() {
  console.log('listening on port 3000!');
});

