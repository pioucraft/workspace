<script>
	import Document from '$lib/components/svg/Document.svelte';
	import Folder from '$lib/components/svg/Folder.svelte';
	import { navigateToPath } from '$lib/scripts/filesystem';
	import { folderContent } from '$lib/store/filesystem';
</script>

<div
	class="bg-ctp-base hover:border-ctp-lavender border-ctp-surface1 grid h-full auto-cols-[100px] grid-flow-col auto-rows-[100px] gap-5 rounded-3xl border-2 p-5 transition-colors"
>
	{#each $folderContent as fileOrFolder}
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
