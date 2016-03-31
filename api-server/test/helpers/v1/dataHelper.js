var faker = require('faker');
var mongoose = require("mongoose");

exports.generateDataComp = function(){

    return {
        "platfrm_id" : mongoose.Types.ObjectId().toString(),
        "suprlay_id" :  mongoose.Types.ObjectId().toString(),
        "layer_id" :  mongoose.Types.ObjectId().toString(),
        "name" : faker.name.firstName(),
        "type" : "addon",
        "description": faker.lorem.sentence(),
        "difficulty": 5,
        "code_level": "qa",
        "repo_dir": "root",
        "scrnshts": false,
        "found": false
    };

};

exports.generateDataComp412 = function(){

    return {
        "platfrm_id" : mongoose.Types.ObjectId().toString(),
        "suprlay_id" :  mongoose.Types.ObjectId().toString(),
        "layer_id" :  mongoose.Types.ObjectId().toString(),
        "name" : faker.name.firstName(),
        "type" : "addon",
        "description": faker.lorem.sentence(),
        "difficulty": -1,
        "code_level": faker.lorem.sentence(),
        "repo_dir": "root",
       "scrnshts": false


    };

};


exports.generateData412General= function(){

    return {
        "default_data" : mongoose.Types.ObjectId().toString()
    };

};

exports.generateDataCompDev = function(){
    return {
        "comp_id" : mongoose.Types.ObjectId().toString(),
        "dev_id" :  mongoose.Types.ObjectId().toString(),
        "role" : faker.name.firstName(),
        "scope": faker.name.firstName(),
        "percnt": 50
    };

};

exports.generateDataCompDev412 = function(){
    return {
        "comp_id" : mongoose.Types.ObjectId().toString(),
        "dev_id" :  mongoose.Types.ObjectId().toString(),
        "role" : faker.name.firstName(),
        "scope": faker.name.firstName(),
        "percnt": null
    };
}

exports.generateDataLifeCicle = function(){
    return {
        "target": Date(),
        "reached": Date()
    };
};

exports.generateDataStep = function(){

    return {
        "proc_id" : mongoose.Types.ObjectId().toString(),
        "comp_id" : mongoose.Types.ObjectId().toString(),
        "type": faker.lorem.sentence(),
        "title": faker.lorem.sentence(),
        "desc": faker.lorem.sentence(),
        "order": 0
    };
};

exports.generateDataStep412 = function(){

    return {
        "proc_id" : mongoose.Types.ObjectId().toString(),
        "comp_id" : mongoose.Types.ObjectId().toString(),
        "type": null,
        "title": faker.lorem.sentence(),
        "desc": faker.lorem.sentence(),
        "order": 0
    };
};

exports.generateDataProc = function(){
    return {
        "platfrm" : faker.name.firstName(),
        "name" : faker.name.firstName(),
        "desc": faker.lorem.sentence(),
        "prev": faker.lorem.sentence(),
        "next": faker.lorem.sentence()
    };
};

exports.generateDataProc412 = function(){
    return {
        "platfrm" : faker.name.firstName(),
        "name" : null,
        "desc": faker.lorem.sentence(),
        "prev": faker.lorem.sentence(),
        "next": faker.lorem.sentence()
    };
};

exports.generateDataLay = function(){
    return {
        "name" : faker.name.firstName(),
        "lang" : faker.name.firstName(),
        "suprlay": faker.name.firstName(),
        "order": 0
    };
};

exports.generateDataLay412 = function(){
    return {
        "name" : faker.name.firstName(),
        "lang" : faker.name.firstName(),
        "suprlay": null,
        "order": 0
    };
};

exports.generateDataSuprLay = function(){
    return {
        "code" : faker.name.firstName(),
        "name" : faker.name.firstName(),
        "logo": faker.name.firstName(),
        "order": 0
    };
};

exports.generateDataSuprLay412 = function(){
    return {
        "code" : faker.name.firstName(),
        "name" : faker.name.firstName(),
        "logo": null,
        "order": 0
    };
};

exports.generateDataPlatform = function(){
    return {
        "code" : faker.name.firstName(),
        "name" : faker.name.firstName(),
        "logo": faker.name.firstName(),
        "order": 0
    };
};

exports.generateDataPlatform412 = function(){
    return {
        "code" : faker.name.firstName(),
        "name" : faker.name.firstName(),
        "logo": null,
        "order": 0
    };
};