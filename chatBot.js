/*

   This is a NodeJS example of how to create a chat bot for the facebook turinGame

 */

var querystring = require('querystring');
var https = require('https');
var purl = require('url');

var host = 'turingames.fr';
var username = "";
var token = "";

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
	console.log(path);
	var options = {
		host: host,
		path: path,
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
			console.log("response: " + responseString);
			if (responseString != "Internal Server Error"){
				var responseObject = JSON.parse(responseString);
				success(responseObject);
			}
			else
				console.log("Couldn't connect...")
		});

		res.on('err', function(err) {
			console.log("[ERROR]: " + err);
		});
	});

	req.write(dataString);
	req.end();
}

function	conversation(res){
	console.log("answer: " + res.answer);
	if (res.query == "close")
		return ;
	var toSend = {
		name: username,
		token: token,
		lobby: res.match,
		message: "you're bot's answer"
	}
	performRequest("/api/answer", "POST", toSend, conversation)
}

performRequest("/api/connect","POST",{name: username, token: token},function(res){
	console.log("Starting new match: " + res.match);
	var toSend = {
		name: username,
		token: token,
		lobby: res.match
	}
	performRequest("/api/join", "POST", toSend, conversation);
});
