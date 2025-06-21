<script>
	import { path, fileContent } from '$lib/store/filesystem';
	import ImageView from './ImageView.svelte';
	import TextEditor from './TextEditor.svelte';

	let viewUnsupportedType = false;
</script>

<div
	class="text-ctp-text bg-ctp-base hover:border-ctp-lavender border-ctp-surface1 h-full overflow-auto rounded-3xl border-2 p-5 transition-colors"
>
	{#if $path.endsWith('.jpg') || $path.endsWith('.png') || $path.endsWith('.gif')}
		<ImageView />
	{:else if $path.endsWith('.txt')}
		<TextEditor />
	{:else if viewUnsupportedType}
		<div class="h-full w-full">
			<textarea class="h-full w-full" readonly>{atob($fileContent)}</textarea>
		</div>
	{:else}
		<p class="text-ctp-text">Unsupported file type: {$path}</p>
		<button
			class="bg-ctp-blue mt-4 cursor-pointer rounded-full px-4 py-2 text-black"
			on:click={() => (viewUnsupportedType = true)}
		>
			View Unsupported Type
		</button>
	{/if}
</div>
