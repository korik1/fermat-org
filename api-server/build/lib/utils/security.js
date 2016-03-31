/**
 * Functions to validate
 *
 * @author german.mendoza.187@gmail.com <German Mendoza>
 * @author fuelusumar@gmail.com <Luis Fuenmayor>
 * @version 0.1
 *
 **/
var validator = require('validator'),
	sanitizer = require('sanitizer');
// yyyy-MM-dd'T'HH:mm:ss.SSSZ
/**
 * [isValidDate description]
 *
 * @method isValidDate
 *
 * @param  {[type]}    date [description]
 *
 * @return {Boolean}   [description]
 */
var isValidDate = function (date) {
	var is_valid = false,
		regex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
	is_valid = regex.test(date) && date.length >= 20;
	return is_valid;
};
/**
 * [isValidData description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var isValidData = function (data) {
	if (typeof data == 'undefined' || data === null || data === '' || data === "" || data.length === 0) {
		//console.log('invalid data');
		return 0;
	} else return 1;
};
/**
 * [ifExistIsValidData description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var ifExistIsValidData = function (data) {
	if (typeof data == "undefined" || (typeof data != "undefined" && isValidData(data))) {
		return 1;
	} else return 0;
};
/**
 * [isValidTypeComp description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var isValidTypeComp = function (data) {
	if (data === 'android' || data === 'library' || data === 'addon' || data === 'plugin') {
		//console.log('invalid data');
		return 1;
	} else return 0;
};
/**
 * [isValidLifeCicle description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var isValidLifeCicle = function (data) {
	if (data == 'concept' || data === 'development' || data === 'qa' || data === 'production') {
		//console.log('invalid data');
		return 1;
	} else return 0;
};
/**
 * [ifExistIsValidData description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var ifExistIsValidLifeCicle = function (data) {
	if (typeof data == "undefined" || (typeof data != "undefined" && isValidLifeCicle(data))) {
		return 1;
	} else return 0;
};
/**
 * [isValidDifficulty description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var isValidDifficulty = function (data) {
	if (data == parseInt(data, 10) && parseInt(data) >= 0 && parseInt(data) <= 10) {
		return 1;
	} else return 0;
};
/**
 * [ifExistIsValidData description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
var ifExistIsValidDifficulty = function (data) {
	if (typeof data == "undefined" || (typeof data != "undefined" && isValidDifficulty(data))) {
		return 1;
	} else return 0;
};
/**
 * [isObjectID description]
 * @param  {[type]}  str [description]
 * @return {Boolean}     [description]
 */
var isObjectID = function (str) {
	var valid = false;
	if (isValidData(str)) {
		str = str + '';
		if (validator.isAlphanumeric(str)) {
			var len = str.length;
			if (len == 12 || len == 24) {
				valid = /^[0-9a-fA-F]+$/.test(str);
			}
			return valid;
		} else {
			//console.log('invalid objectID');
			return 0;
		}
	} else {
		//console.log('invalid objectID');
		return 0;
	}
};
/**
 * [isEmail description]
 * @param  {[type]}  email [description]
 * @return {Boolean}       [description]
 */
var isEmail = function (email) {
	if (isValidData(email)) {
		if (validator.isLength(email, 8, 64)) {
			if (validator.isEmail(email)) {
				return 1;
			}
		}
	}
	//console.log('invalid email');
	return 0;
};
/**
 * [isLengthPassword description]
 * @param  {[type]}  passwd [description]
 * @return {Boolean}        [description]
 */
var isLengthPassword = function (passwd) {
	if (isValidData(passwd)) {
		if (validator.isLength(passwd, 8, 16)) return 1;
	}
	//console.log('invalid password');
	return 0;
};
var isUsername = function (username) {
	if (isValidData(username)) {
		if (validator.matches(username, /^[a-zA-Z][a-zA-Z0-9\._\-]{3,14}?[a-zA-Z0-9]{0,2}$/)) return 1;
		//return 1;
	}
	//console.log('invalid username');
	return 0;
};
exports.isValidDate = function (date) {
	return isValidDate(date);
};
/**
 * [isAlphanumeric description]
 * @param  {[type]}  str [description]
 * @return {Boolean}     [description]
 */
exports.isAlphanumeric = function (str) {
	if (isValidData(str)) {
		if (validator.isAlphanumeric(str)) {
			return 1;
		} else {
			//console.log('invalid alphanumeric');
			return 0;
		}
	} else {
		//console.log('invalid alphanumeric');
		return 0;
	}
};
/**
 * [sanitizeArray description]
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
exports.sanitizeArray = function (array) {
	for (var key in array) {
		if (key != 'token' && key != 'contacts' && key != 'answers' && key != 'questions') {
			array[key] = sanitizer.sanitize(array[key]);
			array[key] = sanitizer.escape(array[key]);
		} else {
			//TODO: tratar token de ios
			array[key] = array[key];
		}
	}
	return array;
};
/**
 * [sanitizeItem description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
exports.sanitizeItem = function (item) {
	item = sanitizer.sanitize(item);
	item = sanitizer.escape(item);
	return item;
};
/**
 * [apiVersion description]
 * @param  {[type]} api_version [description]
 * @return {[type]}             [description]
 */
exports.apiVersion = function (api_version) {
	if (isValidData(api_version)) {
		if (api_version == "v1") return 1;
	} else {
		//console.log('invalid api_version');
		return 0;
	}
};
/**
 * [isValidData description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.isValidData = function (data) {
	return isValidData(data);
};
/**
 * [ifExistIsValidData description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.ifExistIsValidData = function (data) {
	return ifExistIsValidData(data);
};
/**
 * [ifExistIsValidDifficulty description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.ifExistIsValidDifficulty = function (data) {
	return ifExistIsValidDifficulty(data);
};
/**
 * [ifExistIsValidLifeCicle description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.ifExistIsValidLifeCicle = function (data) {
	return ifExistIsValidLifeCicle(data);
};
/**
 * [isValidTypeComp description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.isValidTypeComp = function (data) {
	return isValidTypeComp(data);
};
/**
 * [isValidLifeCicle description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.isValidLifeCicle = function (data) {
	return isValidLifeCicle(data);
};
/**
 * [isValidDifficulty description]
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
exports.isValidDifficulty = function (data) {
	return isValidDifficulty(data);
};
/**
 * [isEmail description]
 * @param  {[type]}  email [description]
 * @return {Boolean}       [description]
 */
exports.isEmail = function (email) {
	return isEmail(email);
};
/**
 * [isUsername description]
 * @param  {[type]}  username [description]
 * @return {Boolean}          [description]
 */
exports.isUsername = function (username) {
	return isUsername(username);
};
/**
 * Check if an account is valid
 * @param  {[type]}  username [description]
 * @return {Boolean}          [description]
 */
exports.isValidAccount = function (account) {
	if (isUsername(account) || isEmail(account)) {
		return 1;
	}
	return 0;
};
/**
 * [isLengthPassword description]
 * @param  {[type]}  passwd [description]
 * @return {Boolean}        [description]
 */
exports.isLengthPassword = function (passwd) {
	return isLengthPassword(passwd);
};
/**
 * [isObjectID description]
 * @param  {[type]}  str [description]
 * @return {Boolean}     [description]
 */
exports.isObjectID = function (str) {
	return isObjectID(str);
};
/**
 * [isName description]
 * @param  {[type]}  name [description]
 * @return {Boolean}      [description]
 */
exports.isName = function (name) {
	if (isValidData(name)) {
		if (validator.isLength(name, 2)) return 1;
	}
	//console.log('invalid name');
	return 0;
};
/**
 * [isDescription description]
 * @param  {[type]}  description [description]
 * @return {Boolean}             [description]
 */
exports.isDescription = function (description) {
	if (isValidData(description)) {
		if (validator.isLength(description, 0, 400)) return 1;
	}
	//console.log('invalid description');
	return 0;
};
/**
 * [isLang description]
 * @param  {[type]}  lang [description]
 * @return {Boolean}      [description]
 */
exports.isLang = function (lang) {
	if (isValidData(lang)) {
		if (validator.isLength(lang, 2, 5)) return 1;
		//if (lang.length == 2) return 1;
	}
	console.log('invalid lang');
	return 0;
};
/**
 * NOT TESTED
 */
exports.isChatId = function (chat_id) {
	if (validator.isAlphanumeric(chat_id)) {
		return 1;
	}
	return 0;
};
exports.isIdArray = function (idArray) {
	if (Array.isArray(idArray)) {
		idArray.forEach(function (id) {
			if (!isObjectID(id)) return 0;
		});
		return 1;
	}
	return 0;
};
exports.isUUID = function (uuid) {
	if (validator.isUUID(uuid)) {
		return 1;
	}
	return 0;
};