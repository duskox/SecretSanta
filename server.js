var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var santaApiRoutes = require('./santApiRoutes');
// var google = require('googleapis');
// var GoogleAuth = require('google-auth-library');



// *********************
// Setup the EXPRESS app
var app = express();

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

// // Setup the google authentication
// var authFactory = new GoogleAuth();
// var dns = google.dns('v1');

// authFactory.getApplicationDefault(function(err, authClient) {
//   if (err) {
//     console.log('Authentication failed because of ', err);
//     return;
//   }
//   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
//     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
//     authClient = authClient.createScoped(scopes);
//   }

//   var request = {
//     // TODO: Change placeholders below to values for parameters to the 'get' method:

//     // Identifies the project addressed by this request.
//     project: "",
//     // Identifies the managed zone addressed by this request. Can be the managed zone name or id.
//     managedZone: "",
//     // The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
//     changeId: "",
//     // Auth client
//     auth: authClient
//   };

//   dns.changes.get(request, function(err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     }
//   });
// });
