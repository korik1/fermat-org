var config = require('./config.js');
var winston = require('winston');
// Bring Mongoose into the app 
var mongoose = require('mongoose');
// Build the connection string 
var dbURI = 'mongodb://' + config.database.server + ':' + config.database.port + '/' + config.database.name;
// Create the database connection 
mongoose.connect(dbURI);
// CONNECTION EVENTS 
// When successfully connected 
mongoose.connection.on('connected', function () {
	winston.log('info', 'Mongoose default connection open to %s', dbURI);
	// for test
	//require('./modules/repository/developer');
	//require('./modules/repository/team');
});
// If the connection throws an error 
mongoose.connection.on('error', function (err) {
	winston.log('info', 'Mongoose default connection error', err);
});
// When the connection is disconnected 
mongoose.connection.on('disconnected', function () {
	winston.log('info', 'Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		winston.log('info', 'Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});