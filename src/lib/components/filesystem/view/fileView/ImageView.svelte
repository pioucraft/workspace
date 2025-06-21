<script lang="ts">
	import { fileContent } from '$lib/store/filesystem';
	import { path } from '$lib/store/filesystem';

	function base64ToImageUrl(): string {
		let fileType = '';
		if ($path.endsWith('.jpg')) {
			fileType = 'image/jpeg';
		} else if ($path.endsWith('.png')) {
			fileType = 'image/png';
		} else if ($path.endsWith('.gif')) {
			fileType = 'image/gif';
		}
		return `data:${fileType};base64,${$fileContent}`;
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<img src={base64ToImageUrl()} alt="Image" class="block h-full w-full object-contain" />
</div>
