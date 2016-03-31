var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");
var fs = require('fs');
var server = supertest.agent("http://localhost:8081");
var pathTest = "/v1/net/waves"

mongoose.connect('mongodb://localhost/fermat-org-dev');

describe("NET",function(){
    var wave = JSON.parse(fs.readFileSync('./test/routes/v1/net/network_dummy.json', 'utf8'));

    it("#POST addWave",function(done){
        var dataWave = { wave: wave };
        this.timeout(200000);
        server
        .post(pathTest+"/")
        .send(dataWave)
        .expect("Content-type",/json/)
        .expect(201) // This is HTTP response
        .end(function(err,res){
          if (err) return done(err);

          res.status.should.equal(201);

          return done();
        });
      });
});