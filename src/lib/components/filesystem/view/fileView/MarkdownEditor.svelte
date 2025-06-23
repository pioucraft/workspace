<script lang="ts">
	import { getEditableTextWithNewlines } from '$lib/scripts/scripts/getEditableTextWithNewlines';
	import { password, username } from '$lib/store/credentials';
	import { fileContent } from '$lib/store/filesystem';
	import { path } from '$lib/store/filesystem';
	import { onDestroy, onMount } from 'svelte';

	let newFileContent = atob($fileContent);
    let initialContent = newFileContent;
	let isSaved = true;

	let newInterval = setInterval(async () => {
		newFileContent = getEditableTextWithNewlines(
            document.getElementById('editor') as HTMLDivElement
        ); 

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

	onMount(() => {
		// whhen pasting text to the contenteditable div, make sure it's plain text
		const editor = document.getElementById('editor') as HTMLDivElement;

		editor.addEventListener('paste', (e: ClipboardEvent) => {
			e.preventDefault();

			const text = e.clipboardData?.getData('text/plain');
			if (!text) return;

			const selection = window.getSelection();
			if (!selection || !selection.rangeCount) return;

			// Remove current selection and insert plain text
			selection.deleteFromDocument();
			selection.getRangeAt(0).insertNode(document.createTextNode(text));

			// Move cursor after inserted text
			const range = selection.getRangeAt(0);
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);

			// Mark as not saved
			isSaved = false;
		});
	});

	onDestroy(() => {
		clearInterval(newInterval);
	});
</script>

<div class="grid h-full w-full grid-rows-[2.5em_auto] gap-4">
	{#if isSaved}
		<div class="bg-ctp-green w-fit rounded-full p-2 text-center text-black">Saved</div>
	{:else}
		<div class="bg-ctp-red w-fit rounded-full p-2 text-center text-black">Not Saved</div>
	{/if}

	<div oninput={() => (isSaved = false)} id="editor" contenteditable="true">{initialContent}</div>
</div>
