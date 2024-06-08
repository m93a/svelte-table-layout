<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { writable } from 'svelte/store';
	import { observe, type ColumnsSpec, type Grid } from './utils.js';

	export let columns: ColumnsSpec | undefined = undefined;
	const columns$ = writable<typeof columns>(columns);
	$: columns$.set(columns);

	export let columnSizing: string = 'max-content';

	// standard HTML attrs
	export let style: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
	export let innerThis: HTMLTableElement = undefined as any;
	export let data: Record<string, any> = {};

	let dataAttrs: Record<`data-${string}`, any>;
	$: dataAttrs = Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v]));

	// output props
	export let computedColumnWidths: number[] = [];
	export let computedRowHeights: number[] = [];
	export let grid: Grid = { rows: [], columns: [] };

	$: templateCols = grid.columns
		.map(({ group }) => {
			const w = group?.width;
			if (w === undefined) return 'var(--t-cs)';
			if (typeof w === 'number') return `${w}px`;
			return w;
		})
		.join(' ');

	// Observe the table's DOM
	observe({
		getTable: () => innerThis,
		columnSpec: columns$,
		gridChanged: (g) => (grid = g),
		dimensionsChanged: (d) => {
			computedColumnWidths = d.computedColumnWidths;
			computedRowHeights = d.computedRowHeights;
		}
	});
</script>

<table
	bind:this={innerThis}
	style:--t-cc={grid.columns.length}
	style:--t-cs={columnSizing}
	style:grid-template-columns={templateCols}
	{style}
	{id}
	{title}
	class={klass}
	class:ssr={!BROWSER}
	{...dataAttrs}
>
	<slot />
</table>

<style lang="scss">
	@use './Hacks.scss';

	// --t-cc = column count
	// --t-cs = column sizing

	// --t-ri

	table {
		font-variant-numeric: tabular-nums;
	}

	table:not(.ssr) {
		display: grid;
		width: fit-content;
		grid-template-columns: repeat(var(--t-cc), var(--t-cs));

		:global(colgroup),
		:global(tbody),
		:global(thead),
		:global(tfoot),
		:global(tr) {
			display: grid;
			grid-template-columns: subgrid;
			grid-column: 1 / -1;
		}

		:global(tr) {
			grid-template-rows: subgrid;
			grid-row: var(--r-ri) / span var(--r-rs, 1);

			:global(td),
			:global(th) {
				grid-column: var(--c-ci) / span var(--c-cs, 1);
				grid-row: span var(--c-rs, 1);
			}
		}
	}
</style>
