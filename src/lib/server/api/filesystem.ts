import type { folderContentType } from '$lib/types/fileSystem';
import {
	statSync,
	readFileSync,
	readdirSync,
	writeFileSync,
	renameSync,
	mkdirSync,
	rmSync,
	cpSync
} from 'fs';
import { normalize } from 'path';

export function readFileOrFolder(path: string): {
	fileContent?: string;
	folderContent?: folderContentType[];
} {
	let formatedPath = './data/' + path;

	const stats = statSync(formatedPath);
	if (stats.isFile()) {
		const fileContent = readFileSync(formatedPath, 'base64');
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
	let formatedPath = './data/' + path;

	writeFileSync(formatedPath, content, 'utf-8');
}

export function moveFileOrFolder(source: string, destination: string) {
	let formatedSource = './data/' + source;
	let formatedDestination = './data/' + destination;

	renameSync(formatedSource, formatedDestination);
}

export function createFile(path: string) {
	let formatedPath = './data/' + path;

	writeFileSync(formatedPath, '', 'utf-8');
}

export function createFolder(path: string) {
	let formatedPath = './data/' + path;

	mkdirSync(formatedPath);
}

export function deleteFileOrFolder(path: string) {
	let formatedPath = './data/' + path;

	rmSync(formatedPath, { recursive: true, force: true });
}

export function copyFileOrFolder(source: string, destination: string) {
	let formatedSource = './data/' + source;
	let formatedDestination = './data/' + destination;

	cpSync(formatedSource, formatedDestination, { recursive: true, force: true });
}

export async function uploadFiles(path: string, files: File[]) {
	let formatedPath = './data/' + path;

	for (const file of files) {
		const filePath = normalize(`${formatedPath}/${file.name}`);

		// make sure the parent directory exists
		const parentDir = filePath.split('/').slice(0, -1).join('/');
		mkdirSync(parentDir, { recursive: true });

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		writeFileSync(filePath, buffer);
	}
}
