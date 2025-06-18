<script lang="ts">
	import { password, username } from '$lib/store/credentials';
	import { onLoginConfirm } from '$lib/scripts/store';
	import Folder from '$lib/svg/Folder.svelte';
	import Document from '$lib/svg/Document.svelte';
	import type { folderContentType } from '$lib/types/fileSystem';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	var { data }: { data: { path: string } } = $props();
	var path = data.path;

	var folderContent: folderContentType[] = $state([]);

	onLoginConfirm(async () => {
		await loadFolderContent();
	});

	async function loadFolderContent() {
		const folderContentFetch = await fetch(`/api/filesystem?path=${path}`, {
			headers: {
				password: $password,
				username: $username
			}
		});
		if (folderContentFetch.ok) {
			folderContent = (await folderContentFetch.json())['folderContent'];
		} else {
			console.error('Failed to fetch folder content:', folderContentFetch.statusText);
		}
	}
</script>

<div
	class="bg-ctp-surface0 grid h-screen w-screen grid-cols-[300px_auto] grid-rows-[100px_auto] gap-4 p-4"
>
	<div class="bg-ctp-base row-span-2 rounded-3xl"></div>

	<div class="bg-ctp-base rounded-3xl"></div>

	<div class="bg-ctp-base rounded-3xl">
		{#each folderContent as fileOrFolder}
			<button
				onclick={() => {
					goto(`${page.url.origin}${fileOrFolder.path}`);
                    path = fileOrFolder.path;
					loadFolderContent();
				}}
			>
				{#if fileOrFolder.isDirectory}
					<Folder />
				{:else}
					<Document />
				{/if}
			</button>
		{/each}
	</div>
</div>
