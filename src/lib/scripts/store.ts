import { password, username } from '$lib/store/credentials';
import { onMount } from 'svelte';

export function onLoginConfirm(callback: () => void) {
    onMount(() => {
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
