import { get, writable, type Writable } from 'svelte/store';

export const display: Writable<boolean> = writable(false);
export const text: Writable<string> = writable('');
export const response: Writable<string> = writable('');

export async function ask(promptText: string): Promise<string> {
	display.set(true);
	text.set(promptText);

	// wait until the user has entered a response (wait until the response variable is not empty)
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			if (get(response) !== '') {
				clearInterval(interval);
				display.set(false);
				let responseText = get(response);
				response.set(''); // Clear the response for the next prompt
				resolve(responseText);
			}
		}, 50);
	});
}
