export const translateHeads: {
	[s: string]: string;
} = {
	'ddlc.monika:straight': '',
	'ddlc.monika:sideways': '_cpack_compat_leaning',
	'ddlc.yuri:straight': '',
	'ddlc.yuri:sideways': '_alt',
	'ddlc.sayori:straight': '',
	'ddlc.sayori:sideways': '_cpack_compat_leaning',
	'ddlc.natsuki:straight': '_cpack_compat',
	'ddlc.natsuki:straight_nsfw': '_cpack_compat',
	'ddlc.natsuki:sideways': '_cpack_compat',
	'ddlc.natsuki:turned': '_cpack_compat',
	'ddlc.natsuki:turnedAway': '_cpack_compat',
	'ddlc.fan.femc:straight': '',
	'ddlc.fan.femc:straight_hetero': '_alter',
	'ddlc.fan.femc:straight_hetero_lh': '_lh_alter',
	'ddlc.fan.mc2:straight': '',
	'ddlc.fan.mc2:straight_red': '_alter'
};

export const ccCharName: { [dddgId: string]: string } = {
	'ddlc.fan.mc2': 'mc',
};

export const headTranslations: {
	[s: string]: [string, string, string | null, boolean][];
} = {
	'monika:': [
		['', '', null, false],
		['', '', null, true],
	],
	'monika:_cpack_compat_leaning': [
		['', '_cpack_compat_leaning', null, false],
		['', '_cpack_compat_leaning', null, true],
	],
	'yuri:': [
		['', '', null, false],
		['', '', null, true],
	],
	'yuri._alt': [
		['', '_alt', null, false],
		['', '_alt', null, true],
	],
	'sayori:': [
		['', '', null, false],
		['', '', null, true],
	],
	'sayori:_cpack_compat_leaning': [
		['', '_cpack_compat_leaning', null, false],
		['', '_cpack_compat_leaning', null, true],
	],
	'natsuki:_cpack_compat': [
		['', '_cpack_compat', null, false],
		['', '_cpack_pt', 'base', true],
		['_alt', '_cpack_pt_alt', 'base_alt', true],
	],
	'femc:': [['', '', '../clrdot/y', false]],
	'femc:_alter': [['', '_alter', '../clrdot/b', false]],
	'femc:_lh': [['', '_lh', '../clrdot/y', false]],
	'femc:_lh_alter': [['', '_lh_alter', '../clrdot/b', false]],
	'mc2:straight': [
		['', '', '../clrdot/y', false],
		['', '', '../clrdot/y', true],
	],
	'mc2:_alter': [
		['', '_alter', '../clrdot/r', false],
		['', '_alter', '../clrdot/r', true],
	],
};
