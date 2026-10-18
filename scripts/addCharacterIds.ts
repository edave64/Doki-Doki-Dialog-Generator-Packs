/**
 * One time script for adding the "characterIds" field
 * Preserved for future reference
 */

import { dirname, join } from "node:path";
import fsp from "node:fs/promises";
import { glob } from "glob";
import { expandOrTranslateId } from "@edave64/doki-doki-dialog-generator-pack-format/dist/v2/convertV1.js";

const fsOpts = { encoding: "utf-8" as BufferEncoding };

async function main(): Promise<void> {
	await Promise.all(
		(await glob("../packs/**/repo.json")).map(async (repoEntry: string) => {
			// For all pack repo files
			const repo = JSON.parse(await fsp.readFile(repoEntry, fsOpts));
			const pack = repo.pack;

			// Already converted, skip
			if (Object.hasOwn(pack, "characterIds")) return;

			if (!Array.isArray(pack.characters) || pack.characters.length === 0) {
				pack.characterIds = [];
			} else {
				const indexPath = join(
					dirname(repoEntry),
					pack.dddg2Path ?? pack.dddg1Path ?? "index.json",
				);
				const index = JSON.parse(await fsp.readFile(indexPath, fsOpts));

				if (index.version === undefined) {
					// V1
					const id = index.id;
					pack.characterIds = [
						expandOrTranslateId("character", id, {
							characterId: id,
							packId: pack.id,
							paths: {},
						}),
					];
				} else {
					// V2
					pack.characterIds = (index.characters ?? []).map(
						(character: { id: string }) =>
							character.id.includes(":")
								? character.id
								: `${pack.id}:${character.id}`,
					);
				}
			}

			await fsp.writeFile(
				repoEntry,
				`${JSON.stringify(repo, null, "\t")}\n`,
				fsOpts,
			);
		}),
	);
}

await main();
