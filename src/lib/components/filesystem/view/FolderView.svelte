<script lang="ts">
	import ContextMenu from '$lib/components/components/ContextMenu.svelte';
	import Document from '$lib/components/svg/Document.svelte';
	import Folder from '$lib/components/svg/Folder.svelte';
	import { navigateToPath } from '$lib/scripts/filesystem';
	import { folderContent, path } from '$lib/store/filesystem';
	import FolderContextMenu from './FolderContextMenu.svelte';
	import FolderViewItemContextMenu from './FolderViewItemContextMenu.svelte';

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
	{#each $folderContent as fileOrFolder, i}
		<ContextMenu
			parentsQuery={`#folderViewItem-${i}`}
			Element={FolderViewItemContextMenu}
			props={{
				fileOrFolder: fileOrFolder
			}}
		/>
		<button
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
