<script lang="ts">
	import { onMount, type Component } from 'svelte';

	var showContextMenu = $state(false);
	var mouseX = $state(0);
	var mouseY = $state(0);

	var { parentId, Element }: { parentId: string; Element: Component } = $props();

	onMount(() => {
		const parent = document.getElementById(parentId);
		if (!parent) {
			console.error(`Element with id ${parentId} not found.`);
			return;
		}

		parent.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			showContextMenu = true;
			mouseX = event.clientX;
			mouseY = event.clientY;
		});

		window.addEventListener('click', () => {
			showContextMenu = false;
		});
	});
</script>

{#if showContextMenu}
	<div class="absolute z-50" style="top: {mouseY}px; left: {mouseX}px;">
		<Element />
	</div>
{/if}
