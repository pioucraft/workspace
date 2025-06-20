<script lang="ts">
	import { display, text, response } from './Prompt';
	var currentResponse: string = '';
</script>

{#if $display}
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
	>
		<div
			class="bg-ctp-base border-ctp-lavender text-ctp-text flex w-96 flex-col items-start gap-2 rounded-lg border-2 p-4 shadow-lg"
		>
			<p>{$text}</p>
			<input
				type="text"
				bind:value={currentResponse}
				class="text-ctp-text border-ctp-surface0 focus:border-ctp-peach w-full rounded-lg border-2 p-2 transition-colors outline-none"
				id="prompt-input"
			/>
			<button
				class="from-ctp-peach to-ctp-red cursor-pointer rounded-lg bg-gradient-to-br p-2 px-4 text-black transition-colors"
				onclick={() => {
					$response = currentResponse;
					currentResponse = '';
				}}>Done</button
			>
		</div>
	</div>
{/if}
