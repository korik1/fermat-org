/*global require*/
/*global module*/
var express = require('express');
var router = express.Router();
var winston = require('winston');
var security = require('../../../lib/utils/security');
var repMod = require('../../../modules/repository');
var authMod = require('../../../modules/auth');
var Cache = require('../../../lib/route-cache');
var layerRout = require('./layer');
var suprlayRout = require('./suprlay');
var procRout = require('./proc');
var platfrmRout = require('./platfrm');
var compRout = require('./comp');
// creation of object cache
var cache = new Cache({
	type: 'file',
	time: 36000000
});
/**
 * [auth description]
 *
 * @method auth
 *
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
var auth = function (req, res, next) {
	var axs_key = req.query.axs_key;
	var digest = req.query.digest;
	authMod.verifyTkn(axs_key, digest, function (err_auth, res_auth) {
		if (res_auth) {
			req.body.usr_id = req.params.usr_id;
			next();
		} else {
			res.status(401).send({
				'message': err_auth.message
			});
		}
	});
	//next();
};
/**
 *
 */
router.use("/usrs/:usr_id/layers", auth, layerRout);
router.use("/usrs/:usr_id/suprlays", auth, suprlayRout);
router.use("/usrs/:usr_id/procs", auth, procRout);
router.use("/usrs/:usr_id/platfrms", auth, platfrmRout);
router.use("/usrs/:usr_id/comps", auth, compRout);
/**
 * @api {get} /v1/repo/comps/reload reload
 * @apiName Reload
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription Updates the database repository components fermat.
 */
router.get('/comps/reload', function (req, res, next) {
	'use strict';
	try {
		repMod.updBook(req, function (error, result) {
			if (error) {
				//res.status(200).send(error);
				winston.log('error', 'Error: ', error);
			} else {
				repMod.loadComps(req, function (error, res) {
					if (error) {
						winston.log('error', 'Error: ', error);
					} else {
						repMod.updComps(req, function (error, result) {
							if (error) {
								winston.log('error', 'Error: ', error);
								//res.status(200).send(error);
							} else {
								//res.status(200).send(result);
								winston.log('info', 'Success updating');
							}
						});
					}
				});
			}
		});
		res.status(200).send({
			'message': 'Updated Database'
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/comps get components
 * @apiName GetComps
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription List of layers, super layer, platforms, components and processes from architecture of fermat.
 */
router.get('/comps', function (req, res, next) {
	'use strict';
	try {
		/*var body = cache.getBody(req);
		if (body) {
		    // we send it
		    res.status(200).send(body);
		    repMod.getComps(req, function (error, result) {
		        if (error) {
		            winston.log('error', 'Error: ', error);
		        } else {
		            // we save it
		            cache.setBody(req, result);
		        }
		    });
		} else {*/
		// we create it
		repMod.getComps(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				// we save it
				//cache.setBody(req, result);
				res.status(200).send(result);
			}
		});
		//}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/devs get developers
 * @apiName GetDevs
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription Get information from the developers involved in the repository fermat.
 */
router.get('/devs', function (req, res, next) {
	'use strict';
	try {
		/*var body = cache.getBody(req);
		if (body) {
		    // we send it
		    res.status(200).send(body);
		    repMod.getDevs(req, function (error, result) {
		        if (error) {
		            winston.log('error', 'Error: ', error);
		        } else {
		            // we save it
		            cache.setBody(req, result);
		        }
		    });
		} else {*/
		// we create it
		repMod.getDevs(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				// we save it
				//cache.setBody(req, result);
				res.status(200).send(result);
			}
		});
		//}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/procs get process
 * @apiName GetProcs
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription Get list processes from architecture of fermat.
 */
router.get('/procs', function (req, res, next) {
	'use strict';
	try {
		// we search for body in cache
		/*var body = cache.getBody(req);
		if (body) {
		    // we send it
		    res.status(200).send(body);
		    repMod.getProcs(req, function (error, result) {
		        if (error) {
		            winston.log('error', 'Error: ', error);
		        } else {
		            // we save it
		            cache.setBody(req, result);
		        }
		    });
		} else {*/
		// we create it
		repMod.getProcs(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				// we save it
				//cache.setBody(req, result);
				res.status(200).send(result);
			}
		});
		//}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/readme get readme
 * @apiName GetReadme
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription Get the contents of the readme of fermat.
 */
router.get('/readme', function (req, res, next) {
	'use strict';
	try {
		repMod.getReadme(req, function (error, result) {
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
 * @api {get} /v1/repo/book get book
 * @apiName GetBook
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription Get the contents of the book of fermat.
 */
router.get('/book', function (req, res, next) {
	'use strict';
	try {
		repMod.getBook(req, function (error, result) {
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
 * @api {get} /v1/repo/docs/:type get docs
 * @apiName GetDocs
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription Get the contents of the documentation of fermat.
 * @apiParam {String} type Represents the type of documentation (book, readme, paper).
 */
router.get('/docs/:type', function (req, res, next) {
	'use strict';
	try {
		var type = req.param('type');
		var style = req.query.style;
		if (type !== 'book' && type !== 'readme' && type !== 'paper') {
			return res.status(422).send({
				message: 'Bad Parameters'
			});
		}
		if (typeof style != 'undefined' && style != 'big') {
			return res.status(422).send({
				message: 'Bad Parameters'
			});
		}
		repMod.getDocs(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				res.sendfile(result.pdfFile);
			}
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/manifest/check check manifest
 * @apiName CheckManifest
 * @apiVersion 0.0.1
 * @apiGroup REPO
 * @apiDescription checks if the manifest has a correct format.
 */
router.get('/manifest/check', function (req, res, next) {
	'use strict';
	try {
		// we create it
		repMod.checkManifest(req, function (error, result) {
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
//
module.exports = router;