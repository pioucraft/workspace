<script lang="ts">
	import { password, username } from '$lib/store/credentials';
	import { fileContent } from '$lib/store/filesystem';
	import { path } from '$lib/store/filesystem';
	import { onDestroy } from 'svelte';

	let newFileContent = atob($fileContent);
	let { type: workFileType } = fetchMetadata(newFileContent);
	newFileContent = parseWorkFile(newFileContent, workFileType);

	let isSaved = true;

	let newInterval = setInterval(async () => {
		let fileContentToSave = unParseWorkFile(newFileContent, workFileType);
        console.log('Saving file content:', fileContentToSave);
		if ($fileContent !== btoa(fileContentToSave)) {
			await fetch('/api/filesystem', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					password: $password,
					username: $username
				},
				body: JSON.stringify({
					content: fileContentToSave,
					path: $path
				})
			});
			fileContent.set(btoa(fileContentToSave));
		}
		isSaved = unParseWorkFile(newFileContent, workFileType) === atob($fileContent);
	}, 3000);

	onDestroy(() => {
		clearInterval(newInterval);
	});

	function fetchMetadata(content: string) {
		try {
			const metadata = JSON.parse(content.split('\n')[0]);
			return metadata;
		} catch (error) {
			return { type: 'document' };
		}
	}

	function parseWorkFile(content: string, type: string): string {
		if (type === 'document') {
			let splittedParsedContent = content.split('\n').slice(1); // Remove metadata line

            splittedParsedContent = splittedParsedContent.map(line => {
                return line
            });

			return splittedParsedContent.join('\n');
		}
		return '';
	}

	function unParseWorkFile(content: string, type: string) {
		if (type === 'document') {
			let metadata = JSON.stringify({ type: 'document', version: '1.0' });

            if(content == "<br>") {
                return metadata + '\n';
            }

            let contentDom = new DOMParser().parseFromString(content, 'text/html');
            console.log(contentDom);
            
            return metadata + "\n" + content
		}
		return '';
	}
</script>

<div class="grid h-full w-full grid-rows-[2.5em_auto] gap-4">
	<div class="flex justify-between gap-6 px-2">
		{#if isSaved}
			<div class="bg-ctp-green w-fit rounded-full p-2 text-center text-black">Saved</div>
		{:else}
			<div class="bg-ctp-red w-fit rounded-full p-2 text-center text-black">Not Saved</div>
		{/if}
	</div>
	{#if workFileType == 'document'}
		<div
			oninput={() => (isSaved = false)}
			contenteditable="true"
			id="editor"
			bind:innerHTML={newFileContent}
		></div>
	{:else}
		<div class="bg-ctp-red rounded-lg p-4 text-black">
			<p>Unsupported file type: {workFileType}</p>
		</div>
	{/if}
</div>

<style>
	:global(#editor h1) {
		font-size: 2em;
	}
</style>
