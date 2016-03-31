/*global require*/
var express = require('express');
var router = express.Router();
var v1 = require('./v1');
//
router.use('/v1', v1);
/* GET home page. */
router.all('/', function (req, res) {
	res.render('index.html');
});
/*global module*/
module.exports = router;