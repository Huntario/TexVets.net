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

io.on('connection', function(socket){
   	socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});