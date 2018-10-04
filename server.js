// DEPENDENCIES //

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));


// PORT 3000 //

app.listen(3000, function() {
  console.log('App running on port 3000!');
});