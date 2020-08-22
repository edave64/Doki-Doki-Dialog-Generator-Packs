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
import * as V2JSON from '@edave64/doki-doki-dialog-generator-pack-format/dist/v2/jsonFormat';
import * as V2Model from '@edave64/doki-doki-dialog-generator-pack-format/dist/v2/model';
import * as V2Parser from '@edave64/doki-doki-dialog-generator-pack-format/dist/v2/parser';
import './polyfill.js';

const set = new Set<string>();

async function main(): Promise<IPack[]> {
	const entry = await getEntry('../packs', (entry) => {
		if (entry.name === '..' || entry.name === '.') return false;
		if (entry.type === 'dir') return true;
		if (extname(entry.name) === '.json') return true;
		return false;
	});
	const files = listOfFiles(entry as Directory);
	const jsons = await Promise.all(files.map((path) => fetchJSON(path)));

	const dedup: { [id: string]: IPack } = {};

	return jsons.filter(json => {
		if (json === null) return false;
		if (dedup[json.id]) {
			const existing = dedup[json.id];
			if (!existing.dddg1Path) existing.dddg1Path = json.dddg1Path;
			if (!existing.dddg2Path || existing.dddg2Path == existing.dddg1Path) existing.dddg2Path = json.dddg2Path;
			if (!existing.ddcc2Path) existing.ddcc2Path = json.ddcc2Path;
			if (!existing.searchWords) existing.searchWords = json.searchWords;
			
			if (JSON.stringify(existing.authors) !== JSON.stringify(json.authors)) {
				throw new Error(`${json.id}: Author mismatch`);
			}
			if (JSON.stringify(existing.characters) !== JSON.stringify(json.characters)) {
				throw new Error(`${json.id}: Character mismatch`);
			}
			if (existing.description !== json.description) {
				throw new Error(`${json.id}: Description mismatch`);
			}
			if (existing.disclaimer !== json.disclaimer) {
				throw new Error(`${json.id}: Disclaimer mismatch`);
			}
			if (existing.name !== json.name) {
				throw new Error(`${json.id}: Name mismatch`);
			}
			if (existing.source !== json.source) {
				throw new Error(`${json.id}: Source mismatch`);
			}
			return false;
		}
		dedup[json.id] = json;
 		return true;
	}) as IPack[];
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
		return parseV2(path, json);
	}

	return parseV1(path, json);
}

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
	const packPath =
		'https://edave64.github.io/Doki-Doki-Dialog-Generator-Packs/packs/';
	const dddgPath = path.replace('../packs/', packPath);
	const parsedPack = V2Parser.normalizeContentPack(pack, {
		'/': 'https://edave64.github.io/Doki-Doki-Dialog-Generator/release/assets/',
		'./': dirname(dddgPath) + '/',
	});

	const previewExists = await fileExists(join(dirname(path), 'preview.png'));

	const chars = new Set<string>();
	const types = new Set<PackKind>();
	let preview = [] as string[];

	if (previewExists) {
		preview = [dirname(dddgPath) + '/' + 'preview.png'];
	}

	for (const char of parsedPack.characters) {
		const [cName, cTypes, cPreview] = v2CharInfo(char);
		chars.add(cName);
		for (const type of cTypes) types.add(type);
		if (!previewExists && cPreview.length > preview.length) {
			preview = cPreview;
		}
	}

	if (parsedPack.backgrounds.length > 0) {
		types.add('Backgrounds');
		if (!previewExists) {
			console.error(`Background stuff ${preview.length} ${path}`);
			for (const background of parsedPack.backgrounds) {
				for (const variant of background.variants) {
					console.error(`Toast ${variant.length} -> ${variant.length > preview.length}`);
					if (variant.length > preview.length) {
						preview = variant;
					}
				}
			}
		}
	} 

	if (parsedPack.sprites.length > 0) {
		types.add('Sprites');
		if (!previewExists) {
			console.error(`Sprite stuff ${preview.length} ${path}`);
			for (const sprite of parsedPack.sprites) {
				for (const variant of sprite.variants) {
					console.error(`Toast ${variant.length} -> ${variant.length > preview.length}`);
					if (variant.length > preview.length) {
						preview = variant;
					}
				}
			}
		}
	}

	return {
		id: pack.packId,
		name: pack.packName || pack.packId,
		characters: Array.from(chars).sort(),
		authors: pack.authors,
		ddcc2Path: pack.comicClubUrl,
		kind: Array.from(types).sort(),
		source: pack.source,
		dddg2Path: dddgPath,
		disclaimer: pack.disclaimer,
		description: formatDescription(pack.packCredits as unknown as string),
		preview,
		searchWords: [],
	};
}

function v2CharInfo (char: V2Model.Character<string>): [string, PackKind[], string[]] {
	let kinds: Set<PackKind> = new Set();
	let preview: string[] = [];
	if (char.chibi && char.label) {
		kinds.add('Characters');
	} else {
		const isRemote = (x: {id: string}) => x.id.indexOf(':') >= 0;
		if (char.styleGroups) {
			if (!char.styleGroups.find(isRemote)) {
				kinds.add('Styles');
			}
			for (const stlyeGroup of char.styleGroups) {
				if (isRemote(stlyeGroup)) {
					kinds.add('Poses');
				}
				const sgPreview = styleGroupPreview(char, stlyeGroup);
				if (sgPreview.length > preview.length) {
					preview = sgPreview;
				}
			}
		}
		if (char.heads) {
			const keys = Object.keys(char.heads).filter(headKey => headKey.indexOf(':') >= 0);
			if (keys.length > 0) {
				kinds.add('Expressions');
				const headGroup = char.heads[keys[0]];
				if (headGroup) {
					if (preview.length < headGroup.variants[0].length) {
						preview = headGroup.variants[0];
					}
				}
			}
		}
	}
	const charName = char.label || V2CharMap.get(char.id) || '';
	if (!charName) {
		throw new Error(
			`Pack contains character with unrecognized name '${char.id}'`
		);
	}

	return [charName, Array.from(kinds), preview];
}

function styleGroupPreview(char: V2Model.Character<string>, styleGroup: V2Model.StyleGroup<string>): string[] {
	const style = styleGroup.styles[0];
	if (!style) return [];
	const packHeads = new Set(Object.keys(char.heads || {}));
	const preferedPose =
		style.poses.length > 0
			? style.poses.reduce((acc, val) => {
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
					acc.renderCommands
					// Prefer poses without head anchors
					if (hasAnchors(acc.renderCommands) && !hasAnchors(val.renderCommands)) {
						return val;
					}
					return acc;
			  })
			: undefined;

	if (preferedPose) {
		const compatibleHeads = preferedPose.compatibleHeads.find((heads) =>
			packHeads.has(heads as string)
		);
		const images: string[] = [];
		for (const command of preferedPose.renderCommands) {
			if (command.type === 'head') {
				if (compatibleHeads) {
					const headImage = char.heads[compatibleHeads];
					images.push(...headImage.variants[0]);
				}
			} else if (command.type === 'image') {
				images.push(...command.images);
			} else if (command.type === 'pose-part') {
				images.push(...preferedPose.positions[command.part][0]);
			}
		}
		return images;
	}
	return [];
}

function hasAnchors<T>(renderCommands: V2Model.PoseRenderCommand<T>[]): boolean {
	return !renderCommands.find(command => command.offset[0] === 0 && command.offset[1] === 0);
}

const V1CharMap = new Map([
	['ddlc.monika', 'Monika'],
	['ddlc.fan.mc2', 'MC'],
	['ddlc.natsuki', 'Natsuki'],
	['ddlc.sayori', 'Sayori'],
	['ddlc.yuri', 'Yuri'],
	['ddlc.fan.femc', 'FeMC'],
]);

const V2CharMap = new Map([
	['mio.yagamirai10.edave64:ddlc.oc.mio', 'Mio'],
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

main()
	.then(x => console.log(JSON.stringify(x, null, '\t')))
	.catch(err => console.error(err));
