import data from './repo.json';
import people from './people.json';
import { IPack, PackKind } from './pack';
import { IAuthor } from './authors';

const charOrder = new Map(
	[
		'Monika',
		'Monika R63',
		'Natsuki',
		'Natsuki R63',
		'Sayori',
		'Sayori R63',
		'Yuri',
		'Yuri R63',
		'MC',
		'Dadsuki',
		'MC (Slim)',
		"Sayori's Mom",
		'TacticalCupcakes',
	].map((val, idx) => [val, idx])
);

const kindOrder = new Map(
	['Characters', 'Expressions', 'Poses', 'Styles'].map((val, idx) => [val, idx])
) as Map<PackKind, number>;

console.log(`Here, I will collect all Content Packs released so far.

Content Packs can add new characters to the [Doki Doki Dialog Generator](https://www.reddit.com/comments/d4l4gh/), or add new poses, expressions and outfits to existing characters.

To add one, go to the General-Panel, click "Content Packs", then "Add new Pack". Then enter/paste the pack URL.

When there are webp and png versions, the webp is smaller, while the png version is supported by older browsers and safari.

To use the Comic Club versions of these packs, you must first add the [Content Pack compatibility files](https://drive.google.com/open?id=15IAbhTkA2xRejvTHu_rZ24kZB2vhQcGM) to your Comic Club installation.

|Pack|Character|Type|By|URL|Comic Club|
|:-|:-|:-|:-|:-|:-|`);

for (const pack of (data as IPack[]).sort(sortPacks)) {
	const packName = pack.name;
	const source = pack.source || pack.preview[0];
	const character = pack.characters.join(', ');
	const kind = pack.kind.join(', ');

	let peopleList = [];
	for (const personKey of pack.authors) {
		const person = (people as { [key: string]: IAuthor })[personKey];
		peopleList.push(
			!person
				? personKey
				: person.reddit
				? `/u/${person.reddit}`
				: person.currentName
				? person.currentName
				: personKey
		);
	}

	let ddccPath = '';

	if (pack.ddcc2Path) {
		ddccPath = `[⭳](${pack.ddcc2Path})`;
	}

	console.log(
		`|[${packName}](${source})|${character}|${kind}|${peopleList.join(', ')}|${
			pack.dddg1Path
		}|${ddccPath}|`
	);
}

function sortPacks(packA: IPack, packB: IPack): number {
	for (
		let i = 0,
			length = Math.min(packA.characters.length, packB.characters.length);
		i < length;
		++i
	) {
		if (packA.characters[i] !== packB.characters[i]) {
			return (
				charOrder.get(packA.characters[i])! -
				charOrder.get(packB.characters[i])!
			);
		}
	}
	if (packA.characters.length !== packB.characters.length) {
		return packA.characters.length - packB.characters.length;
	}
	for (
		let i = 0, length = Math.min(packA.kind.length, packB.kind.length);
		i < length;
		++i
	) {
		if (packA.kind[i] !== packB.kind[i]) {
			return kindOrder.get(packA.kind[i])! - kindOrder.get(packB.kind[i])!;
		}
	}
	if (packA.kind.length !== packB.kind.length) {
		return packA.kind.length - packB.kind.length;
	}
	return packA.name.localeCompare(packB.name);
}
