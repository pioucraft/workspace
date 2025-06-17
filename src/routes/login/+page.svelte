<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	var password = '';
	var username = '';

	async function login() {
		if (username === '' || password === '') {
			alert('Please fill in both fields.');
			return;
		}

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				throw new Error('Login failed');
			}

			localStorage.setItem('username', username);
			localStorage.setItem('password', btoa(password));

			goto('/'); // Redirect to the home page after successful login
		} catch (error) {
			console.error('Error:', error);
			alert('Login failed. Please try again.');
		}
	}

	onMount(() => {
		window.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {
				if (document.activeElement?.id === 'username') {
					document.getElementById('password')?.focus();
				} else if (document.activeElement?.id === 'password') {
					login();
				} else {
					document.getElementById('username')?.focus();
				}
			}
		});
	});
</script>

<div class="bg-ctp-surface0 text-ctp-text flex h-screen w-screen items-center justify-center gap-5">
	<div
		class="bg-ctp-base border-ctp-lavender flex flex-col items-center justify-center gap-5 rounded-lg border-2 p-10 shadow-lg"
	>
		<h1 class="text-3xl font-bold">Sign in</h1>
		<p>Enter your login credentials to continue :</p>
		<div class="mt-8 w-[420px]">
			<p class="mb-1">Username</p>
			<input
				id="username"
				type="text"
				bind:value={username}
				class="bg-ctp-surface1 text-ctp-text focus:ring-ctp-peach h-10 w-full rounded-full px-4 transition-colors duration-300 focus:ring-2 focus:outline-none"
				placeholder="Enter your username"
			/>
		</div>
		<div class="w-[420px]">
			<p class="mb-1">Password</p>
			<input
				id="password"
				type="password"
				bind:value={password}
				class="bg-ctp-surface1 text-ctp-text focus:ring-ctp-peach h-10 w-full rounded-full px-4 transition-colors duration-300 focus:ring-2 focus:outline-none"
				placeholder="Enter your password"
			/>
		</div>
		<button
			on:click={login}
			class="from-ctp-peach to-ctp-red mt-5 h-10 w-[420px] cursor-pointer rounded-full bg-gradient-to-br font-semibold text-black transition-colors duration-300 hover:bg-slate-500"
		>
			Sign in
		</button>
	</div>
</div>
