import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);

export async function getEntry(
	baseFolder = '',
	filter: (entry: Entry) => boolean
): Promise<Entry | null> {
	const stat = await lstat(baseFolder);
	const entry: Entry = stat.isDirectory()
		? {
				type: 'dir',
				name: path.basename(baseFolder),
				stat,
				path: baseFolder,
				entries: [] as Array<Entry>,
		  }
		: {
				type: 'file',
				name: path.basename(baseFolder),
				stat,
				path: baseFolder,
		  };
	if (!filter(entry)) return null;
	if (entry.type === 'file') return entry;
	entry.entries = (
		await Promise.all(
			(await readdir(baseFolder)).map((folderEntry) =>
				getEntry(path.join(baseFolder, folderEntry), filter)
			)
		)
	).filter((entry) => entry !== null) as Entry[];
	if (entry.entries.length === 0) return null;
	return entry;
}

export interface Directory {
	type: 'dir';
	name: string;
	path: fs.PathLike;
	stat: fs.Stats;
	entries: Entry[];
}

export interface File {
	type: 'file';
	name: string;
	path: fs.PathLike;
	stat: fs.Stats;
}

export type Entry = Directory | File;
