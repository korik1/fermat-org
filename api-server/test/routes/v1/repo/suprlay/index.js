var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");
var server = supertest.agent("http://localhost:8081");
var suprlayMod = require("../../../../../modules/repository/superlayer");
var compMod = require("../../../../../modules/repository/component");
//var auth = require("../../../herlpers/v1/auth")
var dataHelper = require("../../../../helpers/v1/dataHelper");
var pathTest = "/v1/repo/usrs/1/suprlays"

mongoose.connect('mongodb://localhost/fermat-org-dev');

describe("SUPRLAY",function(){

    var suprlay;

    beforeEach(function(done){
        //add some test data
        var dataSuprLay = dataHelper.generateDataSuprLay();
        suprlayMod.insOrUpdSuprlay(dataSuprLay.code, dataSuprLay.name, dataSuprLay.logo, null, dataSuprLay.order, function(err_suprlay, res_suprlay){
            if (err_suprlay) return console.log(err_suprlay);

            suprlay = res_suprlay;

            var dataComp = dataHelper.generateDataComp();
            var loopComp = function(i){
                if (i<3) {
                    compMod.insOrUpdComp(dataComp.platfrm_id, res_suprlay._id, dataComp.layer_id, dataComp.name, dataComp.type, dataComp.description, dataComp.difficulty, dataComp.code_level, dataComp.repo_dir, dataComp.scrnshts, dataComp.found, function(err_comp, res_comp){

                        if (err_comp) return console.log(err_comp);

                        i = i + 1;
                        loopComp(i);

                    });
                } else {
                    done();
                }
            };
            loopComp(0);

        });

    });

    it("#GET getSprlay",function(done){

        server
        .get(pathTest+"/"+suprlay._id)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.code.should.equal(suprlay.code);
            res.body.name.should.equal(suprlay.name);
            res.body.logo.should.equal(suprlay.logo);
            res.body.order.should.equal(suprlay.order);
            res.body._id.should.equal(suprlay._id.toString());

          return done();
        });

    });


    it("#GET getSprlay 404",function(done){

        server
        .get(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#GET listSuprLays",function(done){

        server
        .get(pathTest+"/")
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#POST addSuprLay",function(done){

        var dataSuprLay = dataHelper.generateDataSuprLay();

        server
        .post(pathTest+"/")
        .send(dataSuprLay)
        .expect("Content-type",/json/)
        .expect(201) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            res.body.code.should.equal(dataSuprLay.code.toUpperCase());
            res.body.name.should.equal(dataSuprLay.name);
            res.body.logo.should.equal(dataSuprLay.logo);
            res.body.order.should.equal(dataSuprLay.order);
            res.body.should.have.property('_id');

          return done();
        });

    });

    it("#POST addSuprLay 412",function(done){

        var dataSuprLay = dataHelper.generateData412General();

        server
        .post(pathTest+"/")
        .send(dataSuprLay)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

               res.body.should.have.property('message');

          return done();
        });

    });


    it("#PUT uptSprlay 412",function(done){

        var dataSuprLay = dataHelper.generateDataSuprLay412();

        server
        .put(pathTest+"/"+suprlay._id)
        .send(dataSuprLay)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);


           res.body.should.have.property('message');
          return done();
        });

    });

    it("#PUT uptSprlay 404",function(done){

        server
        .get(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });


    it("#PUT uptLay",function(done){

        var dataSuprLay = dataHelper.generateDataSuprLay();

        server
        .put(pathTest+"/"+suprlay._id)
        .send(dataSuprLay)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);


            res.body.code.should.equal(dataSuprLay.code);
            res.body.name.should.equal(dataSuprLay.name);
            res.body.logo.should.equal(dataSuprLay.logo);
            res.body.order.should.equal(dataSuprLay.order);

          return done();
        });

    });

    it("#DELETE delLay",function(done){

        server
        .delete(pathTest+"/"+suprlay._id)
        .expect(204) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            return done();
        });

    });



   // timeout of 2000ms exceeded
      it("#DELETE delSprlay  404",function(done){

    server
    .delete(pathTest+"/"+mongoose.Types.ObjectId().toString())
    .expect("Content-type",/json/)
    .expect(404) // This is HTTP response
    .end(function(err, res){

        if (err) return done(err);

          return done();
    });

  } );


});