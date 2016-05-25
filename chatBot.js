/*

   This is a NodeJS example of how to create a chat bot for the facebook turinGame

 */

var querystring = require('querystring');
var https = require('https');
var purl = require('url');

var host = 'turingames.fr';

/********************************************************************************/
/*			Customizable						*/
/********************************************************************************/


// put your username and token here
var username = "";
var token = "";
// here is the total number of conversation your bot will have (100)
var numberInterAction = 100;

// here is the function you want to hack to plug your bot
function	conversation(res){
	console.log("answer: " + res.answer);
	if (res.query == "close")
		return ;
	var toSend = {
		name: username,
		token: token,
		lobby: lobby,
		msg: "you're bot's answer"
	}
	performRequest("/api/answer", "POST", toSend, conversation)
}

/********************************************************************************/

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

for (var i = 0; i < numberInterAction; i++){
	performRequest("/api/connect","POST",{name: username, token: token},function(res){
		console.log("Starting new match: " + res.match);
		lobby = res.match;
		var toSend = {
			name: username,
			token: token,
			lobby: lobby,
		}
		performRequest("/api/join", "POST", toSend, conversation);
	});
}
