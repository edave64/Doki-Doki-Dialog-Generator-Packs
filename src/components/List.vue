<template>
	<div class="list">
		<table>
			<thead>
				<tr>
					<th
						v-for="(header, idx) of [
							['name', 'Pack'],
							['characters', 'Character'],
							['kind', 'Type'],
							['authors', 'Authors'],
						]"
						:key="idx"
						@click="sortBy(header[0])"
					>
						<div>
							<div>{{ header[1] }}</div>
							<div v-if="sort === header[0]">{{ desc ? '▼' : '▲' }}</div>
						</div>
					</th>
				</tr>
			</thead>
			<transition-group
				name="tbody-group"
				tag="tbody"
				tabindex="0"
				@keydown="keydownHandler"
				@focus="updateFocusedItem"
			>
				<tr
					v-for="pack of list"
					:key="pack.id"
					:class="{
						'tbody-group-item': true,
						focused: focusedItem === pack.id,
					}"
					@click="
						$emit('selected', { id: pack.id, source: 'pointer' });
					"
				>
					<td>{{ pack.name }}</td>
					<td>{{ pack.characters.join(', ') }}</td>
					<td>{{ pack.kind.join(', ') }}</td>
					<td>{{ pack.authors.join(', ') }}</td>
				</tr>
			</transition-group>
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
import { IAuthors } from '../authors';
import parse from '../filterparser/parser';
import optimize from '../filterparser/optimize';
import compile from '../filterparser/compile';

@Component
export default class List extends Vue {
	@Prop() private search!: string;
	@Prop() private authors!: IAuthors;
	@Prop() private packs!: IPack[];
	private sort: keyof IPack | '' = '';
	private desc = false;

	private wordCache: { [id: string]: Set<string> } = {};

	public get list(): IPack[] {
		const filtered = this.filterList(this.packs, this.search);
		if (this.sort && filtered.length > 0) {
			const sort = this.sort as keyof IPack;
			let sortFunc: ((a: IPack, b: IPack) => number) | undefined = undefined;
			if (typeof filtered[0][sort] === 'string') {
				sortFunc = (a, b) => a.name.localeCompare(b.name);
			} else if (filtered[0][sort] instanceof Array) {
				sortFunc = (a, b) =>
					(a as any)[sort]
						.join(', ')
						.localeCompare((b as any)[sort].join(', '));
			}
			if (sortFunc) {
				if (this.desc) {
					const oldSort = sortFunc;
					sortFunc = (b, a) => oldSort(a, b);
				}
				filtered.sort(sortFunc);
			}
		}
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

	private sortBy(by: keyof IPack) {
		if (this.sort === by) {
			if (!this.desc) {
				this.desc = true;
			} else {
				this.sort = '';
				this.desc = false;
			}
		} else {
			this.sort = by;
			this.desc = false;
		}
	}

	private filterList(list: IPack[], search: string): IPack[] {
		if (!search) return [...list];
		const parsed = parse(search);
		const optimized = optimize(parsed);
		const compiled = compile(optimized, this.authors, list);
		if (compiled.find(matcher => matcher.isImpossible)) return [];
		const filteredList = list.filter(pack =>
			compiled.every(matcher => matcher.match(pack))
		);
		return filteredList;
	}
}

export interface SelectedEvent {
	id: string;
	source: 'keyboard' | 'pointer';
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

.tbody-group-item {
	opacity: 1;
	transition: all 0.15s;
}
.tbody-group-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
	opacity: 0;
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
tr:hover,
th:hover {
	background: #ffe6f4;
	cursor: pointer;
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

	> div {
		display: flex;
		justify-content: space-between;
	}
}
footer {
	padding-top: 8px;
	color: #444;
}
</style>
