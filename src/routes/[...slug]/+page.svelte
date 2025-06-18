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

	<div class="bg-ctp-base rounded-3xl p-5">
		<button
			class="text-ctp-text cursor-pointer"
			onclick={() => {
				let newPath: any = path.split('/');
				newPath.pop();
				path = newPath.join('/');

				// make sure there's a leading slash
				if (!path.startsWith('/')) {
					path = '/' + path;
				}

				goto(`${page.url.origin}${path}`, {
					invalidateAll: true,
					replaceState: true
				});

				loadFolderContent();
			}}>&#60;-</button
		>
	</div>

	<div
		class="bg-ctp-base grid auto-cols-[100px] grid-flow-col auto-rows-[100px] gap-5 rounded-3xl p-5"
	>
		{#each folderContent as fileOrFolder}
			<button
				onclick={() => {
					goto(`${page.url.origin}${fileOrFolder.path}`, {
						invalidateAll: true,
						replaceState: true
					});
					path = fileOrFolder.path;
					loadFolderContent();
				}}
				class="border-ctp-surface1 hover:bg-ctp-surface2 text-ctp-text flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 transition-colors"
			>
				{#if fileOrFolder.isDirectory}
					<Folder />
				{:else}
					<Document />
				{/if}
				<span class="text-ctp-text text-sm">{fileOrFolder.name}</span>
			</button>
		{/each}
	</div>
</div>
