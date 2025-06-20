<script>
	import ContextMenu from '$lib/components/components/ContextMenu.svelte';
	import Document from '$lib/components/svg/Document.svelte';
	import Folder from '$lib/components/svg/Folder.svelte';
	import { navigateToPath } from '$lib/scripts/filesystem';
	import { folderContent } from '$lib/store/filesystem';
	import FolderContextMenu from './FolderContextMenu.svelte';
</script>

<div
	id="folderView"
	class="bg-ctp-base hover:border-ctp-lavender border-ctp-surface1 h-full rounded-3xl border-2 p-5 transition-colors"
>
	<ContextMenu parentId={'folderView'} Element={FolderContextMenu} />
	{#each $folderContent as fileOrFolder}
		<button
			onclick={() => {
				navigateToPath(`${fileOrFolder.path}`);
			}}
			class="border-ctp-surface1 hover:border-ctp-peach text-ctp-text float-left m-3 flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 transition-colors"
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
