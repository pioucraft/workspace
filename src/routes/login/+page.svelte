<div class="w-screen h-screen flex gap-5 items-center justify-center bg-ctp-surface0 text-ctp-text">
    <div class="bg-ctp-base p-10 flex flex-col justify-center items-center gap-5 border-2 border-ctp-lavender rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold">Sign in</h1>
        <p>Enter your login credentials to continue :</p>
        <div class="mt-8 w-[420px]">
            <p class="mb-1">Username</p>
            <input type="text" bind:value={username} class="w-full h-10 bg-ctp-surface1 text-ctp-text rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-ctp-peach transition-colors duration-300" placeholder="Enter your username">
        </div>
        <div class="w-[420px]">
            <p class="mb-1">Password</p>
            <input type="password" bind:value={password} class="w-full h-10 bg-ctp-surface1 text-ctp-text rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-ctp-peach transition-colors duration-300" placeholder="Enter your password">
        </div>
        <button on:click={login} class="w-[420px] h-10 bg-gradient-to-br from-ctp-peach to-ctp-red text-black cursor-pointer rounded-full font-semibold mt-5 hover:bg-slate-500 transition-colors duration-300">
            Sign in
        </button>

    </div>
</div>

