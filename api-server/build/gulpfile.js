var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var apidoc = require('gulp-apidoc');
var nodemon = require('gulp-nodemon');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
//
process.setMaxListeners(0);
//
var src_files = [
    'bin/*',
	'lib/**/*.{js,json}',
	'modules/**/*.{js,json}',
	'!node_modules/**/*',
	'routes/**/*.{js,json}',
	'!test/**/*.{js,json}',
	'*.{js,json}'
];
// jslint task for source files and tests that don't require database connection
gulp.task('jslint', function () {
	return gulp.src(src_files).pipe(jshint({
		'undef': true,
		'unused': false,
		'node': true,
		'nomen': true,
		'plusplus': false,
		'latedef': true
	})).pipe(jshint.reporter('jshint-stylish'));
});
// mocha tests task for files that don't require database connection
gulp.task('mocha', ['jslint'], function () {
	return gulp.src(['test/**/*.{js,json}'], {
			read: false
		}).pipe(jshint.reporter('jshint-stylish')) //
		.pipe(mocha()) // 
		.once('end', function () {
			process.exit();
		});
});
// apidoc task that generates route documentation
gulp.task('apidoc', function (done) {
	apidoc({
		src: "routes/",
		dest: "public/"
	}, done);
});
// clean folder task
gulp.task('clean', function () {
	return gulp.src(['build'], {
			read: false
		}) // much faster 
		//.pipe(ignore('build')) //
		.pipe(rimraf({
			force: true
		}));
});
// build task
gulp.task('build', ['clean', 'apidoc'], function () {
	gulp.src(['!node_modules/**/*', '!test/**/*', '**', '*.*']).pipe(ignore(['flightplan.js', 'deploy.json', 'secret.json', 'FermatBitcoin.pem'])).pipe(gulp.dest('build')).once('end', function () {
		return gulp.src(['build/node_modules', 'build/test'], {
				read: false
			}) // much faster 
			.pipe(rimraf({
				force: true
			}));
	});
});
// watch files changes
gulp.task('watch', function () {
	gulp.watch(src_files, ['jslint']);
});
// nodemon watch runs and refreshes the server when a file is modified
gulp.task('nodemon-dev', function () {
	nodemon({
		script: 'bin/www',
		ext: 'js html json',
		watch: src_files,
		ignore: ['test/**/*'],
		env: {
			'NODE_ENV': 'development',
			'PORT': '8002'
		}
	});
});
gulp.task('nodemon-test', function () {
	nodemon({
		script: 'bin/www',
		ext: 'js html json',
		watch: src_files,
		ignore: ['test/**/*'],
		env: {
			'NODE_ENV': 'testing',
			'PORT': '8001'
		}
	});
});
gulp.task('nodemon-prod', function () {
	nodemon({
		script: 'bin/www',
		ext: 'js html json',
		watch: src_files,
		ignore: ['test/**/*'],
		env: {
			'NODE_ENV': 'production',
			'PORT': '8000'
		}
	});
});
gulp.task('nodemon-prox', function () {
	nodemon({
		script: 'proxy.js',
		ext: 'js html json',
		watch: src_files,
		ignore: ['test/**/*']
	});
});