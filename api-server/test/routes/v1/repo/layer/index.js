var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");
var server = supertest.agent("http://localhost:8081");
var layMod = require("../../../../../modules/repository/layer");
var compMod = require("../../../../../modules/repository/component");
//var auth = require("../../../herlpers/v1/auth")
var dataHelper = require("../../../../helpers/v1/dataHelper");
var pathTest = "/v1/repo/usrs/1/layers"

mongoose.connect('mongodb://localhost/fermat-org-dev');

describe("LAY",function(){

    var lay;

    beforeEach(function(done){
        //add some test data
        var dataLay = dataHelper.generateDataLay();

        layMod.insOrUpdLayer(dataLay.name, dataLay.lang, dataLay.suprlay, dataLay.order, function(err_lay, res_lay){
            if (err_lay) return console.log(err_lay);
            lay = res_lay;

            var dataComp = dataHelper.generateDataComp();
            var loopComp = function(i){
                if (i<3) {
                    compMod.insOrUpdComp(dataComp.platfrm_id, dataComp.suprlay_id, res_lay._id, dataComp.name, dataComp.type, dataComp.description, dataComp.difficulty, dataComp.code_level, dataComp.repo_dir, dataComp.scrnshts, dataComp.found, function(err_comp, res_comp){

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

    it("#GET getLay",function(done){

        server
        .get(pathTest+"/"+lay._id)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.name.should.equal(lay.name);
            res.body.lang.should.equal(lay.lang);
            res.body.order.should.equal(lay.order);
            res.body.suprlay.should.equal(lay.suprlay);
            res.body._id.should.equal(lay._id.toString());

          return done();
        });

    });

    it("#GET getLay 404",function(done){

        server
        .get(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#GET listLayers",function(done){

        server
        .get(pathTest+"/")
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#POST addLay",function(done){

        var dataLay = dataHelper.generateDataLay();

        server
        .post(pathTest+"/")
        .send(dataLay)
        .expect("Content-type",/json/)
        .expect(201) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            res.body.name.should.equal(dataLay.name.toLowerCase());
            res.body.lang.should.equal(dataLay.lang.toLowerCase());
            res.body.suprlay.should.equal(dataLay.suprlay.toUpperCase());
            res.body.order.should.equal(dataLay.order);
            res.body.should.have.property('_id');

          return done();
        });

    });

    it("#POST addLay 412",function(done){

        var dataLay = dataHelper.generateData412General();

        server
        .post(pathTest+"/")
        .send(dataLay)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

      res.body.should.have.property('message');

          return done();
        });

    });



    it("#PUT uptLay",function(done){

        var dataLay = dataHelper.generateDataLay();

        server
        .put(pathTest+"/"+lay._id)
        .send(dataLay)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);


            res.body.name.should.equal(dataLay.name);
            res.body.lang.should.equal(dataLay.lang);
            res.body.suprlay.should.equal(dataLay.suprlay);
            res.body.order.should.equal(dataLay.order);

          return done();
        });

    });

    it("#GET uptLay 404",function(done){

        server
        .get(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });


    it("#PUT uptLay 412",function(done){

        var dataLay = dataHelper.generateDataLay412();

        server
        .put(pathTest+"/"+lay._id)
        .send(dataLay)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);


             res.body.should.have.property('message');
          return done();
        });

    });

    it("#DELETE delLay",function(done){

        server
        .delete(pathTest+"/"+lay._id)
        .expect(204) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            return done();
        });

    });

    it("#DELETE delLay 404" ,function(done){

        server
        .delete(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });


});