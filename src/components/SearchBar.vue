<template>
	<div class="search-bar" @focusin="onFocusIn" @focusout="onFocusOut">
		<contenteditable
			tag="div"
			class="input"
			:contenteditable="true"
			v-model="message"
			:noNL="true"
			:noHTML="false"
			@returned="doUpdate"
			@input="onUpdate"
		/>
		<div
			v-if="focus && suggestions.length > 0"
			class="suggestions"
			tabindex="0"
		>
			<div
				v-for="suggestion of suggestions"
				:key="suggestion[0]"
				:class="{
					suggestion: true,
					active: currentSuggestion === suggestion[0],
				}"
			>
				<span class="primary">{{ suggestion[0] }}</span
				>&nbsp;
				<span class="secondary">{{ suggestion[1] }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Watch } from 'vue-property-decorator';

const debounce = 500;

@Component
export default class SearchBar extends Vue {
	@Prop() private value!: string;

	private focus = false;
	private message = '';
	private debounceTimeout: number | null = null;
	private lastSend = '';

	private get suggestions(): [string, string][] {
		return [];
		/*
		return [
			['by', 'author'],
			['for', 'character'],
			['has', 'style, expressions, etc'],
		];
		*/
	}

	private onFocusIn(event: FocusEvent) {
		console.log(event);
		this.focus = true;
	}

	private onFocusOut(event: FocusEvent) {
		console.log(event);
		this.focus = false;
		console.log(document.activeElement);
	}

	@Watch('value')
	private updateInternalValue() {
		if (this.lastSend === this.value) {
			this.lastSend = '';
			return;
		}
		this.message = this.value;
	}

	private onUpdate() {
		if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
		this.debounceTimeout = setTimeout(this.doUpdate, debounce);
	}

	private doUpdate() {
		if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
		this.debounceTimeout = null;
		const div = document.createElement('div');
		div.innerHTML = this.message;
		this.lastSend = div.innerText;
		this.$emit('input', div.innerText);
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}

.search-bar {
	position: absolute;
	top: 8px;
	height: 20px;
	left: 8px;
	right: 8px;
}

.input {
	border: 2px solid #ffbde1;
	padding: 8px;
	height: 42px;
	overflow: hidden;
	white-space: nowrap;
	background: #ffe6f4 url(./search.svg);
	background-repeat: no-repeat;
	background-size: contain;
	background-position: right center;
}

.suggestions {
	border: 2px black solid;
	border-top: 0;
	background: white;

	.suggestion {
		border: 0;
		line-height: 24px;
		padding: 4px;
	}
	.suggestion {
		border: 0;
		line-height: 24px;
		padding: 4px;
		border-radius: 4px;

		.primary {
			font-weight: bolder;
		}

		.secondary {
			color: #222;
		}

		&.active {
			background: cyan;
		}

		&:hover {
			background: lightcyan;
		}
	}
}
</style>
