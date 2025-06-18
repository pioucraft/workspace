<script lang="ts">
	import { password, username } from '$lib/store/credentials';
	import { onLoginConfirm } from '$lib/scripts/store';
    import Folder from '$lib/components/svg/Folder.svelte';
	import Document from '$lib/components/svg/Document.svelte';
	import type { folderContentType } from '$lib/types/fileSystem';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import ArrowUp from '$lib/components/svg/ArrowUp.svelte';

	var { data }: { data: { path: string } } = $props();
	var path = $state(data.path);

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

	function navigateToPath(newPath: string) {
		goto(`${page.url.origin}${newPath}`, {
			invalidateAll: true,
			replaceState: true
		});
		path = newPath;
		loadFolderContent();
	}
</script>

<div
	class="bg-ctp-surface0 grid h-screen w-screen grid-cols-[300px_auto] grid-rows-[auto_1fr] gap-4 p-4"
>
	<div
		class="bg-ctp-base hover:border-ctp-lavender row-span-2 rounded-3xl border-2 border-transparent transition-colors"
	></div>

	<div
		class="bg-ctp-base hover:border-ctp-lavender grid h-min grid-cols-[2em_1fr_8em] grid-rows-[2em_2em] justify-start gap-2 rounded-3xl border-2 border-transparent p-5 transition-colors"
	>
		<button
			class="flex justify-center items-center text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 transition-colors"
			onclick={() => {
				let newPath: any = path.split('/');
				newPath.pop();

				navigateToPath(newPath.join('/') || '/');
			}}><ArrowUp/></button
		>
		<span></span>
		<input
			class="text-ctp-text border-ctp-surface1 focus:border-ctp-peach hover:border-ctp-peach col-span-2 w-full rounded-full border-2 p-2 outline-none"
			bind:value={path}
			onchange={() => navigateToPath(path)}
		/>
		<button
			class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach r flex cursor-pointer items-center justify-center rounded-full border-2 p-2 text-center"
			>Search</button
		>
	</div>

	<div
		class="bg-ctp-base hover:border-ctp-lavender grid h-full auto-cols-[100px] grid-flow-col auto-rows-[100px] gap-5 rounded-3xl border-2 border-transparent p-5 transition-colors"
	>
		{#each folderContent as fileOrFolder}
			<button
				onclick={() => {
					navigateToPath(`${fileOrFolder.path}`);
				}}
				class="border-ctp-surface1 hover:border-ctp-peach text-ctp-text flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 transition-colors"
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
