<template>
	<standalone :authors="authors" :packs="packs" />
	<!--<div style="width: 100vw; height: 100vh">
		<single-box :authors="authors" :packs="packs" />
	</div>-->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Standalone from './layouts/Standalone.vue';
// import SingleBox from './layouts/SingleBox.vue';
import { IAuthors } from '@edave64/dddg-repo-filters/dist/authors';
import { IPack } from '@edave64/dddg-repo-filters/dist/pack';

@Component({
	components: {
		Standalone,
		//SingleBox,
	},
})
export default class App extends Vue {
	private authors: IAuthors = {};
	private packs: IPack[] = [];

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
