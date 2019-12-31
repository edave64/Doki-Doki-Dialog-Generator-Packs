const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
exports.isDir = async function isDir(path) {
	try {
		const stat = await promisify(fs.stat)(path);
		return stat.isDirectory();
	} catch (e) {
		return false;
	}
};

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
exports.isFile = async function isFile(path) {
	try {
		const stat = await promisify(fs.stat)(path);
		return stat.isFile();
	} catch (e) {
		return false;
	}
};

exports.mkdirp = async function mkdirp(dir) {
	if (await exports.isDir(dir)) return;
	await exports.mkdirp(path.dirname(dir));
	await promisify(fs.mkdir)(dir);
};
