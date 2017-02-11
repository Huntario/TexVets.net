var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Schools = require("./models/Schools.js");
var Jerbs = require("./models/Jerbs.js");
var Clinics = require("./models/Clinics.js");
var Social = require("./models/Social.js");
var keys = require("./keys.js");
var mongoose = require("mongoose");
var _ = require('underscore');
var fakedata = require('./data.js')
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
function getCategory(message){
	var messageArray = message.split(" ");
	console.log(messageArray);
	var categoryLocation = ["medical", "social", "jobs", "school"];
	var category = (_.intersection(messageArray, categoryLocation));
	if (category.length < 1){
		category = "Sorry, I don't couldn't find that category."
		}
		console.log(category);
		return category;
	}
function buildQuery (cat, location){
		var query = cat + ".find({ city: " + location + "}, function(error, doc)";
		return query;
			}
function respondToMessage(message){
	var m = message;
	var location = getLocation(m);
	var category = getCategory(m);
	var response = "Ok I see you want to learn more about " + category + " infromation in " + location + ". One moment while I get that for you...";
	return response;
	}
function responseData(message){
	var m = message;
	var location = getLocation(m);
	var category = getCategory(m);
	var catData = fakedata[category];
	var finalDataArr = [];
	for (var i = 0; i < catData.length; i++){
		if (catData[i].city == location){
			finalDataArr.push(catData[i]);
			console.log(finalDataArr);
			return finalDataArr;
		}
	}
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
    	var responseInfo = responseData(msg)
    	console.log(messageRespone);
    	var resPonseLinks = responseData(msg);
    	if (resPonseLinks === undefined || resPonseLinks.length == 0)  {
    		var sorry = "Sorry, I couldn't find anything with that info..."
    		io.emit('chat message', sorry );
  			}
        else {
    		for (var i=0; i < resPonseLinks.length; i++){
    		io.emit('chat message', resPonseLinks[i].title);
    		io.emit('chat message', resPonseLinks[i].city);
    		io.emit('chat message', resPonseLinks[i].link);
    	}
  		};
  	});
	});
http.listen(port, function(){
  console.log('listening on *:3000');
});