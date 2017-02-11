var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Schools = require("./models/Schools.js");
var Jerbs = require("./models/Jerbs.js");
var Clinics = require("./models/Clinics.js");
var Social = require("./models/Social.js");
var mongoose = require("mongoose");
var _ = require('underscore');
var mongoUri;
if (process.argv[2] === 'production') {
	var keys = require("./keys.js");
	mongoUri = keys.mongoURI;
} else if (process.env.MONGODB_URI) {
	mongoUri = process.env.MONGODB_URI;
} else {
	mongoUri = 'mongodb://localhost:27017/txvetsdb'
}
mongoose.connect(mongoUri);
var db = mongoose.connection;
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function getLocation(message){
	var messageArray = message.split(" ");
	console.log(messageArray);
	var locationArray = ["Amarillo", "Lubbock", "Dallas", "Ft. Worth", "Waco", "Houston", "Galveston", "Midland", "Austin", "San Antonio", "Laredo", "Brownsville", "St. Padre Island", "El Paso", "Odessa"];
	var location = (_.intersection(messageArray, locationArray));
	if (location.length < 1){
		location = "Sorry, I don't couldn't find that location."
		}
		console.log(location);
		return location;
	}


function respondToMessage(message){
	var m = message;
	getLocation(m);
	var responseKeys = {
		1 : "You said 1!",
		2 : "You said 2!",
		help : "How can I help you today?"
	}
	//This sets 'response' equal to the key value matching 'message' in 'responseKeys'
	var response = responseKeys[message];
	if (response === undefined){
		response = "Sorry, I don't understand, please keep trying."
	}
	return response;
	}
	
var welcome = "Hello, welcome to TexVets. I'm here to help you get information about transitioning to civilian life in Texas.";
var locations = "Which of the cities above will you be closest too? AND What topics are you interested in? Medical, social, education, or jobs?";

io.on('connection', function(socket){
	io.emit('chat message', welcome);
	io.emit('chat message', locations);
   	socket.on('chat message', function(msg){
    	console.log('message: ' + msg);
    	io.emit('chat message', msg);
    	var messageRespone = respondToMessage(msg);
    	io.emit('chat message', messageRespone);
    	console.log(messageRespone);
  		});
});

http.listen(port, function(){
  console.log('listening on *:3000');
});