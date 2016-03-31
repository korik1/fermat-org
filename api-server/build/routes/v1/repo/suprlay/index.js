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
		if (req.params.suprlay_id) {
			req.body.item_id = req.params.suprlay_id;
			req.body.item_type = 'suprlay';
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
				winston.log('error', 'Error releasing suprlay lock', error);
			}
		});
	} catch (err) {
		winston.log('error', 'Error releasing suprlay lock', err);
	}
};
/**
 * using lock for suprlay routes
 */
//router.use(lock);
/**
 * @api {post} /v1/repo/usrs/:usr_id/suprlays add super layer
 * @apiVersion 0.0.1
 * @apiName AddSuprLay
 * @apiGroup Repo-SuprLay
 * @apiParam {String} code Superlay code.
 * @apiParam {String} name Superlay name.
 * @apiParam {String} logo Superlay logo.
 * @apiParam {Number} order Indicates the position where the suprlay this with respect to other.
 * @apiDescription Add a super layer to the architecture of fermat.
 */
router.post('/', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.body.code) || //
			!security.isValidData(req.body.name) || //
			!security.ifExistIsValidData(req.body.logo) || //
			!security.isValidData(req.body.order)) {
			res.status(412).send({
				message: 'missing or invalid data'
			});
		} else {
			repMod.addSuprLay(req, function (error, result) {
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
 * @api {get} /v1/repo/usrs/:usr_id/suprlays list super layers
 * @apiVersion 0.0.1
 * @apiName ListSuprLays
 * @apiGroup Repo-SuprLay
 * @apiDescription Get list super layer from architecture of fermat.
 */
router.get('/', function (req, res, next) {
	'use strict';
	try {
		repMod.listSuprLays(req, function (error, result) {
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
 * @api {get} /v1/repo/usrs/:usr_id/suprlays/:suprlay_id get super layer
 * @apiVersion 0.0.1
 * @apiName GetSprlay
 * @apiGroup Repo-SuprLay
 * @apiParam {ObjectId} suprlay_id Unique identifier of the suprlay.
 * @apiDescription Get superlayer from architecture of fermat.
 */
router.get('/:suprlay_id', function (req, res, next) {
	'use strict';
	try {
		lock(req, function (err_lck, res_lck) {
			if (err_lck) {
				res.status(423).send(err_lck);
			} else {
				repMod.getSprlay(req, function (error, result) {
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
 * @api {put} /v1/repo/usrs/:usr_id/suprlays/:suprlay_id update super layer
 * @apiVersion 0.0.1
 * @apiName UptSprlay
 * @apiGroup Repo-SuprLay
 * @apiParam {ObjectId} suprlay_id Unique identifier of the suprlay.
 * @apiParam {String} code Superlay code.
 * @apiParam {String} name Superlay name.
 * @apiParam {String} logo Superlay logo.
 * @apiParam {Number} order Indicates the position where the suprlay this with respect to other.
 * @apiDescription Update super layer from architecture of fermat.
 */
router.put('/:suprlay_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.suprlay_id) || //
			!security.ifExistIsValidData(req.body.code) || //
			!security.ifExistIsValidData(req.body.name) || //
			!security.ifExistIsValidData(req.body.logo) || //
			!security.ifExistIsValidData(req.body.order)) {
			res.status(412).send({
				message: 'missing or invalid data'
			});
		} else {
			repMod.uptSprlay(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					//new
					if (result) {
						res.status(200).send(result);
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
					//end new
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {delete} /v1/repo/usrs/:usr_id/suprlays/:suprlay_id delete super layer
 * @apiVersion 0.0.1
 * @apiName DelSprlay
 * @apiGroup Repo-SuprLay
 * @apiParam {ObjectId} suprlay_id Unique identifier of the suprlay.
 * @apiDescription Delete super layer from architecture of fermat.
 */
router.delete('/:suprlay_id', function (req, res, next) {
	'use strict';
	try {
		repMod.delSprlay(req, function (error, result) {
			if (error) {
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
// suprlay router export
module.exports = router;