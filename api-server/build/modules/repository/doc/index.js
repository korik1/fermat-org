var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var winston = require('winston');
var markdownpdf = require("markdown-pdf");
var env = process.env.NODE_ENV || 'development';
/**
 * [getBook description]
 * Obtiene una pagina html que tiene toda la documentacion del proyecto
 * @method getBook
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getBook = function (callback) {
	'use strict';
	try {
		var book = path.join(process.cwd(), 'cache', env, 'fermat', 'fermat-documentation', 'documentation.html');
		winston.log('debug', 'reading file ', book);
		var bookStr = fs.readFileSync(book);
		return callback(null, bookStr);
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * Se trae del repositorio el readme
 *
 * @method getReadme
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getReadme = function (callback) {
	'use strict';
	try {
		var readme = path.join(process.cwd(), 'cache', env, 'fermat', 'README.md');
		winston.log('debug', 'reading file ', readme);
		var readmeStr = fs.readFileSync(readme);
	} catch (err) {
		return callback(err, null);
	}
};
var inspectFile = function inspectFile(file, copy, regExp, callback) {
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			return callback('Error proccesing file', null);
		}
		var re = new RegExp(regExp, 'g');
		var br = new RegExp('<br>', 'g');
		var absPathImg = path.join(process.cwd(), 'assets', 'images');
		var result = data.replace(re, './assets/images');
		result = result.replace(br, '');
		fs.writeFile(copy, result, 'utf8', function (err) {
			if (err) return callback('Error writing file', null);
			return callback(null, true);
		});
	});
};
exports.generateBookPdf = function (callback) {
	var fermatBookLarge = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-book-big.pdf');
	var fermatBook = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-book.pdf');
	var dir = path.join(process.cwd(), 'cache', env, 'fermat', 'fermat-book');
	var book = path.join(process.cwd(), 'cache', env, 'fermat', 'fermat-book', 'fermat-book.asciidoc');
	exec('asciidoctor-pdf -a pdf-style=bookc -a allow-uri-read -d book -o ' + fermatBookLarge + ' ' + book, function (error, stdout, stderr) {
		if (error) return callback('Error proccesing book big', null);
		exec('asciidoctor-pdf -a allow-uri-read -d book -o ' + fermatBook + ' ' + book, function (err, std, st) {
			if (err) return callback('Error proccesing book', null);
			return callback(null, true);
		});
	});
};
/**
 * [getBookPdf description]
 *
 * @method getBookPdf
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getBookPdf = function (style, callback) {
	'use strict';
	try {
		var cacheFile = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-book.pdf');
		if (style) {
			cacheFile = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-book-big.pdf');
		}
		var resp = {
			pdfFile: cacheFile
		};
		return callback(null, resp);
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getReadmePdf description]
 *
 * @method getReadmePdf
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getReadmePdf = function (style, callback) {
	'use strict';
	try {
		var readme = path.join(process.cwd(), 'cache', env, 'fermat', 'README.md');
		var cacheFile = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-readme.pdf');
		var name = 'readme.pdf';
		var resp = {
			pdfFile: cacheFile
		};
		var css = 'style.css';
		var copyReadme = path.join(process.cwd(), 'cache', env, 'files', 'copyREADME.md');
		var regExp = 'https://github.com/Fermat-ORG/media-kit/blob/master';
		var paperFormat = 'letter';
		if (style) {
			cacheFile = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-readme-big.pdf');
			name = 'readme-big.pdf';
			css = 'style-big.css';
			paperFormat = 'A4';
			resp = {
				pdfFile: cacheFile
			};
		}
		winston.log('debug', 'reading file ', readme);
		console.log(cacheFile);
		fs.stat(cacheFile, function (err, stats) {
			console.log(arguments);
			var diff;
			if (stats) {
				var thisTime = new Date();
				diff = (thisTime.getTime() - stats.ctime.getTime()) / (1000 * 60 * 60);
			} else {
				diff = 999;
			}
			if (diff > 12) {
				inspectFile(readme, copyReadme, regExp, function (err, result) {
					if (err) {
						return callback(err, null);
					}
					markdownpdf({
						cssPath: './assets/styles/' + css,
						paperFormat: paperFormat
					}).from(copyReadme).to(cacheFile, function () {
						return callback(null, resp);
					});
				});
			} else {
				return callback(null, resp);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getPaperPdf description]
 *
 * @method getPaperPdf
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getPaperPdf = function (style, callback) {
	'use strict';
	try {
		var paper = path.join(process.cwd(), 'cache', env, 'fermat', 'FERMAT-WHITE-PAPER.md');
		var cacheFile = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-whitepaper.pdf');
		var name = 'fermat-white-paper.pdf';
		var copyPaper = path.join(process.cwd(), 'cache', env, 'files', 'copyPaper.md');
		var regExp = 'https://github.com/Fermat-ORG/media-kit/blob/master';
		var css = 'style.css';
		var paperFormat = 'letter';
		var resp = {
			pdfFile: cacheFile
		};
		if (style) {
			cacheFile = path.join(process.cwd(), '..', 'platform-visualization', 'books', 'fermat-whitepaper-big.pdf');
			name = 'fermat-white-paper-big.pdf';
			css = 'style-big.css';
			paperFormat = 'A4';
			resp = {
				pdfFile: cacheFile
			};
		}
		winston.log('debug', 'reading file ', paper);
		fs.stat(cacheFile, function (err, stats) {
			var diff;
			if (stats) {
				var thisTime = new Date();
				diff = (thisTime.getTime() - stats.ctime.getTime()) / (1000 * 60 * 60);
			} else {
				diff = 999;
			}
			if (diff > 12) {
				inspectFile(paper, copyPaper, regExp, function (err, result) {
					markdownpdf({
						cssPath: './assets/styles/' + css,
						paperFormat: paperFormat
					}).from(copyPaper).to(cacheFile, function () {
						return callback(null, resp);
					});
				});
			} else {
				return callback(null, resp);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};