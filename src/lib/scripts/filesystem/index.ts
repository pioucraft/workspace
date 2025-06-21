import { password, username } from '$lib/store/credentials';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { fileContent, folderContent, path } from '$lib/store/filesystem';
import { get } from 'svelte/store';

export function navigateToPath(newPath: string) {
	if (!newPath.startsWith('/')) {
		newPath = `/${newPath}`;
	}

	goto(`${page.url.origin}${newPath}`, {
		invalidateAll: true,
		replaceState: true
	});

	path.set(newPath);
	loadPath(); // Load the content of the new path after navigation
}

export async function loadFolderContent() {
	folderContent.set([]); // Clear current folder content before fetching new data
	const folderContentFetch = await fetch(`/api/filesystem?path=${get(path)}`, {
		headers: {
			password: get(password),
			username: get(username)
		}
	});
	if (folderContentFetch.ok) {
		folderContent.set((await folderContentFetch.json())['folderContent']);
	} else {
		console.error('Failed to fetch folder content:', folderContentFetch.statusText);
	}
}

export async function loadFileContent() {
	fileContent.set('');

	const fileContentFetch = await fetch(`/api/filesystem?path=${get(path)}`, {
		headers: {
			password: get(password),
			username: get(username)
		}
	});
	if (fileContentFetch.ok) {
		fileContent.set((await fileContentFetch.json())['fileContent']);
	} else {
		console.error('Failed to fetch file content:', fileContentFetch.statusText);
	}
}

export async function loadPath() {
	fileContent.set(''); // Clear current file content before fetching new data
	folderContent.set([]); // Clear current folder content before fetching new data

	const pathFetch = await fetch(`/api/filesystem?path=${get(path)}`, {
		headers: {
			password: get(password),
			username: get(username)
		}
	});

	if (pathFetch.ok) {
		const { fileContent: newFileContent, folderContent: newFolderContent } = await pathFetch.json();
		fileContent.set(newFileContent);
		folderContent.set(newFolderContent);
	}
}
