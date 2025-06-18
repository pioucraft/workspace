<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { password, username } from '$lib/store/credentials';

	let { children } = $props();

	onMount(async () => {
		if (window.location.pathname.startsWith('/login')) {
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
			goto('/login');
		}
	});
</script>

{@render children()}
