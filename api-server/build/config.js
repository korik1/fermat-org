var winston = require('winston');
var secret = require('../secret.json');
var config = {};
//
config.env = process.env.NODE_ENV || 'development';
winston.log('info', 'Config Environment %s', config.env);
//
config.database = {};
config.database.server = '127.0.0.1';
config.database.port = '27017';
if (config.env == 'production') {
	config.database.name = 'fermat-org';
} else if (config.env == 'testing') {
	config.database.name = 'fermat-org-test';
} else {
	config.database.name = 'fermat-org-dev';
}
config.client_id = secret[config.env].client_id;
winston.log('info', 'Config client_id %s', config.client_id);
config.client_secret = secret[config.env].client_secret;
winston.log('info', 'Config client_secret %s', config.client_secret);
config.oauth_token = secret[config.env].oauth_token;
winston.log('info', 'Config oauth_token %s', config.oauth_token);
config.user_agent = secret[config.env].user_agent;
winston.log('info', 'Config user_agent %s', config.user_agent);
module.exports = config;