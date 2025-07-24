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
				return '<div><br></div>';
			}

			splittedParsedContent = splittedParsedContent.map((line) => {
				if (line == '') {
					return '<div><br></div>';
				} else {
					return parseDocumentLine(line, undefined);
				}
			});

			return splittedParsedContent.join('');
		}
		return '';
	}

	function parseDocumentLine(line: string, uuid: string | undefined): string {
		if (uuid == undefined) {
			uuid = crypto.randomUUID();
		}
		if (line.startsWith('# ')) {
			return `<h1 data-uuid='${uuid}'>${line}</h1>`;
		} else if (line.startsWith('## ')) {
			return `<h2 data-uuid='${uuid}'>${line}</h2>`;
		} else if (line.startsWith('### ')) {
			return `<h3 data-uuid='${uuid}'>${line}</h3>`;
		} else if (line.startsWith('#### ')) {
			return `<h4 data-uuid='${uuid}'>${line}</h4>`;
		} else if (line.startsWith('##### ')) {
			return `<h5 data-uuid='${uuid}'>${line}</h5>`;
		} else if (line.startsWith('###### ')) {
			return `<h6 data-uuid='${uuid}'>${line}</h6>`;
		} else if (line.startsWith('> ') || line.startsWith('&gt; ')) {
			return `<blockquote data-uuid='${uuid}'>${line}</blockquote>`;
		}
		return `<div data-uuid='${uuid}'>${line}</div>`;
	}

	function parseDocumentLineLive() {
		let editor = document.getElementById('editor') as HTMLDivElement;

        // Because of some contenteditable quirks, we need to ensure that the first child is wrapped in a div to make everything else work properly.
		let firstChild = editor.firstChild as Node;
		// @ts-ignore
		if (firstChild.tagName == undefined) {
			console.log('firstChild is not an element, creating a new div');
			console.log(`<div>${firstChild.textContent}</div>`);
			editor.innerHTML = `<div>${firstChild.textContent}</div>`;
			// set the carret position to the end of the newly created div
			let range = document.createRange();
			let selection = window.getSelection();
			// @ts-ignore
			range.setStart(editor.firstChild as ChildNode, editor.firstChild.textContent.length);
			range.collapse(true);
			selection?.removeAllRanges();
			selection?.addRange(range);
			return;
		}

        // Now, we can parse the content of the editor
		let selection = window.getSelection();
		let selectedElement = selection?.anchorNode as HTMLElement;
		if (selectedElement == editor) return;

        // for the caret position, later...
		let selectionOffset = selection?.anchorOffset || 0;

		let parentElement = selectedElement.parentElement as HTMLElement;
		if (parentElement == editor) return;

		let uuid = crypto.randomUUID();
		parentElement.outerHTML = parseDocumentLine(parentElement.innerHTML || '', uuid);
		parentElement = document.querySelector(`[data-uuid='${uuid}']`) as HTMLElement;

        // place the caret at the correct position
		let range = document.createRange();
		range.setStart(parentElement.firstChild as ChildNode, selectionOffset);
		range.collapse(true);
		let newSelection = window.getSelection();
		newSelection?.removeAllRanges();
		newSelection?.addRange(range);
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

	function setInitialInnerHTML(node: HTMLElement) {
		node.innerHTML = newFileContent;
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
                newFileContent = (document.getElementById('editor') as HTMLDivElement).innerHTML;
				isSaved = false;
				parseDocumentLineLive();
			}}
			contenteditable="true"
			id="editor"
			use:setInitialInnerHTML
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
	:global(#editor h2) {
		font-size: 1.5em;
	}
	:global(#editor h3) {
		font-size: 1.17em;
	}
	:global(#editor h4) {
		font-size: 1em;
	}
	:global(#editor h5) {
		font-size: 0.83em;
	}
	:global(#editor h6) {
		font-size: 0.67em;
	}
	:global(#editor blockquote) {
		margin: 0;
		padding: 0.5em 1em;
		border-left: 4px solid #ccc;
	}
</style>
