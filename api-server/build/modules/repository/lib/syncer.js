/* global echo */
/* global exec */
/* global echo */
/* global cd */
/* global test */
/* global which */
require('shelljs/global');
var path = require('path');
var winston = require('winston');
/**
 * Download Fermat repository and returns the documentation
 **/
var getBook = function (callback) {
	'use strict';
	var cwd = process.cwd(),
		env = process.env.NODE_ENV || 'development',
		folder = path.join(process.cwd(), 'cache', env),
		dir = path.join(folder, 'fermat'),
		err = 0;
	winston.log('info', 'Using %s as cache folder', folder);
	if (!which('git')) {
		echo('Sorry, this script requires git');
		err = 1;
		//exit(1);
	}
	if (!which('asciidoctor')) {
		echo('Sorry, this script requires asciidoctor');
		err = 1;
		//exit(1);
	}
	if (test('-d', dir)) {
		cd(dir);
		if (exec('git reset --hard').code !== 0) {
			echo('Error: Git reset failed');
			err = 1;
			//exit(1);
		}
		winston.log('info', 'Pulling repository');
		if (env === 'development') {
			if (exec('git checkout develop').code !== 0) {
				echo('Error: Git checkout failed');
				err = 1;
				//exit(1);
			}
			if (exec('git pull origin develop').code !== 0) {
				echo('Error: Git pull failed');
				err = 1;
				//exit(1);
			}
		} else {
			if (exec('git checkout master').code !== 0) {
				echo('Error: Git checkout failed');
				err = 1;
				//exit(1);
			}
			if (exec('git pull origin master').code !== 0) {
				echo('Error: Git pull failed');
				err = 1;
				//exit(1);
			}
		}
		cd('fermat-documentation');
		winston.log('info', 'Compiling documentation');
		if (exec('asciidoctor -d book documentation.asciidoc').code !== 0) {
			echo('Error: asciidoctor book failed');
			err = 1;
			//exit(1);
		}
	} else {
		cd(folder);
		winston.log('info', 'Cloning repository');
		if (exec('git clone https://github.com/Fermat-ORG/fermat.git').code !== 0) {
			echo('Error: Git clone failed');
			err = 1;
			//exit(1);
		}
		cd('./fermat');
		if (env === 'development') {
			if (exec('git branch develop').code !== 0) {
				echo('Error: Git branch failed');
				err = 1;
				//exit(1);
			}
			if (exec('git checkout develop').code !== 0) {
				echo('Error: Git checkout failed');
				err = 1;
				//exit(1);
			}
			if (exec('git pull origin develop').code !== 0) {
				echo('Error: Git pull failed');
				err = 1;
				//exit(1);
			}
		}
		cd('./fermat-documentation');
		winston.log('info', 'Compiling documentation');
		if (exec('asciidoctor -d book documentation.asciidoc').code !== 0) {
			echo('Error: asciidoctor book failed');
			err = 1;
			//exit(1);
		}
	}
	cd(cwd);
	if (typeof callback != 'undefined') {
		if (err) {
			callback('Error: syncer failed', null);
		} else {
			callback(null, true);
		}
		return;
	}
};
exports.getBook = getBook;