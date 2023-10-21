import fs from 'fs';
import fsp from 'fs/promises';
import { IPack } from './pack';
import './polyfill.js';
import fastGlob from 'fast-glob';
import { dirname, join } from 'path';
import * as V1JSON from '@edave64/doki-doki-dialog-generator-pack-format/dist/v1/jsonFormat';
import * as V2JSON from '@edave64/doki-doki-dialog-generator-pack-format/dist/v2/jsonFormat';

const fsOpts = { encoding: 'utf-8' } as const;

const oldRepo: IPack[] = (() => {
	try {
		return JSON.parse(fs.readFileSync('../repo.json', fsOpts));
	} catch (e) {
		console.log('No existing repo list!', e);
		return [];
	}
})();

const oldPeople: any = (() => {
	try {
		return JSON.parse(fs.readFileSync('../people.json', fsOpts));
	} catch (e) {
		console.log('No existing repo list!', e);
		return {};
	}
})();

async function main(): Promise<void> {
	const files = await fastGlob('../packs/**/index.json');

	await Promise.all(
		files.map(async (file) => {
			const folder = dirname(file);
			const urlPart = `https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/${folder.substring(
				3
			)}/`;
			const json = JSON.parse(await fsp.readFile(file, fsOpts)) as
				| V1JSON.JSONCharacter<any>
				| V2JSON.JSONContentPack;

			await stripIndexData(json, file);

			const oldRepoData = oldRepo.find((x) => x.id === json.packId)!;
			const authors: any = {};

			function shortenUrl(str: string): string {
				if (str.startsWith(urlPart)) {
					return str.substring(urlPart.length);
				}
				throw new Error('');
			}

			if (oldRepoData.preview) {
				oldRepoData.preview = oldRepoData.preview.map(shortenUrl);
			}
			if (oldRepoData.dddg1Path) {
				oldRepoData.dddg1Path = shortenUrl(oldRepoData.dddg1Path);
			}
			if (oldRepoData.dddg2Path) {
				oldRepoData.dddg2Path = shortenUrl(oldRepoData.dddg2Path);
				if (oldRepoData.dddg2Path === 'index.json') {
					delete oldRepoData.dddg2Path;
				} else {
					const v2File = join(folder, oldRepoData.dddg2Path);
					await stripIndexData(await fsp.readFile(v2File, fsOpts), v2File);
				}
			}

			for (const author of oldRepoData.authors) {
				authors[author] = oldPeople[author];
			}

			fsp.writeFile(
				join(folder, 'repo.json'),
				JSON.stringify({ pack: oldRepoData, authors: authors }, undefined, 4),
				fsOpts
			);
		})
	);

	console.log(files);
}

async function stripIndexData(json: any, fileName: string) {
	delete json.packName;
	delete json.disclaimer;
	delete json.packCredits;
	delete json.authors;
	delete json.source;
	delete json.comicClubUrl;
	delete json.cc2credits;

	await fsp.writeFile(fileName, JSON.stringify(json, undefined, 4));
}

main();
