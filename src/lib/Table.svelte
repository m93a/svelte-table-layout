<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { writable } from 'svelte/store';
	import { observe, type ColumnsSpec, type Grid } from './utils';

	export let columns: ColumnsSpec | undefined = undefined;
	const columns$ = writable<typeof columns>(columns);
	$: columns$.set(columns);

	export let columnSizing: string = 'max-content';

	// standard HTML attrs
	export let style: string = '';
	export let title: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
	let table: HTMLTableElement = undefined as any;
	export { table as this };
	export let data: Record<string, any> = {};
	let dataAttrs: Record<`data-${string}`, any>;
	$: dataAttrs = Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v]));

	export let headStyle: string = '';
	export let headId: string | undefined = undefined;
	export let headClass: string | undefined = undefined;
	export let thead: HTMLTableSectionElement = undefined as any;
	export let bodyStyle: string = '';
	export let bodyId: string | undefined = undefined;
	export let bodyClass: string | undefined = undefined;
	export let tbody: HTMLTableSectionElement = undefined as any;
	export let footStyle: string = '';
	export let footId: string | undefined = undefined;
	export let footClass: string | undefined = undefined;
	export let tfoot: HTMLTableSectionElement = undefined as any;

	// output props
	export let computedColumnWidths: number[] = [];
	export let computedRowHeights: number[] = [];
	export let grid: Grid = { rows: [], columns: [] };

	$: templateCols = `grid-template-columns: ${grid.columns
		.map(({ group }) => {
			const w = group?.width;
			if (w === undefined) return 'var(--table-column-sizing)';
			if (typeof w === 'number') return `${w}px`;
			return w;
		})
		.join(' ')};`;

	$: allStyles = `
    --table-column-count: ${grid.columns.length};
		--table-column-sizing: ${columnSizing};
    ${templateCols}
    ${style}
  `;

	// Observe the table's DOM
	observe({
		getTable: () => table,
		columnSpec: columns$,
		gridChanged: (g) => (grid = g),
		dimensionsChanged: (d) => {
			computedColumnWidths = d.computedColumnWidths;
			computedRowHeights = d.computedRowHeights;
		}
	});
</script>

<table
	bind:this={table}
	style={allStyles}
	{id}
	{title}
	class={klass}
	class:ssr={!BROWSER}
	{...dataAttrs}
	on:click
	on:mousedown
	on:mouseup
	on:mouseenter
	on:mouseleave
	on:mousemove
	on:pointerdown
	on:pointerup
	on:pointerenter
	on:pointerleave
	on:pointermove
	on:pointerout
	on:pointerout
	on:pointercancel
	on:keydown
	on:keypress
	on:keyup
>
	{#if $$slots.head}
		<thead bind:this={thead} style={headStyle} id={headId} class={headClass}>
			<slot name="head" />
		</thead>
	{/if}
	<tbody bind:this={tbody} style={bodyStyle} id={bodyId} class={bodyClass}>
		<slot />
	</tbody>
	{#if $$slots.foot}
		<tfoot bind:this={tfoot} style={footStyle} id={footId} class={footClass}>
			<slot name="foot" />
		</tfoot>
	{/if}
</table>

<style lang="scss">
	table {
		font-variant-numeric: tabular-nums;
	}

	table:not(.ssr) {
		display: grid;
		width: fit-content;
		grid-template-columns: repeat(var(--table-column-count), var(--table-column-sizing));

		:global(colgroup),
		:global(tbody),
		:global(thead),
		:global(tfoot),
		:global(tr) {
			display: contents;
		}

		:global(tr::before) {
			content: '';
			grid-row-start: var(--table-row-index);
			grid-row-end: span 1;
			grid-column-start: 1;
			grid-column-end: span var(--table-column-count);
			background: inherit;
			border: inherit;
		}

		:global(tr) {
			:global(td),
			:global(th) {
				// display: inline;
				grid-column: var(--table-column-index) / span var(--table-cell-colspan);
				grid-row: var(--table-row-index) / span var(--table-cell-rowspan);
			}
		}
	}
</style>
