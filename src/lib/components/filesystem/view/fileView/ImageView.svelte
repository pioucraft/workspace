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

<div class="flex flex-col items-center justify-center w-full h-full">
	<img src={base64ToImageUrl()} alt="Image" class="block w-full h-full object-contain" />
</div>
