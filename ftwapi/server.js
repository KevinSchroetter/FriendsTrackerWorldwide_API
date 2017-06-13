var express = require('express');
var	app = express();
var	port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ftwDb;
var apiRoutes = require('./api/routes/index');
var db = require('./api/db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', apiRoutes);



db.connect("mongodb://FriendsTrackerWorldwide:FTW2017@ds115352.mlab.com:15352/ftw", function(err){
	if(err){
		console.log('Unable to connect to FrriendsTrackerWorldwide Database!');
		process.exit(1);
	}
	else{
		app.listen(port);
		console.log('FriendsTrackerWorldwide API listening on Port: ' + port);
	}
});



module.exports = app;
