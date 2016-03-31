var fs = require('fs');
var path = require('path');
var request = require('../../../node_modules/request');


  
    _resquest('http://api.fermat.org/v1/repo/devs', 'devs');

    _resquest('http://api.fermat.org/v1/repo/procs', 'procs');

    _resquest('http://api.fermat.org/v1/repo/comps', 'comps');


function _resquest(url, route){

    request(url, function (error, response, body) {

        var json = body;

        fs.writeFile('../json/testData/'+ route +'.json', json, {
                flags: 'w'
            }, function (err) {
                'use strict';
                if (err) {

                }
            });

    });
}
