import * as readline from './readline';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { isDir, isFile, mkdirp } from './file';
import escapeStringRegexp from 'escape-string-regexp';
import {
	JSONCharacter,
	JSONHeadCollections,
} from '@edave64/doki-doki-dialog-generator-pack-format/dist/v1/jsonFormat';
import { NsfwAbleImg } from '@edave64/doki-doki-dialog-generator-pack-format/dist/v1/model';

function ccName2dgName(name: string): string {
	return `ddlc.${name}`;
}

function dgName2ccName(name: string): string {
	if (ccCharName[name]) return ccCharName[name];
	const segments = name.split('.');
	return segments[segments.length - 1];
}

function dgPackId2ccPackId(name: string): string {
	return name.replace(/\./g, '__').replace(/[^a-zA-Z0-9_]/gi, '_');
}

async function getAllPacks(basedir: string): Promise<string[]> {
	const contents = await promisify(fs.readdir)(basedir);
	const fullPaths = contents.map((item) => path.join(basedir, item));
	const areDirectory = await Promise.all(fullPaths.map((path) => isDir(path)));
	const dirs = contents.filter((_val, idx) => areDirectory[idx]);

	const hasJSON = await Promise.all(
		dirs.map(async (dir) => {
			return await isFile(path.join(basedir, dir, 'index.json'));
		})
	);

	const packs = dirs.filter((dir, idx) => hasJSON[idx]);
	const recursionSubFolders = dirs.filter((dir, idx) => !hasJSON[idx]);

	for (const subFolder of recursionSubFolders) {
		const subPacks = await getAllPacks(path.join(basedir, subFolder));
		for (const subPack of subPacks) {
			packs.push(subFolder + '/' + subPack);
		}
	}

	return packs;
}

async function isCCDir(outdir: string): Promise<boolean> {
	const contents = await promisify(fs.readdir)(outdir);
	return contents.includes('characters') && contents.includes('custom_assets');
}

function filtering(filter: string, packs: string[]): string[] {
	const regex = new RegExp(
		'^' +
			filter
				.split('*')
				.map((x) => escapeStringRegexp(x))
				.join('.*') +
			'$',
		'i'
	);
	return packs.filter((pack) => pack.match(regex));
}

const headAssoc: { [dddgId: string]: string } = {
	'ddlc.monika.straight': '',
	'ddlc.monika.sideways': '_cpack_compat_leaning',
	'ddlc.yuri.straight': '',
	'ddlc.yuri.sideways': '_alt',
	'ddlc.sayori.straight': '',
	'ddlc.sayori.sideways': '_cpack_compat_leaning',
	'ddlc.natsuki.straight': '_cpack_compat',
	'ddlc.natsuki.straight_nsfw': '_cpack_compat',
	'ddlc.natsuki.sideways': '_cpack_compat',
	'ddlc.natsuki.turned': '_cpack_compat',
	'ddlc.natsuki.turnedAway': '_cpack_compat',
	'ddlc.fan.femc.straight': '',
	'ddlc.fan.femc.straight_hetero': '_alter',
	'ddlc.fan.femc.straight_lh': '_lh',
	'ddlc.fan.femc.straight_hetero_lh': '_lh_alter',
	'ddlc.fan.mc2.straight': '',
	'ddlc.fan.mc2.straight_red': '_alter',
};

const ccCharName: { [dddgId: string]: string } = {
	'ddlc.fan.mc2': 'mc',
};

/** @type Object.<string, Object.<string, string>> */
const clrMatch: { [dddgId: string]: { [styleElementId: string]: string } } = {
	'ddlc.fan.femc': {
		yellow: '../clrdot/y',
		hetero: '../clrdot/b',
	},
	'ddlc.fan.mc2': {
		yellow: '../clrdot/y',
		red: '../clrdot/r',
	},
};

function normalizeStyleName(styleName: string): string {
	if (styleName === 'uniform') {
		return '';
	}
	if (styleName === 'casual') {
		return '_cas';
	}
	return '_' + styleName.replace(/-/g, '__');
}

type CCPose = Array<string | [string, undefined] | [number, number]>;

function unNsfw(val: string | NsfwAbleImg): string {
	if (typeof val === 'string') {
		return val;
	}
	return val.img;
}

function unPng(val: string): string {
	return val.endsWith('.png') ? val.slice(0, -4) : val;
}

function normalizeJoinDddgPath(
	base: string,
	sub: string | undefined,
	paths: { [s: string]: string }
) {
	if (!sub) return base;
	for (var path in paths) {
		if (sub.startsWith(path)) {
			return paths[path] + sub.slice(path.length);
		}
	}
	return base + sub;
}

async function writeCharacterFile(
	characterName: string,
	json: JSONCharacter<JSONHeadCollections>,
	exportCredits: boolean,
	assetFolderName: string
) {
	let out =
		'# This file needs the content pack compatibility files\n' +
		`character="${characterName}"\n`;

	const paths: { [s: string]: string } = {
		'./': `${assetFolderName}/`,
	};

	const charFolder = normalizeJoinDddgPath('', json.folder || '/', paths);

	const subPosesByStyle: { [id: string]: CCPose[] } = {};
	const id = json.id;
	for (const pose of json.poses || []) {
		if (!pose.style) console.log('What?', JSON.stringify(pose));
		if (!subPosesByStyle[normalizeStyleName(pose.style)]) {
			subPosesByStyle[normalizeStyleName(pose.style)] = [];
		}
		const subPoses = subPosesByStyle[normalizeStyleName(pose.style)];
		console.log(JSON.stringify(pose));
		const heads = (pose.compatibleHeads || []).map((head) => {
			const assoc = headAssoc[`${id}.${head}`];
			if (assoc !== undefined) return '_head' + assoc;
			return '_head_' + head;
		});

		const poseFolder = normalizeJoinDddgPath(charFolder, pose.folder, paths);

		const uniqueHeads: CCPose = [];
		for (const head of heads) {
			if (!head) continue;
			if (uniqueHeads.includes(head)) continue;
			uniqueHeads.push(head);
		}

		if (pose.headAnchor) {
			uniqueHeads.unshift(pose.headAnchor);
			if (!pose.headInForeground) {
				uniqueHeads.push([0, 0]);
			}
		}

		const clrDot: [string, undefined][] = [];
		const charClrMatch = clrMatch[id];
		if (charClrMatch) {
			const keys = Object.keys(charClrMatch);

			for (const key of keys) {
				const matcher = new RegExp(`-${key}(-|$)`);
				if (pose.style.match(matcher)) {
					clrDot.push([charClrMatch[key], undefined]);
					break;
				}
			}
		}

		const poses: string[][] = [];
		if ('static' in pose) {
			poses.push([pose.static]);
		}
		if ('variant' in pose) {
			for (const variant of pose.variant) {
				poses.push([unNsfw(variant)]);
			}
		}
		if ('left' in pose) {
			for (const left of pose.left) {
				for (const right of pose.right) {
					poses.push([unNsfw(left), unNsfw(right)]);
				}
			}
		}
		const noExtPoses = poses.map((pose) =>
			pose.map((posePart) => {
				const filename = unPng(posePart);
				return normalizeJoinDddgPath(poseFolder, filename, paths);
			})
		);
		for (const noExtPose of noExtPoses) {
			if (pose.headInForeground) {
				subPoses.push([...clrDot, ...noExtPose, ...uniqueHeads]);
			} else {
				subPoses.push([...clrDot, ...uniqueHeads, ...noExtPose]);
			}
		}
	}

	const outHeads: { [id: string]: string[] } = {};
	const outHeadOffsets: { [id: string]: [number, number] } = {};
	if (json.heads) {
		const headKeys = Object.keys(json.heads);
		for (const headKey of headKeys) {
			const headListEntry = json.heads[headKey];
			const headFolder = normalizeJoinDddgPath(
				charFolder,
				(headListEntry as any).folder,
				paths
			);
			const headList = (
				headListEntry instanceof Array ? headListEntry : headListEntry.all
			)
				.map(unNsfw)
				.map((x) => normalizeJoinDddgPath(headFolder, x, paths))
				.map(unPng);
			let assoc = headAssoc[`${id}.${headKey}`];
			console.log('pre assoc', assoc);
			if (assoc !== undefined) assoc = 'faces' + assoc;
			else assoc = 'faces_' + headKey;
			console.log('post assoc', assoc);
			if (!outHeads[assoc]) {
				outHeads[assoc] = [];
				if (!headAssoc[`${id}.${headKey}`]) {
					if (!(headListEntry instanceof Array)) {
						outHeadOffsets[assoc] = headListEntry.offset || [290, 70];
					} else {
						outHeadOffsets[assoc] = [290, 70];
					}
				}
			}
			outHeads[assoc] = [...outHeads[assoc], ...headList];
		}
	}

	const newStyles = Object.keys(subPosesByStyle).filter(
		(style) => style !== '' && style !== '_cas'
	);

	if (newStyles.length > 0) {
		out += `styles=[${newStyles.map((style) => `"${style}"`).join(',')}]\n`;
	}

	for (const style in subPosesByStyle) {
		if (!subPosesByStyle.hasOwnProperty(style)) continue;
		const subPoses = subPosesByStyle[style];
		out += `poses${style}=[${subPoses
			.map((subPose) => {
				return `(${subPose.map(formatSubposeElement).join(',')})`;
			})
			.join(',')}]\n`;
	}

	console.log(JSON.stringify(outHeads));

	for (const headKey in outHeads) {
		if (!outHeads.hasOwnProperty(headKey)) continue;
		const heads = outHeads[headKey];
		out += `${headKey}=${JSON.stringify(heads)}\n`;
	}
	/*
	for (const headKey in outHeadOffsets) {
		if (!subPosesByStyle.hasOwnProperty(style)) continue;
		const subPoses = subPosesByStyle[style];
		out += `poses${style}=[${subPoses
			.map((subPose) => {
				return `(${subPose.map(formatSubposeElement).join(',')})`;
			})
			.join(',')}]\n`;
	}
	*/
	console.log(
		'Enter credits. They are split into left and right side. Leave both sides empty to stop.'
	);
	console.log(`The current package is ${json.packId}.`);
	console.log(`Original credits: ${json.packCredits}`);

	const jsonAny = json as any;
	const leftCredits: string[] =
		(jsonAny.cc2credits && jsonAny.cc2credits.left) || [];
	const rightCredits: string[] =
		(jsonAny.cc2credits && jsonAny.cc2credits.right) || [];

	while (
		exportCredits &&
		leftCredits.length === 0 &&
		rightCredits.length === 0
	) {
		const left = (await readline.ask('Left side')).trimRight();
		const right = (await readline.ask('Right side')).trimRight();

		if (left === '' && right === '') break;

		leftCredits.push(left);
		rightCredits.push(right);
	}

	if (leftCredits.length > 0 || rightCredits.length > 0) {
		out += `credits_l = ${JSON.stringify(leftCredits)}\n`;
		out += `credits_r = ${JSON.stringify(rightCredits)}\n`;
	}
	return out;
}

function formatSubposeElement(
	element: string | [string, undefined] | [number, number]
) {
	if (typeof element === 'string') return `"${element}"`;
	const elements = (element as Array<string | number>).map((x) => {
		if (typeof x === 'string') {
			return `"${x}"`;
		}
		if (x === undefined) {
			return '';
		}
		return x.toString();
	});
	return `(${elements.join(',')})`;
}

async function convertPackage(
	basedir: string,
	outdir: string,
	packName: string,
	useSubfolders: boolean,
	exportCredits: boolean
): Promise<void> {
	basedir = path.join(basedir, packName);
	let json;
	try {
		json = require(path.join(basedir, 'index.json'));
	} catch (e) {
		console.error(`Couldn't read index.json of '${packName}'`);
	}
	const characterName = dgName2ccName(json.id);

	const cc2PackName = dgPackId2ccPackId(json.packId);
	const assetFolderName = cc2PackName.startsWith(`${characterName}__`)
		? cc2PackName.slice(characterName.length + 2)
		: cc2PackName;
	if (useSubfolders) {
		outdir = path.join(outdir, json.packId);
		await mkdirp(outdir);
	}
	const assetDir = path.join(
		outdir,
		`custom_assets/characters/${characterName}/${assetFolderName}/`
	);
	await mkdirp(assetDir);
	const characterDir = path.join(outdir, `characters/`);
	await mkdirp(characterDir);

	const characterFilePath = path.join(characterDir, `${cc2PackName}.adn`);
	const adnFileP = promisify(fs.writeFile)(
		characterFilePath,
		await writeCharacterFile(
			characterName,
			json,
			exportCredits,
			assetFolderName
		)
	);
	const copyPngP = copyPngs(basedir, assetDir);
	await Promise.all([adnFileP, copyPngP]);
}

async function copyPngs(source: string, dest: string) {
	const allFiles = await promisify(fs.readdir)(source);
	const areFiles = await Promise.all(
		allFiles.map((filePath) => isFile(path.join(source, filePath)))
	);

	const actualPngs = allFiles
		.filter((filename, i) => areFiles[i] && filename.endsWith('.png'))
		.map((filename) => path.join(source, filename));
	const subFolders = allFiles.filter((filename, i) => !areFiles[i]);

	await mkdirp(dest);

	for (const subFolder of subFolders) {
		await copyPngs(path.join(source, subFolder), path.join(dest, subFolder));
	}

	const copyP = promisify(fs.copyFile);
	const copyPs = actualPngs.map((pngPath) =>
		copyP(pngPath, path.join(dest, path.basename(pngPath)))
	);
	await Promise.all(copyPs);
}

async function main() {
	let filter = '*';

	/** @type {string} */
	const basedir = await readline.askFolder(
		'Which directory do you want to read the packs from?',
		path.resolve('.'),
		false,
		async (dir) => {
			const packs = await getAllPacks(dir);
			if (packs.length === 0) {
				if (await isFile(path.join(dir, 'index.json'))) {
					const oldDir = dir;
					filter = path.basename(dir);
					dir = path.join(dir, '..');
					console.log(
						`The folder '${oldDir}' is a content pack itself. Changed to be '${dir}'.`
					);
					return dir;
				} else {
					console.log(
						`The folder '${dir}' does not contain any content packs.`
					);
					return false;
				}
			}
		}
	);

	const packs = await getAllPacks(basedir);

	/** @type {string} */
	const outdir = await readline.askFolder(
		'Which directory do you want to output to?',
		path.resolve('.')
	);

	/** @type {string} */
	filter = await readline.ask(
		'Which mask do you want the packs to be filtered by?',
		filter,
		(str) => {
			if (filtering(str, packs).length === 0) {
				console.error('Filter matches no pack');
				return false;
			}
		}
	);

	const filteredPacks = filtering(filter, packs);

	const isCC = await isCCDir(outdir);
	const useSubfolders = await readline.askBool(
		'Do you want to use sub folders?',
		!isCC
	);

	const exportCredits = await readline.askBool(
		'Do you care about about credits?',
		true
	);

	for (const pack of filteredPacks) {
		await convertPackage(basedir, outdir, pack, useSubfolders, exportCredits);
	}

	process.exit();
}

if (require.main && require.main.filename === __filename) {
	main();
}
