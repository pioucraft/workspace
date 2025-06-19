<script lang="ts">
	import { onLoginConfirm } from '$lib/scripts/store';
	import SideBar from '$lib/components/filesystem/SideBar.svelte';
	import TopBar from '$lib/components/filesystem/TopBar.svelte';
	import { loadFolderContent } from '$lib/scripts/filesystem';
	import FolderView from '$lib/components/filesystem/view/FolderView.svelte';

	onLoginConfirm(async () => {
		await loadFolderContent();
	});
</script>

<div
	class="bg-ctp-surface0 grid h-screen w-screen grid-cols-[300px_auto] grid-rows-[auto_1fr] gap-4 p-4"
>
	<SideBar />
	<TopBar />
	<FolderView />
</div>
