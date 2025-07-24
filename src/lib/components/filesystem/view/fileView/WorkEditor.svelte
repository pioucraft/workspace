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
			if (splittedParsedContent.length == 0) {
                return "<div><br></div>"
			}

			splittedParsedContent = splittedParsedContent.map((line) => {
                if(line == "") {
					return '<div><br></div>';
				} else {
                    return parseDocumentLine(line);
				}
			});

            console.log(splittedParsedContent)
			return splittedParsedContent.join("");
		}
		return '';
	}

    function parseDocumentLine(line: string): string {
        if (line.startsWith("# ")) {
            return `<h1>${line}</h1>`;
        }
        return `<div>${line}</div>`;
    }

    function parseDocumentLineLive() {
        let editor = document.getElementById("editor") as HTMLDivElement;
        console.log(editor.innerHTML);

        let firstChild = editor.firstChild as Node;
        // @ts-ignore
        if(firstChild.tagName == undefined) {
            editor.innerHTML = `<div>${firstChild.textContent}</div>`;
            // set the carret position to the end of the newly created div
            let range = document.createRange();
            let selection = window.getSelection();
            // @ts-ignore
            range.setStart(editor.firstChild, editor.firstChild.textContent.length);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
            return;
        }
    }

	function unParseWorkFile(content: string, type: string) {
		if (type === 'document') {
			let metadata = JSON.stringify({ type: 'document', version: '1.0' });

			if (content == '<br>') {
				return metadata + '\n';
			}

			let contentDom = new DOMParser().parseFromString(content, 'text/html');
            let lines: string[] = [];
			let childrenNodes = contentDom.body.children;

			for (let i = 0; i < childrenNodes.length; i++) {
				if (childrenNodes[i].innerHTML == '<br>') {
					lines.push('');
				} else {
					lines.push(childrenNodes[i].textContent || '');
				}
			}

			return metadata + '\n' + lines.join('\n');
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
			oninput={() => {
                isSaved = false;
                parseDocumentLineLive();
            }}
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
