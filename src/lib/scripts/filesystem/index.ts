import { password, username } from '$lib/store/credentials';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { folderContent, path } from '$lib/store/filesystem';
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
	loadFolderContent();
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
