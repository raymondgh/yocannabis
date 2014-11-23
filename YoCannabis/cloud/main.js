var express = require('express');
var _ = require('underscore');
var querystring = require('querystring');

/**
 * Create an express application instance
 */
var app = express();

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

/**
 * Global app configuration section
 */
//app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


app.get('/nearest', function(req, res) {
  var yoName = req.query.username; //ch4ch4
  var tempLocation = req.query.location; //42.360091;-71.09415999999999
  var yoLatitude = (tempLocation.split(';'))[0];
  var yoLongitude = (tempLocation.split(';'))[1];
    Parse.Config.get().then(function(config) {
        var PLACES_KEY = config.get("PLACES_KEY");
        SendYo(yoName, tempLocation, function(){
            res.end();
        });

    }, function(error) {
        // Something went wrong (e.g. request timed out)
        console.log("Fail to get parse Config");
        callback();
    });

});


function SendYo(yoUsername, yoLocation, callback){
    Parse.Config.get().then(function(config) {
        var YO_TOKEN = config.get("YO_TOKEN");
        Parse.Cloud.httpRequest({
            url: 'http://api.justyo.co/yo/',
            method: "POST",
            body: {
                location:(yoLocation ? yoLocation : ''),
                api_token: YO_TOKEN,
                username: yoUsername
            },
            success: function (httpResponse) {
                console.log("Yo is sent to " + yoUsername + " with " + yoLocation);
                callback();
            },
            error: function (httpResponse) {
                console.log("Fail to YO");
                callback();
            }
        });
    }, function(error) {
        // Something went wrong (e.g. request timed out)
        console.log("Fail to get parse Config");
        callback();
    });
}

// Attach the Express app to your Cloud Code
app.listen();