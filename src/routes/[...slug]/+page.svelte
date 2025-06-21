<script lang="ts">
	import { onLoginConfirm } from '$lib/scripts/store';
	import SideBar from '$lib/components/filesystem/SideBar.svelte';
	import TopBar from '$lib/components/filesystem/TopBar.svelte';
	import { loadPath } from '$lib/scripts/filesystem';
	import FolderView from '$lib/components/filesystem/view/FolderView.svelte';
	import { folderContent, fileContent } from '$lib/store/filesystem';
	import FileView from '$lib/components/filesystem/view/fileView/FileView.svelte';

	onLoginConfirm(async () => {
		await loadPath();
	});
</script>

<div
	class="bg-ctp-surface0 grid h-screen w-screen grid-cols-[300px_auto] grid-rows-[auto_1fr] gap-4 p-4"
>
	<SideBar />
	<TopBar />
	{#if $folderContent}
		<FolderView />
	{:else}
		<FileView />
	{/if}
</div>
