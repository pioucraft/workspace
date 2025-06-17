<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(async () => {
		if (window.location.pathname.startsWith('/login')) {
			return;
		}
		let password = localStorage.getItem('password') || '';
		let username = localStorage.getItem('username') || '';
		password = atob(password);

		if (username && password) {
			try {
				const response = await fetch('/api/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username, password })
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
