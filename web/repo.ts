import { IPack } from '../scripts/pack';
import { IAuthors, IAuthor } from '../scripts/authors';

let authors!: IAuthors;
let data: IPack[];

export async function init() {
	[data, authors] = await Promise.all([
		(async () => {
			const req = await fetch('./repo.json');
			return await req.json();
		})(),
		(async () => {
			const req = await fetch('./people.json');
			return await req.json();
		})(),
	]);
	render();
}

init();

function render() {
	const existing = document.getElementById('packList');
	if (existing) existing.remove();
	const filtered = data;

	const table = document.createElement('table');
	table.id = 'packList';
	const headers = document.createElement('tr');
	for (const header of ['Pack', 'Character', 'Type', 'By']) {
		const th = document.createElement('th');
		th.appendChild(document.createTextNode(header));
		headers.appendChild(th);
	}
	table.appendChild(headers);
	for (const pack of data) {
		const row = document.createElement('tr');
		const nameCell = document.createElement('td');
		nameCell.appendChild(document.createTextNode(pack.name));
		row.appendChild(nameCell);
		const charCell = document.createElement('td');
		charCell.appendChild(document.createTextNode(pack.characters.join(', ')));
		row.appendChild(charCell);
		const typeCell = document.createElement('td');
		typeCell.appendChild(document.createTextNode(pack.kind.join(', ')));
		row.appendChild(typeCell);
		const byCell = document.createElement('td');
		row.appendChild(byCell);

		for (const author of pack.authors) {
			renderAuthor(byCell, author);
		}
		table.appendChild(row);
	}
	const contents = document.getElementById('contents')!;
	contents.appendChild(table);
}

function renderAuthor(parent: Element, author: string) {
	const authorDiv = document.createElement('div');
	parent.appendChild(authorDiv);

	const authorJSON = authors[author];
	if (!authorJSON) {
		authorDiv.appendChild(document.createTextNode(author));
		return;
	}

	authorDiv.appendChild(
		document.createTextNode(authorJSON.currentName || author)
	);
	/*

	for (const linkablePlatform of linkablePlatforms) {
		const value = authorJSON[linkablePlatform[0]];
		if (!value) continue;
		const link = document.createElement('a');
		link.href = linkablePlatform[1].replace('%1', value);
		const img = document.createElement('img');
		img.src = 'icons/' + linkablePlatform[2];
		img.height = 32;
		img.width = 32;
		img.title =
			linkablePlatform[0][0].toUpperCase() + linkablePlatform[0].slice(1);
		link.appendChild(img);
		authorDiv.appendChild(link);
	}
	*/
}
