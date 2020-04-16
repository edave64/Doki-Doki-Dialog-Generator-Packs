<template>
	<div class="dialog-wrapper" @click="$emit('leave')">
		<dialog ref="packDialog" open>
			<pack-display :selected="selected" :authors="authors" :packs="packs" />
		</dialog>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAuthors } from '../authors';
import { IPack } from '../pack';
import PackDisplay from './PackDisplay.vue';

@Component({ components: { PackDisplay } })
export default class Dialog extends Vue {
	@Prop() private selected!: string;
	@Prop() private authors!: IAuthors;
	@Prop() private packs!: IPack[];
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
	transition: all 0.15s;
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
	overflow: hidden;
	padding: 0;
	border: 4px solid #ffbde1;
}
</style>
