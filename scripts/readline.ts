import readline from 'readline';
import fs from 'fs';
import { promisify } from 'util';
import { isDir, isFile, mkdirp } from './file';

/** @type {readline.Interface} */
const line = readline.createInterface(process.stdin, process.stdout);

exports.line = line;

export async function ask(
	question: string,
	defaultValue: string = '',
	validate?: (
		str: string
	) => boolean | string | undefined | Promise<boolean | string | undefined>
): Promise<string> {
	return new Promise((resolve, reject) => {
		line.question(
			`${question}${defaultValue ? ` (${defaultValue})` : ''}: `,
			async (str) => {
				str = str || defaultValue;
				if (validate) {
					const ret = await validate(str);
					if (ret === false)
						str = await exports.ask(question, defaultValue, validate);
					else if (ret !== true && ret !== undefined) str = ret;
				}
				resolve(str);
			}
		);
	});
}

export async function askBool(
	question: string,
	defaultValue: boolean
): Promise<boolean> {
	const ret = await ask(question, defaultValue ? 'yes' : 'no', (answer) => {
		answer = answer.toLowerCase();
		if ('yes'.startsWith(answer)) return 'yes';
		if ('no'.startsWith(answer)) return 'no';
		console.log('Please answer either yes or no.');
		return false;
	});
	return ret === 'yes';
}

export async function askFolder(
	question: string,
	defaultValue: string,
	needWrite: boolean = false,
	validate?: (
		str: string
	) => boolean | string | undefined | Promise<boolean | string | undefined>
): Promise<string> {
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
}
