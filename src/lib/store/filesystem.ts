import type { folderContentType } from '$lib/types/fileSystem';
import { writable, type Writable } from 'svelte/store';

export const path = writable('');
export const folderContent: Writable<folderContentType[]> = writable([]);
export const fileContent: Writable<string> = writable('');
