<template>
	<div class="dialog-wrapper" @click="$emit('leave')">
		<dialog ref="packDialog" :style="{ backgroundImage }" open @click.stop>
			<header>
				<h1>{{ pack.name }}</h1>
				<h2>{{ pack.id }}</h2>
			</header>
			<section class="disclaimer" v-if="pack.disclaimer">
				{{ pack.disclaimer }}
			</section>
			<section v-if="pack.source">
				<a :href="pack.source" target="_blank" rel="noopener noreferrer"
					>Source</a
				>
			</section>
			<section>
				<button
					v-if="pack.dddg1Path"
					class="clipboard"
					@click="copyToClipboard"
				>
					Copy DDDG Content Pack
				</button>
				<button v-if="pack.ddcc2Path" @click="openDDCCUrl">
					Download Comic Club Pack
				</button>
				<div class="copy-wrapper">
					<input
						v-if="pack.dddg1Path"
						ref="copyable"
						:value="pack.dddg1Path"
						readonly
					/>
				</div>
			</section>
			<section>
				<h3>Authors</h3>
				<table>
					<tbody>
						<tr v-for="authorId of pack.authors" :key="authorId">
							<td>{{ authorName(authorId) }}</td>
							<td>
								<a
									v-for="link of authorsLinks(authorId)"
									:key="link.target"
									:href="link.target"
									target="_blank"
									rel="noopener noreferrer"
									class="platform_button"
									><img
										:title="link.platform"
										:src="link.icon"
										height="32"
										width="32"
								/></a>
							</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section v-if="pack.description">
				<h3>Credits</h3>
				<p v-html="sanitize(pack.description)"></p>
			</section>
		</dialog>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAuthors, IAuthor } from '../authors';
import { IPack } from '../pack';
import { sanitize } from '../character-pack-sanitizer';

const linkablePlatforms: Array<[keyof IAuthor, string, string]> = [
	['reddit', 'https://reddit.com/u/%1', 'reddit.png'],
	['deviantart', 'https://www.deviantart.com/%1', 'deviantart.png'],
	['twitter', 'https://twitter.com/%1', 'twitter.svg'],
	['pixiv', 'https://www.pixiv.net/users/%1', 'pixiv.ico'],
	['patreon', 'https://www.patreon.com/%1', 'patreon.png'],
	['facebook', 'https://www.facebook.com/%1', 'facebook.png'],
	['github', 'https://github.com/%1', 'github.png'],
	['website', '%1', 'website.svg'],
];

const expandablePlatforms: Array<[keyof IAuthor, string]> = [
	['discord', 'discord.svg'],
];

@Component({})
export default class Dialog extends Vue {
	@Prop() private selected!: string;
	@Prop() private authors!: IAuthors;
	@Prop() private packs!: IPack[];

	private authorName(authorId: string) {
		const author = this.authors[authorId];
		if (author && author.currentName) return author.currentName;
		return authorId;
	}

	private authorsLinks(authorId: string): AuthorLink[] {
		const author = this.authors[authorId];
		if (!author) return [];
		return linkablePlatforms
			.filter(platform => author[platform[0]])
			.map(platform => {
				const value = author[platform[0]]!;
				const target = platform[1].replace('%1', value);
				return {
					target,
					platform: platform[0][0].toUpperCase() + platform[0].slice(1),
					icon: 'icons/' + platform[2],
				};
			});
	}

	private sanitize(credits: string) {
		return sanitize(credits);
	}

	private copyToClipboard() {
		if (!this.$refs.copyable) return;
		const copyEle = this.$refs.copyable as HTMLInputElement;

		/* Select the text field */
		copyEle.select();
		copyEle.setSelectionRange(0, 99999); /*For mobile devices*/

		/* Copy the text inside the text field */
		document.execCommand('copy');
	}

	private openDDCCUrl() {
		window.open(this.pack.ddcc2Path!, '_blank');
	}

	private get pack(): IPack {
		return this.packs.find(pack => pack.id === this.selected)!;
	}

	private get backgroundImage(): string {
		return this.pack.preview.map(preview => `url('${preview}')`).join(',');
	}
}

interface AuthorLink {
	readonly target: string;
	readonly platform: string;
	readonly icon: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dialog-wrapper {
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background: rgba($color: #000000, $alpha: 0.5);
	display: flex;
}

.platform_button {
	margin-right: 6px;
}

dialog {
	width: 512px;
	height: 512px;
	max-width: 90vw;
	max-height: 90vh;
	background-attachment: scroll;
	background-color: #ffffff;
	background-position: right center;
	background-repeat: no-repeat;
	background-size: contain;
	display: flex;
	flex-direction: column;
	align-self: center;
	overflow: auto;
	padding: 0;
	border: 4px solid #ffbde1;

	h1 {
		font-size: 24px;
	}

	h2 {
		font-size: 14px;
	}

	section,
	header,
	footer {
		padding: 16px;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 1) 25%,
			rgba(255, 255, 255, 0) 75%
		);
		width: 473px;

		text-shadow: 0 0 4px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff,
			-1px 1px 0 #fff, 1px 1px 0 #fff;
	}

	footer:last-child,
	section:last-child {
		flex-grow: 1;
	}

	section.disclaimer {
		background: linear-gradient(
			90deg,
			rgba(255, 51, 51, 1) 25%,
			rgba(255, 51, 51, 0) 75%
		);
	}

	.copy-wrapper {
		display: block;
		width: 1px;
		overflow: hidden;
		height: 1px;
		opacity: 0;

		input {
			position: relative;
		}
	}
}
</style>
