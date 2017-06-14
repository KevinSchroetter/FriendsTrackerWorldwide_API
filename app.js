var express = require('express');
var	app = express();
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ftwDb;
var apiRoutes = require('./api/routes/index');
var db = require('./api/db');
var http = require('http');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', apiRoutes);



db.connect("mongodb://FriendsTrackerWorldwide:FTW2017@ds115352.mlab.com:15352/ftw", function(err){
	if(err){
		console.log('Unable to connect to FrriendsTrackerWorldwide Database!');
		process.exit(1);
	}
	else{
		var server = http.createServer(app);
		server.listen(appEnv.port, appEnv.bind);
		console.log('FriendsTrackerWorldwide API listening on Port: ' + appEnv.url);
	}
});



module.exports = app;
