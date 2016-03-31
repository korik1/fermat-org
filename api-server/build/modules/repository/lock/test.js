/*var winston = require('winston');
var mongoose = require('mongoose');
var lockMod = require('./index');
var objid = new mongoose.Types.ObjectId();
var dateLib = require('./libs/date');
var timestamp = objid.getTimestamp();
var date = new Date(timestamp);
console.dir(objid);
console.dir(timestamp);
console.dir(date);*/
//console.dir(dateLib.getObjIdToMilis(objid));
/*	
Update | Delete | New Field | Duplicate | Refresh | Text | Expand
{
   "_id": ObjectId("569e9409052e7aa37a08afe7"),
   "_usr_id": ObjectId("569e9409052e7aa37a08afe4"),
   "_item_id": ObjectId("569e9409052e7aa37a08afe5"),
   "item_type": "component",
   "upd_at": ObjectId("569e9409052e7aa37a08afe6"),
   "priority": NumberInt(9),
   "__v": NumberInt(0) 
}
TOP
#3	
Update | Delete | New Field | Duplicate | Refresh | Text | Expand
{
   "_id": ObjectId("569e9407052e7aa37a08afe2"),
   "_usr_id": ObjectId("569e9407052e7aa37a08afdf"),
   "_item_id": ObjectId("569e9407052e7aa37a08afe0"),
   "item_type": "superlayer",
   "upd_at": ObjectId("569e9407052e7aa37a08afe1"),
   "priority": NumberInt(1),
   "__v": NumberInt(0) 
}
TOP
#2	
Update | Delete | New Field | Duplicate | Refresh | Text | Expand
{
   "_id": ObjectId("569e9405052e7aa37a08afdd"),
   "_usr_id": ObjectId("569e9405052e7aa37a08afda"),
   "_item_id": ObjectId("569e9405052e7aa37a08afdb"),
   "item_type": "platform",
   "upd_at": ObjectId("569e9405052e7aa37a08afdc"),
   "priority": NumberInt(2),
   "__v": NumberInt(0) 
}
TOP
#1	
Update | Delete | New Field | Duplicate | Refresh | Text | Expand
{
   "_id": ObjectId("569e9403052e7aa37a08afd8"),
   "_usr_id": ObjectId("569e9403052e7aa37a08afd5"),
   "_item_id": ObjectId("569e9403052e7aa37a08afd6"),
   "item_type": "layer",
   "upd_at": ObjectId("569e9403052e7aa37a08afd7"),
   "priority": NumberInt(3),
   "__v": NumberInt(0) 
}
*/
/*var _INTERVAL = 2000;
var loop = 0;
winston.log('info', 'Update interval on every %s minutes', (_INTERVAL / 1000) / 60);
setInterval(function () {
	var mod = loop % 6;
	loop++;
	switch (mod) {
	case 0:
		winston.log('info', 'Starting database connexion');
		var db = require('../../../db');
		break;
	case 1:
		winston.log('info', 'Inserting lock');
		lockMod.insOrUpdLock(new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId("569e9403052e7aa37a08afd6"), 'layer', 3, function (err_ins, res_ins) {
			if (err_ins) {
				winston.log('error', err_ins.message, err_ins);
			} else {
				console.dir(res_ins);
			}
		});
		break;
	case 2:
		winston.log('info', 'Inserting lock');
		lockMod.insOrUpdLock(new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId("569e9405052e7aa37a08afdb"), 'platform', 2, function (err_ins, res_ins) {
			if (err_ins) {
				winston.log('error', err_ins.message, err_ins);
			} else {
				console.dir(res_ins);
			}
		});
		break;
	case 3:
		winston.log('info', 'Inserting lock');
		lockMod.insOrUpdLock(new mongoose.Types.ObjectId("569e9409052e7aa37a08afe4"), new mongoose.Types.ObjectId("569e9407052e7aa37a08afe0"), 'superlayer', 1, function (err_ins, res_ins) {
			if (err_ins) {
				winston.log('error', err_ins.message, err_ins);
			} else {
				console.dir(res_ins);
			}
		});
		break;
	case 4:
		winston.log('info', 'Inserting lock');
		lockMod.insOrUpdLock(new mongoose.Types.ObjectId("569e9409052e7aa37a08afe4"), new mongoose.Types.ObjectId("569e9409052e7aa37a08afe5"), 'component', 0, function (err_ins, res_ins) {
			if (err_ins) {
				winston.log('error', err_ins.message, err_ins);
			} else {
				console.dir(res_ins);
			}
		});
		break;
	case 5:
		winston.log('info', 'Killing process');
		process.exit(1);
		break;
	}
}, _INTERVAL);*/
var text = "If compareFunction returns leave a and b unchanged with respect to each other";
var array_of_chars = text.split(' ').join('').toLowerCase().split('');
var count_array = [];
var indexOf = function (array, element) {
	for (var i = array.length - 1; i >= 0; i--) {
		if (element.key == array[i].key) return i;
	}
	return -1;
};
for (var i = 0; i < array_of_chars.length; i++) {
	var ch = {
		key: array_of_chars[i],
		value: 1
	};
	var index = indexOf(count_array, ch);
	if (index > -1) {
		count_array[index].value = count_array[index].value + 1;
	} else {
		count_array.push(ch);
	}
}
count_array.sort(function (a, b) {
	if (a.value > b.value) {
		return 1;
	}
	if (a.value < b.value) {
		return -1;
	}
	// a must be equal to b
	return 0;
});
console.dir(count_array.pop());
// unshift() prepend one or more elements to the beginning of an array
// shift() pulls the first element off of the given array and returns it
// push() append one or more elements to the end of an array
// pop() pulls the last element off of the given array and returns it
// 
var fib = function (n) {
	var prev = 1;
	var res = 1;
	if (n > 2) {
		for (var i = 2; i < n; i++) {
			var temp = res;
			res = prev + res;
			prev = temp;
		}
	}
	return res;
};
console.dir(fib(7));

function r(n) {
	if (n <= 1) {
		return n;
	} else {
		return r(n - 1) + r(n - 2);
	}
}
console.dir(r(1000));