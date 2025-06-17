<script lang="ts">
	import { goto } from "$app/navigation";

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
            
            goto("/")
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        }
    }
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
				type="text"
				bind:value={username}
				class="bg-ctp-surface1 text-ctp-text focus:ring-ctp-peach h-10 w-full rounded-full px-4 transition-colors duration-300 focus:ring-2 focus:outline-none"
				placeholder="Enter your username"
			/>
		</div>
		<div class="w-[420px]">
			<p class="mb-1">Password</p>
			<input
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
