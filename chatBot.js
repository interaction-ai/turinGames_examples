/*

   This is a NodeJS example of how to create a chat bot for the facebook turinGame

 */

var querystring = require('querystring');
var https = require('https');
var purl = require('url');

var host = 'turingames.fr';
var port = 9001;
var username = 'r';
var token = "";
//var method = "POST";

function performRequest(path, method, data, success) {
	var dataString = JSON.stringify(data);
	var headers = { 'Content-Type': 'application/json' };

	if (method == 'GET') {
		path += '?' + querystring.stringify(data);
	}
	else {
		headers = {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		};
	}
	var options = {
		host: host,
		path: path,
		port: port,
		method: method,
		headers: headers
	};

	var req = https.request(options, function(res) {
		res.setEncoding('utf-8');

		var responseString = '';

		res.on('data', function(data) {
			responseString += data;
		});

		res.on('end', function() {
			console.log(responseString);
			var responseObject = JSON.parse(responseString);
			success(responseObject);
		});
	});

	req.write(dataString);
	req.end();
}

performRequest(host + "/connect","POST",{name: username, token: token},function(res){
	console.log("yes we did it: " + res);
});

