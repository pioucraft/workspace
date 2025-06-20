<script lang="ts">
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
				path: `${get(path)}/${prompt('Enter folder name:')}`
			})
		});
		if (!response.ok) {
			const error = await response.json();
			alert(`Error creating folder: ${error.error}`);
		}
		loadFolderContent();
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
	>
		+ File
	</button>
</div>
