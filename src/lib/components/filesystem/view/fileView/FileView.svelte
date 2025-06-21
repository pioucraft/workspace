<script>
	import { path } from '$lib/store/filesystem';
	import ImageView from './ImageView.svelte';
	import TextEditor from './TextEditor.svelte';
</script>

<div
	class="text-ctp-text bg-ctp-base hover:border-ctp-lavender border-ctp-surface1 h-full rounded-3xl border-2 p-5 transition-colors"
>
	{#if $path.endsWith('.jpg') || $path.endsWith('.png') || $path.endsWith('.gif')}
		<ImageView />
	{:else if $path.endsWith('.txt')}
		<TextEditor />
	{:else}
		<p class="text-ctp-text">Unsupported file type: {$path}</p>
	{/if}
</div>
