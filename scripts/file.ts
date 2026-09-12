import fs from 'fs/promises';

export async function isDir(path: string): Promise<boolean> {
	try {
		const stat = await fs.stat(path);
		return stat.isDirectory();
	} catch (e) {
		return false;
	}
}

export async function isFile(path: string): Promise<boolean> {
	try {
		const stat = await fs.stat(path);
		return stat.isFile();
	} catch (e) {
		return false;
	}
}

export async function mkdirp(dir: string) {
	if (await isDir(dir)) return;
	await fs.mkdir(dir, { recursive: true });
}
