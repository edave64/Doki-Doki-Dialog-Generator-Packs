<template>
	<div class="pages" @keydown="keydownHandler">
		<div class="page fly-left" :class="{ blured: selected }" v-if="!selected">
			<search-bar
				class="search-bar"
				ref="searchBar"
				v-model="search"
				:disabled="!!selected"
				@focus-list="focusListHandler"
			/>
			<list
				class="list"
				ref="list"
				:search="search"
				:authors="authors"
				:packs="packs"
				:disabled="!!selected"
				@selected="onSelect"
				@select-search-bar="$refs.searchBar.focus()"
			/>
		</div>
		<div class="page fly-right" v-if="selected">
			<pack-display
				ref="dialog"
				class="pack-display"
				:authors="authors"
				:packs="packs"
				:selected="selected"
				show-back
				@leave="leavePackDisplay"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchBar from '../components/SearchBar.vue';
import List, { SelectedEvent } from '../components/List.vue';
import PackDisplay from '../components/PackDisplay.vue';
import { IAuthors } from '@edave64/dddg-repo-filters/dist/authors';
import { IPack } from '@edave64/dddg-repo-filters/dist/pack';

@Component({
	components: {
		SearchBar,
		List,
		PackDisplay,
	},
})
export default class App extends Vue {
	private search = '';
	private authors: IAuthors = {};
	private packs: IPack[] = [];

	private selected: string | null = null;

	public async created() {
		[this.packs, this.authors] = await Promise.all([
			this.fetchJSON<IPack[]>('repo.json'),
			this.fetchJSON<IAuthors>('people.json'),
		]);
	}

	private async fetchJSON<A>(path: string): Promise<A> {
		const req = await fetch(path);
		return await req.json();
	}

	private leavePackDisplay(moveFocus: boolean) {
		this.selected = null;
		if (moveFocus) {
			this.$nextTick(() => {
				(this.$refs.searchBar as SearchBar).focus();
			});
		}
	}

	private keydownHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.selected = '';
			this.$nextTick(() => {
				(this.$refs.searchBar as SearchBar).focus();
			});
		}
	}

	private onSelect({ id, source }: SelectedEvent) {
		this.selected = id;
		if (source === 'keyboard') {
			this.$nextTick(() => {
				const dialog = this.$refs.dialog as PackDisplay;
				dialog.focus();
			});
		}
	}

	private focusListHandler() {
		(this.$refs.list as List).focus();
	}
}
</script>

<style lang="scss">
@font-face {
	font-family: aller;
	font-weight: normal;
	font-style: normal;
	src: url(../assets/fonts/aller/aller.woff2) format('woff2'),
		url(../assets/fonts/aller/aller.woff) format('woff'),
		url(../assets/fonts/aller/aller.ttf) format('truetype'),
		url(../assets/fonts/aller/aller.otf) format('opentype');
}

* {
	font-family: aller;
	font-size: 16px;
	box-sizing: border-box;
}

body {
	font-family: aller, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
}

button {
	border: 2px solid #ffbde1;
	background: #ffe6f4;
	padding: 4px;
}

.list {
	z-index: 0;
}

.search-bar {
	z-index: 1;
}

.pages,
.page {
	height: 100%;
	width: 100%;
}

.fly-right.fly-enter {
	transform: translate(0, 0);
}

.fly-right.fly-enter-active {
	transition: transform 1s;
	transform: translate(-100%, 0);
}

.fly-right.fly-leave {
	transform: translate(0, 0);
}

.fly-right.fly-leave-active {
	transition: transform 20s;
	transform: translate(-100%, 0);
}

.fly-left.fly-enter {
	transform: translate(0, 0);
}

.fly-left.fly-enter-active {
	transition: transform 1s;
	transform: translate(100%, 0);
}

.fly-left.fly-leave {
	transform: translate(0, 0);
}

.fly-left.fly-leave-active {
	transition: transform 20s;
	transform: translate(100%, 0);
}
</style>
