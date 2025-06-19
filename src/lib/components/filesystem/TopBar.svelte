<script lang="ts">
	import ArrowUp from '../svg/ArrowUp.svelte';
	import { path } from '$lib/store/filesystem';
	import { get } from 'svelte/store';
	import { navigateToPath } from '$lib/scripts/filesystem';
</script>

<div
	class="bg-ctp-base border-ctp-surface1 hover:border-ctp-lavender grid h-min grid-cols-[2em_1fr_8em] grid-rows-[2em_2em] justify-start gap-2 rounded-3xl border-2 p-5 transition-colors"
>
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach flex cursor-pointer items-center justify-center rounded-lg border-2 transition-colors"
		onclick={() => {
			let newPath: any = get(path).split('/');
			newPath.pop();

			navigateToPath(newPath.join('/'));
		}}><ArrowUp /></button
	>
	<span></span>
	<input
		class="text-ctp-text border-ctp-surface1 focus:border-ctp-peach hover:border-ctp-peach col-span-2 w-full rounded-full border-2 p-2 outline-none"
		bind:value={$path}
		onchange={() => navigateToPath($path)}
	/>
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach r flex cursor-pointer items-center justify-center rounded-full border-2 p-2 text-center"
		>Search</button
	>
</div>
