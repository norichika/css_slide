var _ = require('lodash');
var config = require('./config');
var TYPE_REG = /%type%/g;

/**
 * コマンドで指定されたタイプを取得する
 * @param args
 * @returns {*}
 */
function getType(args) {
	var result = _.findLast(args, function(val) {
		return /^-(?!-)+/.test(val);
	});
	if (result) {
		result = result.replace(/^-/, '');
		result += '/';
		return result;
	}
	return '';
}

function buildPath(data) {
	if (typeof data === 'number') return data;
	if (typeof data === 'string') return data.replace(TYPE_REG, getType(process.argv));
	for (var key in data) {
		var value = data[key];
		delete data[key];
		data[buildPath(key)] = buildPath(value);
	}
	return data;
}
var path = buildPath(config);
module.exports = path;