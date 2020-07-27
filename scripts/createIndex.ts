import { getEntry, Directory, Entry } from './fileScan';
import { extname, dirname, join } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import {
	JSONCharacter,
	JSONHeadCollections,
} from '@edave64/doki-doki-dialog-generator-pack-format/dist/v1/jsonFormat';
import { normalizeCharacter } from '@edave64/doki-doki-dialog-generator-pack-format/dist/v1/parser';
import { IPack, PackKind } from './pack';
import {
	Character,
	HeadCollections,
} from '@edave64/doki-doki-dialog-generator-pack-format/dist/v1/model';
import V2JSON from '@edave64/doki-doki-dialog-generator-pack-format/dist/v2/jsonFormat';
import V2Parser from '@edave64/doki-doki-dialog-generator-pack-format/dist/v2/parser';

const set = new Set<string>();

async function main() {
	const entry = await getEntry('../packs', (entry) => {
		if (entry.name === '..' || entry.name === '.') return false;
		if (entry.type === 'dir') return true;
		if (extname(entry.name) === '.json') return true;
		return false;
	});
	const files = listOfFiles(entry as Directory);
	const jsons = await Promise.all(files.map((path) => fetchJSON(path)));
	console.log(JSON.stringify(jsons.filter(x => x !== null), null, '\t'));
}

function listOfFiles(directory: Directory): string[] {
	return directory.entries.flatMap((entry: Entry) => {
		if (entry.type === 'dir') {
			return listOfFiles(entry);
		} else {
			return entry.path as string;
		}
	});
}

async function fetchJSON(path: string): Promise<IPack | null> {
	const jsonString = await promisify(fs.readFile)(path, { encoding: 'utf8' });
	const json = JSON.parse(jsonString);

	if (json.version === '2.0') {
		return null;
		//return parseV2(path, json);
	}

	return parseV1(path, json);
}
/*
async function parseV2(
	path: string,
	pack: V2JSON.JSONContentPack
): Promise<IPack> {
	if (!pack.packId) {
		throw new Error(`Pack without id cannot be indexed! (${path})`);
	}
	if (!pack.authors) {
		throw new Error(`Pack has no specified authors! (${path})`);
	}
	const charName = pack.name || V1CharMap.get(pack.id);
	if (!charName) {
		throw new Error(
			`Pack contains character with unrecognized name '${pack.id}' (${path})`
		);
	}
	const packPath =
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/';
	const dddgPath = path.replace('../packs/', packPath);
	const parsedPack = V2Parser.normalizeContentPack(pack, {
		'/': 'https://edave64.github.io/Doki-Doki-Dialog-Generator/release/assets/',
		'./': dirname(dddgPath) + '/',
	});

	const previewExists = await fileExists(join(dirname(path), 'preview.png'));

	return {
		id: pack.packId,
		name: pack.packName || pack.packId,
		characters: [charName],
		authors: pack.authors,
		ddcc2Path: pack.comicClubUrl,
		kind: detectV1Kinds(pack),
		source: pack.source,
		dddg1Path: dddgPath,
		dddg2Path: dddgPath,
		disclaimer: pack.disclaimer,
		description: formatDescription(pack.packCredits),
		preview: previewExists
			? [dirname(dddgPath) + '/' + 'preview.png']
			: extractPreview(parsedPack),
		searchWords: extractSearchWords(pack),
	};
}
*/
const V1CharMap = new Map([
	['ddlc.monika', 'Monika'],
	['ddlc.fan.mc2', 'MC'],
	['ddlc.natsuki', 'Natsuki'],
	['ddlc.sayori', 'Sayori'],
	['ddlc.yuri', 'Yuri'],
	['ddlc.fan.femc', 'FeMC'],
]);

async function parseV1(
	path: string,
	pack: JSONCharacter<JSONHeadCollections>
): Promise<IPack> {
	if (!pack.packId) {
		throw new Error(`Pack without id cannot be indexed! (${path})`);
	}
	if (!pack.authors) {
		throw new Error(`Pack has no specified authors! (${path})`);
	}
	const charName = pack.name || V1CharMap.get(pack.id);
	if (!charName) {
		throw new Error(
			`Pack contains character with unrecognized name '${pack.id}' (${path})`
		);
	}
	const packPath =
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/';
	const dddgPath = path.replace('../packs/', packPath);
	const parsedPack = normalizeCharacter(pack, {
		'/': 'https://edave64.github.io/Doki-Doki-Dialog-Generator/release/assets/',
		'./': dirname(dddgPath) + '/',
	});

	const previewExists = await fileExists(join(dirname(path), 'preview.png'));

	return {
		id: pack.packId,
		name: pack.packName || pack.packId,
		characters: [charName],
		authors: pack.authors,
		ddcc2Path: pack.comicClubUrl,
		kind: detectV1Kinds(pack),
		source: pack.source,
		dddg1Path: dddgPath,
		dddg2Path: dddgPath,
		disclaimer: pack.disclaimer,
		description: formatDescription(pack.packCredits),
		preview: previewExists
			? [dirname(dddgPath) + '/' + 'preview.png']
			: extractPreview(parsedPack),
		searchWords: extractSearchWords(pack),
	};
}

function fileExists(path: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			resolve(!err);
		});
	});
}

function extractPreview(pack: Character<HeadCollections>): string[] {
	const packHeads = new Set(Object.keys(pack.heads || {}));
	const preferedPose =
		pack.poses.length > 0
			? pack.poses.reduce((acc, val) => {
					// Prefer poses that also use heads from the pack.
					if (
						packHeads.size > 0 &&
						!acc.compatibleHeads.find((heads) =>
							packHeads.has(heads as string)
						) &&
						val.compatibleHeads.find((heads) => packHeads.has(heads as string))
					) {
						return val;
					}
					// Prefer poses without head anchors
					if (!emptyAnchor(acc.headAnchor) && emptyAnchor(val.headAnchor)) {
						return val;
					}
					return acc;
			  })
			: undefined;

	if (preferedPose) {
		const compatibleHeads = preferedPose.compatibleHeads.find((heads) =>
			packHeads.has(heads as string)
		);
		const poseImages =
			'static' in preferedPose
				? [preferedPose.static]
				: 'variant' in preferedPose
				? [preferedPose.variant[0].img]
				: [preferedPose.left[0].img, preferedPose.right[0].img];
		if (emptyAnchor(preferedPose.headAnchor) && compatibleHeads) {
			const headImage = pack.heads[compatibleHeads];
			if (preferedPose.headInForeground) {
				return [...poseImages, headImage.all[0].img];
			} else {
				return [headImage.all[0].img, ...poseImages];
			}
		} else {
			return poseImages;
		}
	}
	return [pack.heads[Object.keys(pack.heads)[0]].all[0].img];
}

function emptyAnchor(anchor: [number, number]) {
	return anchor[0] === 0 && anchor[1] === 0;
}

function extractSearchWords(
	pack: JSONCharacter<JSONHeadCollections>
): string[] {
	return [];
}

function formatDescription(credits: string | undefined): string {
	return credits ? credits : '';
}

function detectV1Kinds(pack: JSONCharacter<JSONHeadCollections>): PackKind[] {
	if (pack.chibi && pack.name && pack.styles) return ['Characters'];
	if (pack.styles && pack.styles.length > 0) return ['Styles'];
	if (pack.poses && pack.poses.length > 0) return ['Poses'];
	if (pack.heads && Object.keys(pack.heads).length > 0) return ['Expressions'];
	return ['Misc'];
}

main();
