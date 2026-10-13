<script lang="ts">
	import RoomDoorCard from '#lib/RoomDoorCard.svelte';
	import { rooms } from '#lib/rooms.ts';

	const tags = [...new Set(rooms.flatMap((r) => r.tags ?? []))].sort();
	let active = $state<string | null>(null);
	const shown = $derived(active ? rooms.filter((r) => r.tags?.includes(active!)) : rooms);
</script>

<main class="mx-auto max-w-7xl px-5 py-8">
	<h1 class="sr-only">Class rooms</h1>

	{#if tags.length}
		<div class="mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by tag">
			{#each [null, ...tags] as t (t)}
				<button
					type="button"
					aria-pressed={active === t}
					onclick={() => (active = t)}
					class="shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200 {active ===
					t
						? 'border-accent bg-accent text-wall'
						: 'border-line text-mute hover:text-ink'}"
				>
					{t ?? 'all'}
				</button>
			{/each}
		</div>
	{/if}

	{#if rooms.length === 0}
		<p class="py-24 font-display text-3xl text-mute">No rooms yet. Be the first.</p>
	{:else if shown.length === 0}
		<p class="py-24 text-mute">
			Nothing tagged <span class="font-mono text-ink">{active}</span>.
			<button class="text-ink underline underline-offset-4" onclick={() => (active = null)}
				>Clear filter</button
			>
		</p>
	{:else}
		<ul class="columns-2 gap-4 md:columns-3 xl:columns-4">
			{#each shown as r, i (r.handle)}
				<li class="reveal mb-4 break-inside-avoid" style:--i={i}>
					<RoomDoorCard room={r} />
				</li>
			{/each}
		</ul>
	{/if}
</main>
