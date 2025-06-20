import type { folderContentType } from '$lib/types/fileSystem';
import { statSync, readFileSync, readdirSync, writeFileSync, renameSync, mkdirSync } from 'fs';
import { normalize } from 'path';

export function readFileOrFolder(path: string): {
	fileContent?: string;
	folderContent?: folderContentType[];
} {
	let formatedPath = './data/' + path;

	const stats = statSync(formatedPath);
	if (stats.isFile()) {
		const fileContent = readFileSync(formatedPath, 'utf-8');
		return { fileContent };
	} else if (stats.isDirectory()) {
		const folder = readdirSync(formatedPath);
		let folderContent: folderContentType[] = [];

		for (const item of folder) {
			const itemPath = normalize(`/${path}/${item}`);
			const itemStats = statSync(`./data/${itemPath}`);
			folderContent.push({ path: itemPath, name: item, isDirectory: itemStats.isDirectory() });
		}

		return { folderContent };
	}
	throw new Error('Path does not exist');
}

export function modifyFileContent(path: string, content: string) {
	let formatedPath = './data' + path;

	writeFileSync(formatedPath, content, 'utf-8');
}

export function moveFileOrFolder(source: string, destination: string) {
	let formatedSource = './data' + source;
	let formatedDestination = './data' + destination;

	renameSync(formatedSource, formatedDestination);
}

export function createFile(path: string) {
	let formatedPath = './data' + path;

	writeFileSync(formatedPath, '', 'utf-8');
}

export function createFolder(path: string) {
	let formatedPath = './data' + path;

	mkdirSync(formatedPath);
}
