<script lang="ts">
	import { password, username } from '$lib/store/credentials';
	import { fileContent } from '$lib/store/filesystem';
	import { path } from '$lib/store/filesystem';
	import { onDestroy } from 'svelte';

	let newFileContent = atob($fileContent);
	let isSaved = true;

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
	{#if isSaved}
		<div class="bg-ctp-green w-fit rounded-full p-2 text-center text-black">Saved</div>
	{:else}
		<div class="bg-ctp-red w-fit rounded-full p-2 text-center text-black">Not Saved</div>
	{/if}

	<textarea
		placeholder="Start typing here..."
		class="text-ctp-text outline-none"
		bind:value={newFileContent}
		oninput={() => (isSaved = false)}
	></textarea>
</div>
