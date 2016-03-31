var plan = require('flightplan');
var deploy = require('./deploy.json');
var date = new Date();
var timestamp = date.getTime();
/**
 * Remote configuration for "production"
 */
plan.target('all', {
	host: deploy.all.host,
	username: deploy.all.username,
	root: deploy.all.root,
	project: deploy.all.project,
	agent: process.env.SSH_AUTH_SOCK,
	privateKey: deploy.all.privateKey,
	repository: deploy.all.repository,
	branch: deploy.all.branch,
	maxDeploys: deploy.all.maxDeploys
});
/**
 * Creates all the necessary folders in the remote and clones the source git repository
 * 
 * Usage:
 * > fly setup[:remote]
 */
plan.remote('setup', function (remote) {
	remote.hostname();
	remote.exec('cd ' + remote.runtime.root);
	remote.exec('mkdir -p repo');
	remote.exec('mkdir -p versions');
	remote.with('cd repo', function () {
		remote.exec('git clone -b ' + remote.runtime.branch + ' ' + remote.runtime.repository);
	});
});
/**
 * [description]
 *
 * @method
 *
 * @param  {[type]} local
 *
 * @return {[type]} [description]
 */
plan.local('build', function (local) {
	local.exec('gulp build');
	local.exec('git add --all');
	local.exec('git commit -am "build ' + timestamp + '"');
	local.exec('git push');
});
/**
 * Deploys a new version of the code pulling it from the git repository
 *
 * Usage:
 * > fly deploy[:remote]
 */
plan.remote('deploy', function (remote) {
	remote.hostname();
	remote.with('cd ' + remote.runtime.root, function () {
		remote.exec('cd repo/' + remote.runtime.project + ' && git pull origin ' + remote.runtime.branch);
		var versionFolder = remote.runtime.root + '/versions/' + timestamp;
		var currentFolder = remote.runtime.root + '/versions/current';
		remote.exec('cp -R ' + remote.runtime.root + '/repo/' + remote.runtime.project + '/api-server/build ' + versionFolder);
		remote.exec('ln -fsn ' + versionFolder + ' ' + currentFolder);
		remote.exec('ln -fsn  /home/ubuntu/cache ' + versionFolder + '/cache');
		if (remote.runtime.maxDeploys > 0) {
			remote.log('Cleaning up old deploys...');
			remote.sudo('rm -rf `ls -1dt ' + remote.runtime.root + '/versions/* | tail -n +' + (remote.runtime.maxDeploys + 1) + '`');
		}
		remote.exec('ln -fsn  /home/ubuntu/secret.json ' + remote.runtime.root + '/versions/secret.json');
		remote.with('cd ' + versionFolder, function () {
			remote.sudo('npm install --production');
			remote.sudo('forever stopall');
			remote.sudo('NODE_ENV=production PORT=8000 forever start bin/www');
			remote.sudo('NODE_ENV=testing PORT=8001 forever start bin/www');
			remote.sudo('NODE_ENV=development PORT=8002 forever start bin/www');
			remote.sudo('forever start proxy.js');
			remote.sudo('forever list');
			remote.log('Successfully deployied in ' + versionFolder);
			remote.log('To rollback to the previous version run "fly rollback:target"');
		});
	});
});
/**
 * Rollbacks to the previous deployed version (if any)
 *
 * Usage
 * > fly rollback[:remote]
 */
plan.remote('rollback', function (remote) {
	remote.hostname();
	remote.with('cd ' + remote.runtime.root, function () {
		var command = remote.exec('ls -1dt versions/* | head -n 2');
		var versions = command.stdout.trim().split('\n');
		if (versions.length < 2) {
			return remote.log('No version to rollback to');
		}
		var lastVersion = versions[0];
		var previousVersion = versions[1];
		remote.log('Rolling back from ' + lastVersion + ' to ' + previousVersion);
		remote.exec('cd ' + previousVersion);
		remote.exec('npm start');
		remote.exec('cd ..');
		remote.sudo('rm -rf ' + lastVersion);
	});
});