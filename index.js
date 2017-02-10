var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Schools = require("./models/Schools.js");
var Jerbs = require("./models/Jerbs.js");
var Clinics = require("./models/Clinics.js");
var Social = require("./models/Social.js");
var mongoose = require("mongoose");
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


function respondToMessage(message){
	var responseKeys = {
		1 : "You said 1!",
		2 : "You said 2!",
		help : "How can I help you today?"
	}
	var response = responseKeys[message];
	if (response === undefined){
		response = "Sorry I don't understand, pleae keep trying."
	}
	return response;
	// var response;
	// if (message == 1){
	// 	response = "You said 1!";
	// 	break;
	// }
	// if (message == 2){
	// 	response = "You said 2!";
	// 	break;
	// }
	// else {
	// 	response = "Sorry I don't recognize what you said... Please keep talking to me."
	// 	break;
	// }
	// return response;
	}

var welcome = "Hello, welcome to TexVets. I'm here to help you get information about transitioning to civilian life in Texas.";
var options = "Based on the map above, what area are you considering?";
var locations = "You can say (1) North Texas, (2) East Texas, (3) Central Texas";

io.on('connection', function(socket){
	io.emit('chat message', welcome);
	io.emit('chat message', options);
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