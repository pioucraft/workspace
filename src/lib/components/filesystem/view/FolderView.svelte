<script lang="ts">
	import ContextMenu from '$lib/components/components/ContextMenu.svelte';
	import Document from '$lib/components/svg/Document.svelte';
	import Folder from '$lib/components/svg/Folder.svelte';
	import { loadFolderContent, navigateToPath } from '$lib/scripts/filesystem';
	import { folderContent, path } from '$lib/store/filesystem';
	import FolderContextMenu from './FolderContextMenu.svelte';
	import FolderViewItemContextMenu from './FolderViewItemContextMenu.svelte';
	import { dropzone, draggable } from '$lib/scripts/dnd';
	import { password, username } from '$lib/store/credentials';

	async function handleDropzone(targetPath: string, sourcePath: string) {
		const response = await fetch('/api/filesystem/', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				username: $username,
				password: $password
			},
			body: JSON.stringify({
				oldPath: sourcePath,
				newPath: targetPath
			})
		});
		if (!response.ok) {
			const error = await response.json();
			alert(`Error moving file: ${error.error}`);
		} else {
			loadFolderContent();
		}
	}
</script>

<div
	id="folderView"
	class="bg-ctp-base hover:border-ctp-lavender border-ctp-surface1 h-full rounded-3xl border-2 p-5 transition-colors"
>
	<ContextMenu
		parentsQuery={'#folderView'}
		Element={FolderContextMenu}
		negativeQuery=".fileOrFolder"
	/>

	{#if $path !== '/'}
		<button
			use:dropzone={{
				on_dropzone(data: any) {
					let targetPath = $path.split('/').slice(0, -1).join('/') + '/' + data.split('/').at(-1);
					let sourcePath = data;

					handleDropzone(targetPath, sourcePath);
				}
			}}
			onclick={() => {
				navigateToPath(`${$path.split('/').slice(0, -1).join('/')}`);
			}}
			class="border-ctp-surface1 hover:border-ctp-peach text-ctp-text fileOrFolder float-left m-3 flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 transition-colors"
		>
			<div class="flex h-full w-full flex-col items-center justify-center gap-2">
				<Folder />
				<span class="text-ctp-text">../</span>
			</div>
		</button>
	{/if}

	{#each $folderContent as fileOrFolder, i}
		<ContextMenu
			parentsQuery={`#folderViewItem-${i}`}
			Element={FolderViewItemContextMenu}
			props={{
				fileOrFolder: fileOrFolder
			}}
		/>
		<button
			use:draggable={fileOrFolder.path}
			use:dropzone={{
				on_dropzone(data: any) {
					let targetPath = fileOrFolder.path + '/' + data.split('/').at(-1);
					let sourcePath = data;

					if (!fileOrFolder.isDirectory || data === fileOrFolder.path) {
						return;
					}

					handleDropzone(targetPath, sourcePath);
				}
			}}
			onclick={() => {
				navigateToPath(`${fileOrFolder.path}`);
			}}
			class="border-ctp-surface1 hover:border-ctp-peach text-ctp-text fileOrFolder float-left m-3 flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 transition-colors"
			id="folderViewItem-{i}"
		>
			{#if fileOrFolder.isDirectory}
				<Folder />
			{:else}
				<Document />
			{/if}
			<span class="text-ctp-text">{fileOrFolder.name}</span>
		</button>
	{/each}
</div>
