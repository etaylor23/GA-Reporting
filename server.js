var google = require('googleapis');
var analytics = google.analytics('v3');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');






app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())


app.get('/', function (req, res) {
  res.render('index.ejs');
});


	var key = require('University\ Reporting-1bbcfaf2c91c.json');


	var authClient = new google.auth.JWT(
	    key.client_email,
	    'demo_certificate.pem',
	    // Contents of private_key.pem if you want to load the pem file yourself
	    // (do not use the path parameter above if using this param)
	    key.private_key,
	    // Scopes can be specified either as an array or as a single, space-delimited string
	    ['https://www.googleapis.com/auth/analytics.readonly'],
	    // User to impersonate (leave empty if no impersonation needed)
	    null);

app.get('/listColumns', function( req, res) {
    analytics.metadata.columns.list({
      'reportType': 'ga'
    }, function(err, body) {
      if (err) {
        return console.log(err);
      } else {
        var columnSummary = body.items;

        console.log(JSON.stringify(body.items));

        res.setHeader('Content-Type', 'application/json');
		    res.send(JSON.stringify(columnSummary));        }

    })
    //BOOOOOOOOOOOOOOM
})


app.get('/listAccounts', function (req, res) {

  authClient.authorize(function(err, tokens) {
		if (err) {
			console.log(err);
			return;
		}
      console.log("--------------\n" )
	  	console.log(tokens);
      console.log("\n--------------" )


      analytics.management.accountSummaries.list({
        auth: authClient
      }, function(err, body) {
        if (err) {
          return console.log(err);
        } else {
          var accountSummary = body.items;

          console.log(JSON.stringify(body.items));

          res.setHeader('Content-Type', 'application/json');
  		    res.send(JSON.stringify(accountSummary));        }

      })


    });
});

app.post('/data', function (req, res) {


  console.log("--------------\n" )
  var charts = req.body.ga;
  console.log(charts)
  console.log("\n--------------" )


	/*var metrics = [
	  'ga:pageviews',
	  'ga:visitors',
	  'ga:bounces'
	];*/

	authClient.authorize(function(err, tokens) {
		if (err) {
			console.log(err);
			return;
		}
      console.log("--------------\n" )
	  	console.log(tokens);
      console.log("\n--------------" )


		analytics.data.ga.get({
		    auth: authClient,
		    'ids': charts.gaId, //36850191 - mercatormedia 2624153 - martime journal - 2624153 the brooke - 4968362
		    'start-date': charts.startDate,
		    'end-date': charts.endDate,
		    'metrics': charts.metrics.join(','),
		    'dimensions': charts.dimensions,
		}, processResult);

		function processResult(err, result) {
		    //console.log(err);

		    console.log("------- Start Process Result Output -------\n");
        console.log(result);
        console.log("\n-------  End Process Result Output  -------");

		    res.setHeader('Content-Type', 'application/json');

		    res.send(/*JSON.stringify(result)*/JSON.stringify(result));
		}

		analytics.data.realtime.get({
		    auth: authClient,
		    'ids': 'ga:36850191', //4968362 the brooke
		    'start-date': '60daysAgo',
		    'end-date': 'yesterday',
		    'metrics': 'rt:activeUsers',
		    'dimensions':'rt:medium'
		}, processRealTime);

		function processRealTime(err, result) {
		    console.log(result);
		}

	});

})




http.listen(3001, function () {
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/node_modules'));
  console.log(__dirname + '/public');
  console.log('Example app listening on port 3001!');
});
