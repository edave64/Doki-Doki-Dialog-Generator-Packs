import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export async function isDir(path: string): Promise<boolean> {
	try {
		const stat = await promisify(fs.stat)(path);
		return stat.isDirectory();
	} catch (e) {
		return false;
	}
}

export async function isFile(path: string): Promise<boolean> {
	try {
		const stat = await promisify(fs.stat)(path);
		return stat.isFile();
	} catch (e) {
		return false;
	}
}

export async function mkdirp(dir: string) {
	if (await exports.isDir(dir)) return;
	await exports.mkdirp(path.dirname(dir));
	await promisify(fs.mkdir)(dir);
}
