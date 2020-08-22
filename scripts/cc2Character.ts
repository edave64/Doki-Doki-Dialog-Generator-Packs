import { ccCharName } from "cc2Translate";

export class CC2Pack {
	public readonly characters: CC2Character[] = [];
}

export class CC2Character {
	public readonly styles: CC2Style[] = [];
	public readonly heads: CC2Heads[] = [];

	public constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly addition: boolean
	) {}

	/*
	private buildCCId(): string {
		if (ccCharName[name]) return ccCharName[name];
		const segments = this.dgId.split('.');
		return segments[segments.length - 1];
	}
	*/
}

export class CC2Style {
	public readonly poses: CC2Pose[] = [];
	public constructor(
		public readonly character: CC2Character,
		public readonly id: string = ''
	) {}



	public getStyleNames(): string[] {
		if (!this.poses) return [];
		const styleVariants = 
		if (!this.allowsDPT) return [`_${this.id}`];
		if (this.character.id !== 'natsuki')
			return [`_${this.id}`, `_dpt_${this.id}`];
		return [`_${this.id}`, `_dpt_${this.id}`, `_dpt_alt_${this.id}`];
	}

	public toCC2BodyString(): string {
		let ret = '';
		const allHeads = new Set(
			this.poses.flatMap((p) =>
				p.parts
					.filter((pp) => pp instanceof CC2Heads)
					.map((pp) => (pp as CC2Heads).id)
			)
		);
		return ret;
	}

	public buildCC2PoseText(
		poseName: string,
		headName: string,
		marker: string | null
	) {
		let ret = `poses_${poseName}=[`;
		ret += this.poses.map((p) => p.toCC2PoseString(null, null, null)).join(',');
		ret += ']\n';
		return ret + ']\n';
	}
}

export class CC2Pose {
	public readonly parts: Array<
		CC2PosePartRight | CC2PosePartLeft | CC2Heads | string
	> = [];
	public readonly leftParts: string[] = [];
	public readonly rightParts: string[] = [];

	public constructor(
		public readonly style: Readonly<CC2Style>,
		public readonly id: string
	) {}

	public toCC2PoseString(
		clrImage: string | null,
		poseText: string | null,
		headName: string | null
	): string {
		let list: Array<string | string[]> = [];
		let ret = '(';
		let first = false;
		if (clrImage) {
			ret += `(${JSON.stringify(clrImage)},)`;
		}
		for (const part of this.parts) {
			if (first) ret += ',';
			if (part instanceof CC2Heads) {
				if (headName) {
					ret += JSON.stringify(headName);
				} else {
					ret += JSON.stringify(`_head${part.id}`);
				}
			} else if (part instanceof CC2PosePartLeft) {
				ret += JSON.stringify(this.leftId);
			} else if (part instanceof CC2PosePartRight) {
				ret += JSON.stringify(this.rightId);
			} else {
				ret += JSON.stringify(part);
			}
			first = true;
		}
		if (poseText) {
			ret += `,(${JSON.stringify(poseText)},)`;
		}
		return ret;
	}

	public toCC2BodyString(): string {
		let ret = '';
		if (this.parts.find((x) => x instanceof CC2PosePartLeft)) {
			ret += `${this.leftId}=${JSON.stringify(this.leftParts)}\n`;
		}
		if (this.parts.find((x) => x instanceof CC2PosePartRight)) {
			ret += `${this.rightId}=${JSON.stringify(this.rightParts)}\n`;
		}
		return ret;
	}

	public get leftId(): string {
		return `left_${this.style.id}_${this.id}`;
	}

	public get rightId(): string {
		return `right_${this.style.id}_${this.id}`;
	}
}

export class CC2PosePartRight {
	public static readonly i: CC2PosePartLeft = new CC2PosePartRight();
	private constructor() {}
}

export class CC2PosePartLeft {
	public static readonly i: CC2PosePartLeft = new CC2PosePartLeft();
	private constructor() {}
}

export class CC2Heads {
	public readonly heads: string[] = [];
	public constructor(public readonly id: string) {}
}
