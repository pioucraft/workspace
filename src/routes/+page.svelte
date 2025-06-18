<script lang="ts">
	import { password, username } from '$lib/store/credentials';
	import { onLoginConfirm } from '$lib/scripts/store';

	var folderContent = [];

	onLoginConfirm(async () => {});
</script>

<div
	class="bg-ctp-surface0 grid h-screen w-screen grid-cols-[300px_auto] grid-rows-[100px_auto] gap-4 p-4"
>
	<div class="bg-ctp-base row-span-2 rounded-3xl"></div>

	<div class="bg-ctp-base rounded-3xl"></div>

	<div class="bg-ctp-base rounded-3xl"></div>
</div>
