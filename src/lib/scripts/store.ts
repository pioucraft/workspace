import { invalidateAll } from '$app/navigation';
import { password, username } from '$lib/store/credentials';
import { onMount } from 'svelte';

export function onLoginConfirm(callback: () => void) {
	onMount(() => {
		invalidateAll();
		password.subscribe((passwordValue) => {
			if (passwordValue) {
				username.subscribe((usernameValue) => {
					if (usernameValue) {
						callback();
					}
				});
			}
		});
	});
}
