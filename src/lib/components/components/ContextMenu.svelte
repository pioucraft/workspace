<script lang="ts">
	import { onMount } from 'svelte';

	var showContextMenu = $state(false);
	var mouseX = $state(0);
	var mouseY = $state(0);

	var {
		parentsQuery,
		Element,
		negativeQuery,
		props
	}: { parentsQuery: string; Element: any; negativeQuery?: string; props?: any } = $props();

	onMount(() => {
		window.addEventListener('contextmenu', (event) => {
			const parents = document.querySelectorAll(parentsQuery);
			for (let i = 0; i < parents.length; i++) {
				if (!parents[i].contains(event.target as Node)) {
					showContextMenu = false;
					return; // Prevent context menu if clicked outside the specified parent elements
				}
			}

			if (negativeQuery) {
				const negativeElements = document.querySelectorAll(negativeQuery);
				for (let j = 0; j < negativeElements.length; j++) {
					if (negativeElements[j].contains(event.target as Node)) {
						showContextMenu = false;
						return; // Prevent context menu if clicked on a negative element
					}
				}
			}

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
		<Element {...props} />
	</div>
{/if}
