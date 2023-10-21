import { dirname, join } from 'path';
import fsp from 'fs/promises';
import './polyfill.js';
import FastGlob from 'fast-glob';
import { deepStrictEqual } from 'assert';
import stringify from 'json-stable-stringify';

const fsOpts = { encoding: 'utf-8' as BufferEncoding };

const repoIds = new Set<string>();
const repoIndex: { [packId: string]: any } = [];
const authorIndex: { [name: string]: any } = {};
const baseRepoURL =
	'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/';
const repoTargetPath = '../repo.json';
const authorsTargetPath = '../people.json';

async function main(): Promise<void> {
	const repoEntries = await FastGlob('../packs/**/repo.json');
	repoEntries.sort();
	for (const repoEntry of repoEntries) {
		const dir = dirname(repoEntry);
		const dirRel = dir.substring(3);
		const dirUrl = baseRepoURL + dirRel.replaceAll('\\', '/') + '/';
		const { pack, authors } = JSON.parse(await fsp.readFile(repoEntry, fsOpts));
		if (repoIds.has(pack.id)) {
			throw new Error(
				`There are more than one pack with the ID '${pack.id}". Pack IDs must be globally unique.`
			);
		}
		repoIds.add(pack.id);

		if (pack.dddg1Path) {
			pack.dddg1Path = dirUrl + pack.dddg1Path;
		}
		pack.dddg2Path = dirUrl + (pack.dddg2Path || 'index.json');
		if (pack.preview) {
			pack.preview = pack.preview.map((x: string) => dirUrl + x);
		}

		repoIndex.push(pack);
		for (const key in authors) {
			if (!Object.prototype.hasOwnProperty.call(authors, key)) continue;
			if (authorIndex[key]) {
				deepStrictEqual(
					authorIndex[key],
					authors[key],
					`The author '${key}' has different descriptions in different repo files.`
				);
			} else {
				authorIndex[key] = authors[key];
			}
		}
	}
	await Promise.all([
		fsp.writeFile(
			repoTargetPath,
			stringify(repoIndex, undefined, '\t'),
			fsOpts
		),
		fsp.writeFile(
			authorsTargetPath,
			stringify(authorIndex, undefined, '\t'),
			fsOpts
		),
	]);
}

(async function () {
	try {
		await main();
	} catch (e) {
		console.error(e);
	}
})();
