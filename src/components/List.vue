<template>
	<div class="list">
		<table>
			<thead>
				<tr>
					<th>Pack</th>
					<th>Character</th>
					<th>Type</th>
					<th>By</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="pack of list"
					:key="pack.id"
					@click="$emit('selected', pack.id)"
				>
					<td>{{ pack.name }}</td>
					<td>{{ pack.characters.join(', ') }}</td>
					<td>{{ pack.kind.join(', ') }}</td>
					<td>{{ pack.authors.join(', ') }}</td>
				</tr>
			</tbody>
		</table>
		<div class="spacer"></div>
		<footer>
			Created by edave64. Fork this on
			<a
				href="https://github.com/edave64/Doki-Doki-Dialog-Generator-Packs/tree/repo-browser"
				>github</a
			>.<br />
			To be used with the
			<a href="https://edave64.github.io/Doki-Doki-Dialog-Generator/release/"
				>Doki Doki Dialog Generator</a
			><br />
			Using <a href="https://material.io/">material icons</a> by google
		</footer>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IPack } from '../pack';
import { IAuthors, IAuthor } from '../authors';

@Component
export default class List extends Vue {
	@Prop() private search!: string;
	@Prop() private authors!: IAuthors;
	@Prop() private packs!: IPack[];

	private wordCache: { [id: string]: Set<string> } = {};

	public get list(): IPack[] {
		const filtered = this.filterList(this.packs, this.search);
		return filtered;
	}

	public get listById(): Map<string, IPack> {
		return new Map(this.packs.map(pack => [pack.id, pack]));
	}

	private get uniqueCharacters(): string[] {
		return Array.from(
			new Set(
				this.packs.flatMap(pack =>
					pack.characters.map(char => char.toLowerCase())
				)
			)
		);
	}

	private filterList(list: IPack[], search: string): IPack[] {
		if (!search) return list;
		const searchWords = search
			.toLowerCase()
			.replace(/\s+/g, ' ')
			.trim()
			.split(' ')
			// Eliminate prefixes
			.sort()
			.filter(
				(word, idx, ary) => !ary[idx + 1] || !ary[idx + 1].startsWith(word)
			);
		console.log(searchWords);
		const newCache: { [id: string]: Set<string> } = {};

		for (const searchWord of searchWords) {
			if (this.wordCache[searchWord]) {
				newCache[searchWord] = this.wordCache[searchWord];
				console.log('reuse cache');
			} else {
				console.log('no cache');
				const matchingAuthors = new Set<string>();
				for (const authorKey in this.authors) {
					if (!Object.prototype.hasOwnProperty.call(this.authors, authorKey))
						continue;
					const author = this.authors[authorKey]!;
					const props = Object.keys(author) as (keyof IAuthor)[];
					if (
						props.find(
							prop => author[prop]!.toLowerCase().indexOf(searchWord) >= 0
						)
					) {
						matchingAuthors.add(authorKey);
					}
				}
				const matchingKinds = new Set(
					['Styles', 'Characters', 'Expressions', 'Poses', 'Misc'].filter(
						kind => kind.toLowerCase().indexOf(searchWord) >= 0
					)
				);
				const matchingCharacters = new Set(
					this.uniqueCharacters.filter(char => char.indexOf(searchWord) >= 0)
				);
				const matchingPacks = new Set<string>();

				for (const pack of this.packs) {
					if (
						pack.id.toLowerCase().indexOf(searchWord) >= 0 ||
						pack.name.toLowerCase().indexOf(searchWord) >= 0 ||
						pack.searchWords.find(
							word => word.toLowerCase().indexOf(searchWord) >= 0
						) ||
						pack.authors.find(author => matchingAuthors.has(author)) ||
						pack.characters.find(char =>
							matchingCharacters.has(char.toLowerCase())
						) ||
						pack.kind.find(kind => matchingKinds.has(kind))
					) {
						matchingPacks.add(pack.id);
					}
				}

				newCache[searchWord] = matchingPacks;
			}
		}

		this.wordCache = newCache;

		const matchedPacks = Object.values(newCache);
		const lowestMatches = matchedPacks.reduce((acc, val) =>
			val.size < acc.size ? val : acc
		);

		const totalMatches = Array.from(lowestMatches).filter(match =>
			matchedPacks.every(pack => pack.has(match))
		);

		const packById = this.listById;
		return totalMatches.map(id => packById.get(id)!);
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list {
	position: absolute;
	top: 64px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	overflow: auto;
	display: flex;
	flex-direction: column;
}
.spacer {
	flex-grow: 1;
}
table {
	text-align: left;
	border-collapse: collapse;
	min-width: 100%;
	user-select: none;
}
tr:hover {
	background: #ffe6f4;
}
th,
td {
	padding: 0.25rem;
	min-height: 42px;
}
th {
	background: white;
	position: sticky;
	top: 0;
	box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 1);
}
footer {
	padding-top: 8px;
	color: #444;
}
</style>
