<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { asset, resolve } from '$app/paths';
	import { rooms, roomUrl } from '#lib/rooms.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let open = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>komu-if · IF B Pagi 14</title>
	<meta name="description" content="One class, every room different. IF B Pagi, angkatan 14." />
</svelte:head>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<header class="border-b border-line">
	<nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
		<a href={resolve('/')} class="font-display text-2xl leading-none">komu-if</a>
		<div class="flex items-center gap-6 text-sm text-mute">
			<span class="hidden sm:block">IF B Pagi · Angkatan 14</span>
			<details class="relative" bind:open>
				<summary
					class="flex cursor-pointer list-none items-center gap-1.5 text-ink [&::-webkit-details-marker]:hidden"
				>
					Rooms
					<span class="font-mono text-xs text-mute tabular-nums">{rooms.length}</span>
					<svg
						viewBox="0 0 16 16"
						class="size-3.5 transition-transform duration-200 {open ? 'rotate-180' : ''}"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg
					>
				</summary>
				<ul
					class="absolute right-0 z-10 mt-3 max-h-80 w-60 overflow-y-auto rounded-xs border border-line bg-wall p-1"
				>
					{#each rooms as r (r.handle)}
						<li>
							<a
								href={roomUrl(r)}
								data-sveltekit-reload
								class="block rounded-xs px-3 py-2 text-ink hover:bg-line">{r.name}</a
							>
						</li>
					{:else}
						<li class="px-3 py-2">No rooms yet.</li>
					{/each}
				</ul>
			</details>
		</div>
	</nav>
</header>

{@render children()}

<footer class="mt-16 border-t border-line">
	<figure class="relative w-full aspect-[1200/404] overflow-hidden bg-wall">
		<img
			src={asset('footer.webp')}
			alt="Teman-teman IF B Pagi Angkatan 14 berfoto di kelas"
			width="1200"
			height="404"
			loading="lazy"
			class="absolute inset-0 size-full object-cover"
		/>
		<div
			class="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_90%,rgb(255_170_70_/_0.22),transparent_62%),radial-gradient(ellipse_at_82%_70%,rgb(120_100_200_/_0.15),transparent_66%),linear-gradient(rgb(8_6_12_/_0.45),rgb(8_6_12_/_0.85))]"
			aria-hidden="true"
		></div>
		<figcaption
			class="absolute inset-x-0 bottom-0 p-6 font-display text-2xl text-ink sm:text-3xl md:p-8"
		>
			IF B Pagi · Angkatan 14
		</figcaption>
	</figure>
	<div
		class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-mute"
	>
		<a href="https://github.com/iTeguh08/komu-if" class="hover:text-ink">Source on GitHub</a>
		<a
			href="https://github.com/iTeguh08/komu-if/blob/master/docs/RULES.md"
			class="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
			>Add your room</a
		>
	</div>
</footer>
