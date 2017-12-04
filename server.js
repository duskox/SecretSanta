require('dotenv').config();
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var santaApiRoutes = require('./santApiRoutes');
var http = require('http');

// *********************
// Setup the EXPRESS app
var app = express();

//Enabling CORS - REMOVE THIS IN PRODUCTION OR SET TO CERTAIN DOMAINS!
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Parse incoming requests data
app.use(bodyParser.json());

app.use('/santAPI', santaApiRoutes);

app.set('port', (process.env.PORT || 5000));

// Setup logging requests to console
app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
