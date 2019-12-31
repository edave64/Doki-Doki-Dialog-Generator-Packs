const readline = require('readline');
const fs = require('fs');
const { promisify } = require('util');
const { isDir, isFile, mkdirp } = require('./file');

/** @type {readline.Interface} */
const line = new readline.Interface({
	input: process.stdin,
	output: process.stdout,
});

exports.line = line;

/**
 * @async
 * @param {string} question
 * @param {string} defaultValue
 * @param {Function} validate
 * @returns {Promise<string>}
 */
exports.ask = async function(question, defaultValue = '', validate) {
	return new Promise((resolve, reject) => {
		line.question(
			`${question}${defaultValue ? ` (${defaultValue})` : ''}: `,
			async str => {
				str = str || defaultValue;
				if (validate) {
					const ret = await validate(str);
					if (ret === false)
						str = await exports.ask(question, defaultValue, validate);
					if (ret !== true && ret !== undefined) str = ret;
				}
				resolve(str);
			}
		);
	});
};

/**
 * @async
 * @param {string} question
 * @param {boolean} defaultValue
 * @returns {Promise<string>}
 */
exports.askBool = async function(question, defaultValue) {
	const ret = await exports.ask(
		question,
		defaultValue ? 'yes' : 'no',
		answer => {
			answer = answer.toLowerCase();
			if ('yes'.startsWith(answer)) return 'yes';
			if ('no'.startsWith(answer)) return 'no';
			console.log('Please answer either yes or no.');
			return false;
		}
	);
	return ret === 'yes';
};

/**
 * @param {string} question
 * @param {string} defaultValue
 * @param {boolean} needWrite
 * @param {Function} validate
 * @returns {Promise<string>}
 */
exports.askFolder = async function askFolder(
	question,
	defaultValue,
	needWrite,
	validate
) {
	while (true) {
		const dir = await exports.ask(question, defaultValue);

		if (['exit', 'stop', 'end', 'quit'].includes(dir.toLowerCase())) {
			process.exit();
		}
		if (!(await isDir(dir))) {
			if (await promisify(fs.exists)(dir)) {
				console.error(`'${dir}' is not a directory.`);
				continue;
			}
			if (
				await exports.askBool(
					`The directory '${dir}' does not exist. Do you want to create it?`
				)
			) {
				try {
					mkdirp(dir);
					if (!isDir(dir)) {
						console.error(`Could not create directory '${dir}'.`);
						continue;
					}
				} catch (e) {
					console.error(`Could not create directory '${dir}'.`);
					continue;
				}
			} else {
				continue;
			}
		}

		if (needWrite) {
			try {
				promisify(fs.access)(dir, fs.constants.W_OK);
			} catch (e) {
				console.error(`Could not write to directory '${dir}'.`);
				continue;
			}
		}

		if (validate) {
			const ret = await validate(dir);
			if (ret === false) continue;
			if (ret !== true && ret !== undefined) return ret;
		}

		return dir;
	}
};
