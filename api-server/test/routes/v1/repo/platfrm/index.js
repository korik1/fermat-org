var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");
var server = supertest.agent("http://localhost:8081");
var platfMod = require("../../../../../modules/repository/platform");
var compMod = require("../../../../../modules/repository/component");
//var auth = require("../../../herlpers/v1/auth")
var dataHelper = require("../../../../helpers/v1/dataHelper");
var pathTest = "/v1/repo/usrs/1/platfrms"

mongoose.connect('mongodb://localhost/fermat-org-dev');

describe("PLATFRM",function(){

    var platform;

    beforeEach(function(done){
        //add some test data
        var dataPlatform = dataHelper.generateDataPlatform();

        platfMod.insOrUpdPlatfrm(dataPlatform.code, dataPlatform.name, dataPlatform.logo, null, dataPlatform.order, function(err_platform, res_platform){
            if (err_platform) return console.log(err_platform);

            platform = res_platform;

            var dataComp = dataHelper.generateDataComp();
            var loopComp = function(i){
                if (i<3) {
                    compMod.insOrUpdComp(res_platform._id, dataComp.suprlay_id, dataComp.layer_id, dataComp.name, dataComp.type, dataComp.description, dataComp.difficulty, dataComp.code_level, dataComp.repo_dir, dataComp.scrnshts, dataComp.found, function(err_comp, res_comp){

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

    it("#GET getPltf",function(done){

        server
        .get(pathTest+"/"+platform._id)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.code.should.equal(platform.code);
            res.body.name.should.equal(platform.name);
            res.body.logo.should.equal(platform.logo);
            res.body.order.should.equal(platform.order);
            res.body._id.should.equal(platform._id.toString());

          return done();
        });

    });

        it("#GET getPltf 404",function(done){

        server
        .get(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#GET listPlatforms",function(done){

        server
        .get(pathTest+"/")
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#POST addPlatform",function(done){

        var dataPlatform = dataHelper.generateDataPlatform();

        server
        .post(pathTest+"/")
        .send(dataPlatform)
        .expect("Content-type",/json/)
        .expect(201) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            res.body.code.should.equal(dataPlatform.code.toUpperCase());
            res.body.name.should.equal(dataPlatform.name);
            res.body.logo.should.equal(dataPlatform.logo);
            res.body.order.should.equal(dataPlatform.order);
            res.body.should.have.property('_id');

          return done();
        });

    });


    it("#POST addPlatform 412",function(done){

        var dataPlatform = dataHelper.generateData412General();

        server
        .post(pathTest+"/")
        .send(dataPlatform)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            res.body.should.have.property('message');

          return done();
        });

    });

    it("#PUT uptPltf",function(done){

         var dataPlatform = dataHelper.generateDataPlatform();

        server
        .put(pathTest+"/"+platform._id)
        .send(dataPlatform)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.code.should.equal(dataPlatform.code);
            res.body.name.should.equal(dataPlatform.name);
            res.body.logo.should.equal(dataPlatform.logo);
            res.body.order.should.equal(dataPlatform.order);

          return done();
        });

    });

    it("#PUT uptPltf 412",function(done){

         var dataPlatform = dataHelper.generateDataPlatform412();

        server
        .put(pathTest+"/"+platform._id)
        .send(dataPlatform)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.should.have.property('message');

          return done();
        });

    });

    it("#PUT uptPltf 404",function(done){

        server
        .get(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    /*it("#PUT uptPltf 412",function(done){

         var dataPlatform = dataHelper.generateData412General();

        server
        .put(pathTest+"/"+platform._id)
        .send(dataPlatform)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){

                if (err) return done(err);

            res.body.should.have.property('message');

          return done();
        });

    });*/

    it("#DELETE delPltf",function(done){

        server
        .delete(pathTest+"/"+platform._id)
        .expect(204) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            return done();
        });

    });

     it("#DELETE delPltf 404",function(done){

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