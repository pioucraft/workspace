<script lang="ts">
	import { ask } from '$lib/components/components/Prompt';
	import { loadFolderContent } from '$lib/scripts/filesystem';
	import { password, username } from '$lib/store/credentials';
	import { path } from '$lib/store/filesystem';
	import { get } from 'svelte/store';

	async function createFolder() {
		const response = await fetch('/api/filesystem', {
			method: 'POST',
			headers: {
				username: $username,
				password: $password,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				isDirectory: true,
				path: `${get(path)}/${await ask('Enter folder name:')}`
			})
		});
		if (!response.ok) {
			const error = await response.json();
			alert(`Error creating folder: ${error.error}`);
		}
		loadFolderContent();
	}

	async function createFile() {
		const response = await fetch('/api/filesystem', {
			method: 'POST',
			headers: {
				username: $username,
				password: $password,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				isDirectory: false,
				path: `${get(path)}/${await ask('Enter file name:')}`
			})
		});
		if (!response.ok) {
			const error = await response.json();
			alert(`Error creating file: ${error.error}`);
		}
		loadFolderContent();
	}

	async function uploadFile() {
		const fileOrFolder = document.createElement('input');
		fileOrFolder.type = 'file';
		fileOrFolder.attributes.setNamedItem(document.createAttribute('multiple'));
		fileOrFolder.attributes.setNamedItem(document.createAttribute('webkitdirectory'));
		fileOrFolder.click();
		fileOrFolder.onchange = async () => {
			const formData = new FormData();
			if (!fileOrFolder.files || fileOrFolder.files.length === 0) {
				return;
			}

			for (const file of fileOrFolder.files) {
				formData.append('files', file);
			}
			formData.append('path', get(path));

			await fetch('/api/filesystem/upload', {
				method: 'POST',
				headers: {
					username: $username,
					password: $password,
					contentType: 'multipart/form-data'
				},
				body: formData
			}).then(async (response) => {
				if (!response.ok) {
					const error = await response.json();
					alert(`Error uploading files: ${error.error}`);
				} else {
					loadFolderContent();
				}
			});
		};
	}
</script>

<div class="bg-ctp-base border-ctp-surface1 flex min-w-36 flex-col gap-2 rounded-lg border-1 p-2">
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 p-[6px] text-start transition-colors"
		onclick={createFolder}
	>
		+ Folder
	</button>
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 p-[6px] text-start transition-colors"
		onclick={createFile}
	>
		+ File
	</button>
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 p-[6px] text-start transition-colors"
		onclick={uploadFile}
	>
		+ Upload File
	</button>
</div>
