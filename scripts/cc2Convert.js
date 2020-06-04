const readline = require('./readline');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { isDir, isFile, mkdirp } = require('./file');
const escapeStringRegexp = require('escape-string-regexp');

/**
 * @param {string} name
 * @returns {string}
 */
function ccName2dgName(name) {
	return `ddlc.${name}`;
}

/**
 * @param {string} name
 * @returns {string}
 */
function dgName2ccName(name) {
	const segments = name.split('.');
	return segments[segments.length - 1];
}

/**
 * @param {string} name
 * @returns {string}
 */
function dgPackId2ccPackId(name) {
	return name.replace(/\./g, '__').replace(/[^a-zA-Z0-9_]/gi, '_');
}

async function singlePack() {}

/**
 * @param {string} basedir
 * @returns {Promise<Array<string>>}
 */
async function getAllPacks(basedir) {
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

/**
 * @param {string} dir
 * @returns {Promise<boolean>}
 */
async function isCCDir(outdir) {
	const contents = await promisify(fs.readdir)(outdir);
	return contents.includes('characters') && contents.includes('custom_assets');
}

/**
 * @param {string} filter
 * @param {string[]} packs
 * @returns {string[]}
 */
function filtering(filter, packs) {
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

const headAssoc = {
	'ddlc.monika.straight': '_head',
	'ddlc.monika.sideways': '_head_cpack_compat_leaning',
	'ddlc.yuri.straight': '_head',
	'ddlc.yuri.sideways': '_head_alt',
	'ddlc.sayori.straight': '_head',
	'ddlc.sayori.sideways': '_head_cpack_compat_leaning',
	'ddlc.natsuki.straight': '_head_cpack_compat',
	'ddlc.natsuki.sideways': '_head_cpack_compat',
	'ddlc.natsuki.turned': '_head_cpack_compat',
};

/**
 * @param {string} styleName
 * @returns {string}
 */
function normalizeStyleName(styleName) {
	if (styleName === 'uniform') {
		return '';
	}
	if (styleName === 'casual') {
		return '_cas';
	}
	return '_' + styleName;
}

/**
 * @param {string} characterName
 * @param {any} json
 * @param {boolean} exportCredits
 * @param {string} cc2PackName
 */
async function writeCharacterFile(
	characterName,
	json,
	exportCredits,
	assetFolderName
) {
	let out =
		'# This file needs the content pack compatibility files\n' +
		`character="${characterName}"\n` +
		`custom=True\n`;

	const subPosesByStyle = {};
	const id = json.id;
	for (const pose of json.poses) {
		if (!subPosesByStyle[normalizeStyleName(pose.style)]) {
			subPosesByStyle[normalizeStyleName(pose.style)] = [];
		}
		const subPoses = subPosesByStyle[normalizeStyleName(pose.style)];
		const heads = pose.compatibleHeads.map(
			(head) => headAssoc[`${id}.${head}`]
		);

		const uniqueHeads = [];
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

		const poses = [];
		if (pose.static) {
			poses.push([pose.static]);
		}
		if (pose.variant) {
			for (const variant of pose.variant) {
				poses.push([variant]);
			}
		}
		if (pose.left) {
			for (const left of pose.left) {
				for (const right of pose.right) {
					poses.push([left, right]);
				}
			}
		}
		const noExtPoses = poses.map((pose) =>
			pose.map((posePart) => {
				if (typeof posePart === 'object') {
					posePart = posePart.img;
				}
				const filename = posePart.endsWith('.png')
					? posePart.slice(0, -4)
					: posePart;

				return `${assetFolderName}/${filename}`;
			})
		);
		for (const noExtPose of noExtPoses) {
			if (pose.headInForeground) {
				subPoses.push([].concat(noExtPose, uniqueHeads));
			} else {
				subPoses.push([].concat(uniqueHeads, noExtPose));
			}
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

	console.log(
		'Enter credits. They are split into left and right side. Leave both sides empty to stop.'
	);
	console.log(`The current package is ${json.packId}.`);
	console.log(`Original credits: ${json.packCredits}`);

	const leftCredits = (json.cc2credits && json.cc2credits.left) || [];
	const rightCredits = (json.cc2credits && json.cc2credits.right) || [];

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

function formatSubposeElement(element) {
	if (typeof element === 'string') return `"${element}"`;
	if (element instanceof Array) {
		return `(${element[0]},${element[1]})`;
	}
	return '';
}

/**
 * @param {string} basedir
 * @param {string} outdir
 * @param {string} packName
 * @param {boolean} useSubfolders
 * @param {boolean} exportCredits
 */
async function convertPackage(
	basedir,
	outdir,
	packName,
	useSubfolders,
	exportCredits
) {
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

/**
 * @param {string} source
 * @param {string} dest
 */
async function copyPngs(source, dest) {
	const allFiles = await promisify(fs.readdir)(source);
	const possiblePngs = allFiles
		.filter((filename) => filename.endsWith('.png'))
		.map((filename) => path.join(source, filename));
	const areFiles = await Promise.all(
		possiblePngs.map((filePath) => isFile(filePath))
	);
	const actualPngs = possiblePngs.filter((_path, idx) => areFiles[idx]);
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
		!isCC,
		true
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
