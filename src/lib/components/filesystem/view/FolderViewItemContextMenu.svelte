<script lang="ts">
	import { ask } from '$lib/components/components/Prompt';
	import { loadFolderContent } from '$lib/scripts/filesystem';
	import { password, username } from '$lib/store/credentials';
	import type { folderContentType } from '$lib/types/fileSystem';

	var { fileOrFolder }: { fileOrFolder: folderContentType } = $props();

	async function rename() {
		const newPath = await ask('Enter new name:', fileOrFolder.path);

		const response = await fetch('/api/filesystem', {
			method: 'PATCH',
			headers: {
				password: $password,
				username: $username,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				oldPath: fileOrFolder.path,
				newPath: newPath
			})
		});
		if (!response.ok) {
			const error = await response.json();
			alert(`Error renaming: ${error.error}`);
		} else {
			loadFolderContent();
		}
	}

	async function remove() {
		if (!confirm(`Are you sure you want to delete ${fileOrFolder.name}?`)) {
			return;
		}
		const response = await fetch('/api/filesystem', {
			method: 'DELETE',
			headers: {
				password: $password,
				username: $username,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				path: fileOrFolder.path
			})
		});
		if (!response.ok) {
			const error = await response.json();
			alert(`Error deleting: ${error.error}`);
		} else {
			loadFolderContent();
		}
	}

	function copy() {
		const newPath = prompt('Enter new name:', fileOrFolder.path);
		if (!newPath) return;

		fetch('/api/filesystem/copy', {
			method: 'POST',
			headers: {
				password: $password,
				username: $username,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				oldPath: fileOrFolder.path,
				newPath: newPath
			})
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((error) => {
						throw new Error(`Error copying: ${error.error}`);
					});
				}
				loadFolderContent();
			})
			.catch((error) => alert(error.message));
	}
</script>

<div class="bg-ctp-base border-ctp-surface1 flex min-w-36 flex-col gap-2 rounded-lg border-1 p-2">
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 p-[6px] text-start transition-colors"
		onclick={rename}
	>
		~ Rename
	</button>
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 p-[6px] text-start transition-colors"
		onclick={remove}
	>
		- Delete
	</button>
	<button
		class="text-ctp-text border-ctp-surface1 hover:border-ctp-peach cursor-pointer rounded-lg border-2 p-[6px] text-start transition-colors"
		onclick={copy}
	>
		~ Copy
	</button>
</div>
