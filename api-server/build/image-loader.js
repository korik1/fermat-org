var fs = require('fs');
var ncp = require('ncp').ncp;
var path = require('path');
var winston = require('winston');
var filename;
var images = [];
var root = '../platform-visualization/images';
var destination = '../platform-visualization/images/wallet_screenshots';
var source = '../../../Test/api-server/cache/production/fermat/seed-resources/wallet_screenshots';
/**
 * [walkDir description]
 *
 * @method walkDir
 *
 * @param  {[type]} directoryName [description]
 *
 * @return {[type]} [description]
 */
var walkDir = function (directoryName) {
    'use strict';
    var files = fs.readdirSync(directoryName);
    var walkFile = function (i) {
        if (i < files.length) {
            filename = files[i];
            var fullPath = path.join(directoryName, filename);
            var file = fs.statSync(fullPath);
            if (file.isDirectory()) {
                walkDir(fullPath);
                walkFile(++i);
            } else {
                if (fullPath.indexOf(".jpg") > -1 || fullPath.indexOf(".jpeg") > -1 || fullPath.indexOf(".png") > -1 || fullPath.indexOf(".gif") > -1) {
                    var strFile = fullPath.replace('../platform-visualization', '.');
                    images.push(strFile);
                }
                walkFile(++i);
            }
        }
    };
    walkFile(0);
};
/**
 * [loadImages description]
 *
 * @method loadImages
 *
 * @return {[type]}   [description]
 */
var loadImages = function () {
    walkDir(root);
    var imagesStr = JSON.stringify(images.sort());
    fs.writeFile('../platform-visualization/json/images.json', imagesStr, {
        flags: 'w'
    }, function (err) {
        'use strict';
        if (err) {
            winston.log('info', 'Error reading or parsing file cache', err);
        }
    });
};
/**
 * copy the images from the screenshots
 *
 * @method
 *
 * @param  {string} source
 * @param  {string} destination
 * @param  {function} callback
 * 
 */
try {
    ncp(source, destination, function (err) {
        if (err) {
            winston.log('info', err.message, err);
            loadImages();
        } else {
            source = '../../../Test/api-server/cache/development/fermat/seed-resources/wallet_screenshots';
            ncp(source, destination, function (err) {
                if (err) {
                    winston.log('info', err.message, err);
                }
                loadImages();
            });
        }
    });
} catch (err) {
    winston.log('info', err.message, err);
}