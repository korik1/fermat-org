'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
//var repo = require('./routes/repo');
//var v1 = require('./routes/v1');
var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
	//res.header("Content-Type",'application/json');
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
	res.header("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type');
	//res.header("Access-Control-Allow-Credentials", true);
	next();
});
app.use('/', routes);
//app.use('/repo', repo);
//app.use('/v1', v1);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('not found');
	err.status = 404;
	next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500).send({
			error: err.message,
			stack: err.stack
		});
	});
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500).send({
		error: err.message
	});
});
module.exports = app;