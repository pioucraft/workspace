<script lang="ts">
	import BookOpen from '$lib/components/svg/BookOpen.svelte';
	import Pencil from '$lib/components/svg/Pencil.svelte';
	import { password, username } from '$lib/store/credentials';
	import { fileContent } from '$lib/store/filesystem';
	import { path } from '$lib/store/filesystem';
	import { marked } from 'marked';
	import { onDestroy } from 'svelte';

	let newFileContent = atob($fileContent);
	let isSaved = true;
	let renderMarkdown = false;

	let newInterval = setInterval(async () => {
		if ($path)
			if ($fileContent !== btoa(newFileContent)) {
				await fetch('/api/filesystem', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						password: $password,
						username: $username
					},
					body: JSON.stringify({
						content: newFileContent,
						path: $path
					})
				});
				fileContent.set(btoa(newFileContent));
			}
		isSaved = true;
	}, 3000);

	onDestroy(() => {
		clearInterval(newInterval);
	});
</script>

<div class="grid h-full w-full grid-rows-[2.5em_auto] gap-4">
	<div class="flex justify-between gap-6 px-2">
		{#if isSaved}
			<div class="bg-ctp-green w-fit rounded-full p-2 text-center text-black">Saved</div>
		{:else}
			<div class="bg-ctp-red w-fit rounded-full p-2 text-center text-black">Not Saved</div>
		{/if}

		{#if renderMarkdown}
			<button class="cursor-pointer" onclick={() => (renderMarkdown = false)}><BookOpen /></button>
		{:else}
			<button class="cursor-pointer" onclick={() => (renderMarkdown = true)}><Pencil /></button>
		{/if}
	</div>

	{#if renderMarkdown}
		<div class="markdown-preview">
			{@html marked.parse(newFileContent)}
		</div>
	{:else}
		<textarea
			placeholder="Start typing here..."
			class="text-ctp-text outline-none"
			bind:value={newFileContent}
			oninput={() => (isSaved = false)}
		></textarea>
	{/if}
</div>

<style>
    :global(.markdown-preview h1) {
        font-size: 2em;
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    :global(.markdown-preview h2) {
        font-size: 1.5em;
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    :global(.markdown-preview h3) {
        font-size: 1.25em;
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    :global(.markdown-preview h4) {
        font-size: 1em;
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    :global(.markdown-preview h5) {
        font-size: 0.875em;
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    :global(.markdown-preview h6) {
        font-size: 0.75em;
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    :global(.markdown-preview blockquote) {
        border-left: 4px solid #ccc;
        padding-left: 1em;
        margin: 1em 0;
    }
</style>
