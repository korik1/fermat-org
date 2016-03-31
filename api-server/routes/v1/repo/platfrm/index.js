var winston = require('winston');
var express = require('express');
var router = express.Router();
var repMod = require('../../../../modules/repository');
var security = require('../../../../lib/utils/security');
/**
 * [description]
 *
 * @method
 *
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next  [description]
 *
 * @return {[type]} [description]
 */
var lock = function (req, next) {
	console.log('doing lock...');
	try {
		console.dir(req.params);
		console.dir(req.body);
		if (req.params.platfrm_id) {
			req.body.item_id = req.params.platfrm_id;
			req.body.item_type = 'platfrm';
			req.body.priority = 5;
			console.dir(req.body);
			repMod.doLock(req, function (error, result) {
				if (error) {
					next(error, null);
				} else {
					next(null, result);
				}
			});
		} else {
			next(null, null);
		}
	} catch (err) {
		next(err, null);
	}
};
/**
 * [release description]
 *
 * @method release
 *
 * @param  {[type]} req [description]
 *
 * @return {[type]} [description]
 */
var release = function (req) {
	try {
		repMod.doRelease(req, function (error, result) {
			if (error) {
				winston.log('error', 'Error releasing platfrm lock', error);
			}
		});
	} catch (err) {
		winston.log('error', 'Error releasing platfrm lock', err);
	}
};
/**
 * using lock for platfrm routes
 */
//router.use(lock);
/**
 * @api {post} /v1/repo/usrs/:usr_id/platfrms add platform
 * @apiVersion 0.0.1
 * @apiName AddPlatform
 * @apiParam {String} code    Code that identifies the language.
 * @apiParam {String} name    Platform name.
 * @apiParam {String} logo Platform logo.
 * @apiParam {Number} order Indicates the position where the platform this with respect to other.
 * @apiGroup Repo-Platform
 * @apiDescription Add a platform to the architecture of fermat.
 */
router.post('/', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.body.code) || //
			!security.isValidData(req.body.name) || //
			!security.ifExistIsValidData(req.body.logo) || //
			!security.isValidData(req.body.order)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.addPlatform(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					res.status(201).send(result);
				}
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/usrs/:usr_id/platfrms list platforms
 * @apiVersion 0.0.1
 * @apiName ListPlatforms
 * @apiGroup Repo-Platform
 * @apiDescription Get list platforms from the architecture of fermat.
 */
router.get('/', function (req, res, next) {
	'use strict';
	try {
		repMod.listPlatforms(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				res.status(200).send(result);
			}
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/usrs/:usr_id/platfrms/:platfrm_id get platform
 * @apiVersion 0.0.1
 * @apiName GetPlatform
 * @apiGroup Repo-Platform
 * @apiParam {ObjectId} platfrm_id Represents the identifier of the platform.
 * @apiDescription Get platform from the architecture of fermat.
 */
router.get('/:platfrm_id', function (req, res, next) {
	'use strict';
	try {
		lock(req, function (err_lck, res_lck) {
			if (err_lck) {
				res.status(423).send(err_lck);
			} else {
				repMod.getPltf(req, function (error, result) {
					if (error) {
						res.status(200).send(error);
					} else {
						if (result) {
							res.status(200).send(result);
						} else {
							res.status(404).send({
								message: "NOT FOUND"
							});
						}
					}
				});
			}
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {put} /v1/repo/usrs/:usr_id/platfrms/:platfrm_id update platform
 * @apiVersion 0.0.1
 * @apiName UptPltf
 * @apiGroup Repo-Platform
 * @apiParam {ObjectId} platfrm_id Represents the identifier of the platform.
 * @apiDescription Update platform from the architecture of fermat.
 */
router.put('/:platfrm_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.platfrm_id) ||
			!security.ifExistIsValidData(req.body.name) || //
			!security.ifExistIsValidData(req.body.logo) || //
			!security.ifExistIsValidData(req.body.order)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.uptPltf(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					if (result) {
						res.status(200).send(result);
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {delete} /v1/repo/usrs/:usr_id/platfrms/:platfrm_id delete platform
 * @apiVersion 0.0.1
 * @apiName DelPltf
 * @apiGroup Repo-Platform
 * @apiParam {ObjectId} platfrm_id Represents the identifier of the platform.
 * @apiDescription Delete platform from the architecture of fermat.
 */
router.delete('/:platfrm_id', function (req, res, next) {
	'use strict';
	try {
		repMod.delPltf(req, function (error, result) {
			if (error) {
				console.log(error);
				res.status(200).send(error);
			} else {
				if (result) {
					res.status(204).send();
				} else {
					res.status(404).send({
						message: "NOT FOUND"
					});
				}
			}
			release(req);
		});
	} catch (err) {
		next(err);
	}
});
// platfrm router export
module.exports = router;