<template>
	<div id="app" @keydown="keydownHandler">
		<div id="center_wrapper" :class="{ blured: selected }">
			<search-bar
				class="search-bar"
				ref="searchBar"
				v-model="search"
				@focus-list="focusListHandler"
			/>
			<list
				class="list"
				ref="list"
				:search="search"
				:authors="authors"
				:packs="packs"
				@selected="onSelect"
				@select-search-bar="$refs.searchBar.focus()"
			/>
		</div>
		<pack-dialog
			v-if="selected"
			ref="dialog"
			:authors="authors"
			:packs="packs"
			:selected="selected"
			@leave="selected = null"
		/>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchBar from './components/SearchBar.vue';
import List, { SelectedEvent } from './components/List.vue';
import PackDialog from './components/Dialog.vue';
import { IAuthors } from './authors';
import { IPack } from './pack';

@Component({
	components: {
		SearchBar,
		List,
		PackDialog,
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
				const dialog = this.$refs.dialog as PackDialog;
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
	src: url(assets/fonts/aller/aller.woff2) format('woff2'),
		url(assets/fonts/aller/aller.woff) format('woff'),
		url(assets/fonts/aller/aller.ttf) format('truetype'),
		url(assets/fonts/aller/aller.otf) format('opentype');
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

#center_wrapper {
	width: 768px;
	max-width: 100vw;
	margin: auto;
	position: relative;
	height: 100vh;

	&.blured {
		transition: filter 250ms;
		filter: blur(2px);
	}

	.list {
		z-index: 0;
	}

	.search-bar {
		z-index: 1;
	}
}
</style>
