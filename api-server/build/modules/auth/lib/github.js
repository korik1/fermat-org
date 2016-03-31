var request = require('request');
var winston = require('winston');
var USER_AGENT = "api-server";

/**
 * [getUsr description]
 * @param  {[type]}   axs_tkn  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getUsr = function(axs_tkn, callback) {
	var url = "https://api.github.com/user?access_token=" + axs_tkn;
	try {
		request.get({
			url: url,
			headers: {
				'User-Agent': USER_AGENT,
				'Accept': 'application/json'
			}
		}, function(err, resp, body) {
			if (err) return callback(err, null);
			return callback(null, body);
		});
	} catch (error) {
		return callback(error, null);
	}

};

/**
 * [getUsrGithub description]
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getUsrGithub = function(url, callback) {
	try {
		request.get({
			url: url,
			headers: {
				'Accept': 'application/json'
			}
		}, function(err, resp, body) {
			body = JSON.parse(body);
			var axs_tkn = body.access_token;
			if (axs_tkn === undefined) return callback("Bad verification code. The code passed is incorrect or expired.", null);
			if (err) return callback(err, null);
			getUsr(axs_tkn, function(error, res_usr) {
				if (error) {
					console.log("error", error);
					return callback(error, null);
				}
				if (res_usr) {
					console.log("return data user");
					res_usr = JSON.parse(res_usr);
					var usr = {};
					usr.usrnm = res_usr.login;
					usr.email = res_usr.email;
					usr.name = res_usr.name;
					usr.bday = null;
					usr.location = res_usr.location;
					usr.avatar_url = res_usr.avatar_url;
					usr.github_tkn = axs_tkn;
					usr.url = res_usr.url;
					usr.bio = res_usr.bio;
					console.log(usr);
					return callback(null, usr);
				} else return callback("User no found", null);
			});
		});
	} catch (error) {
		console.log("error", error);
		return callback(error, null);
	}

};