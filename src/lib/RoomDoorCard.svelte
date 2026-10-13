<script lang="ts">
	import type { Room } from '#lib/rooms.ts';
	import { roomUrl } from '#lib/rooms.ts';

	type Props = { room: Room };
	let { room }: Props = $props();
	const glow = $derived(room.accent ?? 'var(--color-accent)');
</script>

<a
	href={roomUrl(room)}
	data-sveltekit-reload
	style:--glow={glow}
	aria-label="Pintu {room.door_code}, {room.name}"
	class="door-card group relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xs border border-line bg-wall transition-[border-color,box-shadow] duration-200 hover:border-(--glow) hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--glow)_35%,transparent)] focus-visible:border-(--glow) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
>
	<div class="relative isolate min-h-0 flex-[1.2] overflow-hidden px-5 pt-5 pb-3">
		<svg
			class="pointer-events-none absolute inset-x-5 top-4 bottom-5 text-line transition-colors duration-200 group-hover:text-(--glow)"
			viewBox="0 0 100 118"
			fill="none"
			preserveAspectRatio="xMidYMid meet"
			aria-hidden="true"
		>
			<rect x="1" y="1" width="98" height="116" stroke="currentColor" stroke-width="1.25" />
			<rect x="7" y="7" width="86" height="104" stroke="currentColor" stroke-width="0.75" opacity="0.55" />
			<path
				d="M7 7 H93 M7 7 Q50 20 93 7"
				stroke="currentColor"
				stroke-width="1.25"
				stroke-linecap="round"
			/>
			<line x1="50" y1="12" x2="50" y2="108" stroke="currentColor" stroke-width="1.25" />
			<line x1="7" y1="111" x2="93" y2="111" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			<circle cx="11" cy="26" r="1.1" fill="currentColor" opacity="0.7" />
			<circle cx="11" cy="48" r="1.1" fill="currentColor" opacity="0.7" />
			<circle cx="11" cy="70" r="1.1" fill="currentColor" opacity="0.7" />
			<circle cx="89" cy="26" r="1.1" fill="currentColor" opacity="0.7" />
			<circle cx="89" cy="48" r="1.1" fill="currentColor" opacity="0.7" />
			<circle cx="89" cy="70" r="1.1" fill="currentColor" opacity="0.7" />
			<rect x="38" y="96" width="24" height="8" stroke="currentColor" stroke-width="0.75" opacity="0.45" />
		</svg>
		<span
			class="relative z-10 flex h-full items-center justify-center font-mono text-5xl tabular-nums tracking-tight text-ink drop-shadow-[0_2px_8px_rgb(0_0_0/0.65)] transition-colors duration-200 group-hover:text-(--glow) sm:text-6xl"
		>{room.door_code}</span>
	</div>

	<div
		class="relative z-20 shrink-0 border-t-2 border-line bg-wall px-4 py-4 shadow-[0_-12px_28px_rgb(0_0_0/0.55)]"
	>
		<h2 class="font-display text-xl leading-snug text-ink sm:text-2xl">{room.name}</h2>
		<p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/75">{room.tagline}</p>
	</div>
</a>
