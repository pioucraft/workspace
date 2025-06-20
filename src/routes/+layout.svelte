<script lang="ts">
	import { onMount, tick } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { password, username } from '$lib/store/credentials';
	import { page } from '$app/state';
	import Prompt from '$lib/components/components/Prompt.svelte';

	let { children } = $props();

	onMount(async () => {
		await tick();
		if (page.url.pathname.startsWith('/login')) {
			return;
		}

		let localPassword = localStorage.getItem('password');
		password.set(atob(localPassword || ''));

		let localUsername = localStorage.getItem('username');
		username.set(localUsername || '');

		if (localPassword && localUsername) {
			try {
				const response = await fetch('/api/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username: localUsername,
						password: atob(localPassword)
					})
				});

				if (!response.ok) {
					goto('/login');
					throw new Error('Login failed');
				}
			} catch (error) {
				console.error('Error:', error);
				alert('Login failed. Please try again.');
			}
		} else {
			console.log('No credentials found in localStorage');
			goto('/login');
		}
	});
</script>

{@render children()}

<Prompt />
