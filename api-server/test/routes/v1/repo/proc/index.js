var supertest = require("supertest");
var should = require("should");
var mongoose = require("mongoose");
var server = supertest.agent("http://localhost:8081");
var procMod = require("../../../../../modules/repository/process");
var compMod = require("../../../../../modules/repository/component");
//var auth = require("../../../herlpers/v1/auth")
var dataHelper = require("../../../../helpers/v1/dataHelper");
var pathTest = "/v1/repo/usrs/1/procs"

mongoose.connect('mongodb://localhost/fermat-org-dev');

describe("PROC",function(){

  var proc;
  var stepIds = [];


  beforeEach(function(done){
    //add some test data
    var dataProc = dataHelper.generateDataProc();
    stepIds = [];

    procMod.insOrUpdProc(dataProc.platfrm, dataProc.name, dataProc.desc, dataProc.prev, dataProc.next, function(err_proc, res_proc){

        if (err_proc) return console.log(err_proc);

        var dataComp = dataHelper.generateDataComp();

        compMod.insOrUpdComp(dataComp.platfrm_id, dataComp.suprlay_id, dataComp.layer_id, dataComp.name, dataComp.type, dataComp.description, dataComp.difficulty, dataComp.code_level, dataComp.repo_dir, dataComp.scrnshts, dataComp.found, function(err_comp, res_comp){

            proc = res_proc;

            var loopStep=function(i){
                if(i<2){

                    var dataStep = dataHelper.generateDataStep();
                    procMod.insertStep(proc._id, res_comp._id, dataStep.type, dataStep.title, dataStep.desc, dataStep.order, function(err_step, res_step){

                        if (err_step) return console.log(err_step);
                        stepIds.push(res_step._id);
                        i = i+1;
                        loopStep(i);
                    });

                } else {

                    done();

                }
            }
            loopStep(0);

        });

    });

  });

    it("#GET getProc",function(done){

        server
        .get(pathTest+"/"+proc._id)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.platfrm.should.equal(proc.platfrm);
            res.body.name.should.equal(proc.name);
            res.body.desc.should.equal(proc.desc);
            res.body.prev.should.equal(proc.prev);
            res.body.next.should.equal(proc.next);
            res.body._id.should.equal(proc._id.toString());

          return done();
        });

    });

      it("#GET getProc 404" ,function(done){

         var dataProce = dataHelper.generateData412General();

        server
        .post(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .send(dataProce)
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);
          return done();
        });
    } );





    it("#GET listProcs",function(done){
        this.timeout(10000);
        server
        .get(pathTest+"/")
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });

    it("#POST addProc",function(done){

        var dataProc = dataHelper.generateDataProc();

        server
        .post(pathTest+"/")
        .send(dataProc)
        .expect("Content-type",/json/)
        .expect(201) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            res.body.platfrm.should.equal(dataProc.platfrm.toUpperCase());
            res.body.name.should.equal(dataProc.name);
            res.body.desc.should.equal(dataProc.desc);
            res.body.prev.should.equal(dataProc.prev);
            res.body.next.should.equal(dataProc.next);
            res.body.should.have.property('_id');

          return done();
        });

    });

       it("#POST addProc 412",function(done){

        var dataProc = dataHelper.generateData412General();

        server
        .post(pathTest+"/")
        .send(dataProc)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            res.body.should.have.property('message');

          return done();
        });

    });

    it("#PUT uptProc",function(done){

        var dataProc = dataHelper.generateDataProc();

        server
        .put(pathTest+"/"+proc._id)
        .send(dataProc)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body.platfrm.should.equal(dataProc.platfrm);
            res.body.name.should.equal(dataProc.name);
            res.body.desc.should.equal(dataProc.desc);
            res.body.prev.should.equal(dataProc.prev);
            res.body.next.should.equal(dataProc.next);

          return done();
        });

    });

    it("#PUT uptProc 404" ,function(done){

        var dataProc = dataHelper.generateDataProc();

        server
        .put(pathTest+"/"+mongoose.Types.ObjectId().toString())
        .send(dataProc)
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    } );

    it("#PUT uptProc 412",function(done){

        var dataProc = dataHelper.generateDataProc412();

        server
        .put(pathTest+"/"+proc._id)
        .send(dataProc)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);
            res.body.should.have.property('message');

          return done();
        });

    });

    it("#DELETE delProc",function(done){

        server
        .delete(pathTest+"/"+proc._id)
        .expect(204) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);

            return done();
        });

    });


  it("#DELETE delProc  404",function(done){

    server
    .delete(pathTest+"/"+mongoose.Types.ObjectId().toString())
    .expect(404) // This is HTTP response
    .end(function(err, res){

        if (err) return done(err);

          return done();
    });

  });



  it("#POST addStep",function(done){

    var dataStep = dataHelper.generateDataStep();

    server
    .post(pathTest+"/"+proc._id+"/steps")
    .send(dataStep)
    .expect("Content-type",/json/)
    .expect(201) // This is HTTP response
    .end(function(err,res){

        if (err) return done(err);

        res.body._proc_id.should.equal(proc._id.toString());
        res.body._comp_id.should.equal(dataStep.comp_id);
        res.body.type.should.equal(dataStep.type.toLowerCase());
        res.body.title.should.equal(dataStep.title);
        res.body.desc.should.equal(dataStep.desc);
        res.body.order.should.equal(dataStep.order);
        res.body.should.have.property('_id');

        return done();
    });

    });

    it("#POST addStep 404",function(done){

        var dataStep = dataHelper.generateDataStep();

        server

        .post(pathTest+"/"+mongoose.Types.ObjectId().toString()+"/steps")
        .send(dataStep)
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

          return done();
        });

    });


    it("#POST addStep 412",function(done){

        var dataStep = dataHelper.generateData412General();

        server
        .post(pathTest+"/"+proc._id+"/steps")
        .send(dataStep)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err,res){

          if (err) return done(err);

            res.body.should.have.property('message');
          return done();
        });

    });

    it("#PUT uptStep",function(done){

        var dataStep = dataHelper.generateDataStep();

        server
        .put(pathTest+"/"+proc._id+"/steps/"+stepIds[0])
        .send(dataStep)
        .expect("Content-type",/json/)
        .expect(200) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            res.body._comp_id.should.equal(dataStep.comp_id);
            res.body.type.should.equal(dataStep.type);
            res.body.title.should.equal(dataStep.title);
            res.body.desc.should.equal(dataStep.desc);
            res.body.order.should.equal(dataStep.order);
            res.status.should.equal(200);

          return done();
        });

    });

    it("#PUT uptStep 404",function(done){
        var dataStep = dataHelper.generateDataStep();

        server
        .put(pathTest+"/"+mongoose.Types.ObjectId()+"/steps/"+mongoose.Types.ObjectId())
        .send(dataStep)
        .expect("Content-type",/json/)
        .expect(404) // This is HTTP response
        .end(function(err, res){
            if (err) return done(err);
          return done();
        });
    } );

    it("#PUT uptStep 412",function(done){

        var dataStep = dataHelper.generateDataStep412();

        server
        .put(pathTest+"/"+proc._id+"/steps/"+stepIds[0])
        .send(dataStep)
        .expect("Content-type",/json/)
        .expect(412) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

               res.body.should.have.property('message');

          return done();
        });

    });

    it("#DELETE delStep",function(done){

        server
        .delete(pathTest+"/"+proc._id+"/steps/"+stepIds[0])
        .expect(204) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

            return done();
        });

    });

    it("#DELETE delStep  404",function(done){

        server
        .delete(pathTest+"/"+mongoose.Types.ObjectId().toString()+"/comp-devs/"+mongoose.Types.ObjectId().toString())
        .expect(404) // This is HTTP response
        .end(function(err, res){

            if (err) return done(err);

              return done();
        });

    });

});