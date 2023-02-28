<script lang="ts">
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { mapOpt, observe, type ColumnsSpec, type Grid } from './utils';

	export let columns: ColumnsSpec | undefined = undefined;
	const columns$ = writable<typeof columns>(columns);
	$: columns$.set(columns);

	// standard HTML attrs
	export let style: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
	let table: HTMLTableElement = undefined as any;
	export { table as this };

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

	$: templateCols = mapOpt(
		columns,
		(c) =>
			`grid-template-columns: ${grid.columns
				.map(({ group }) => {
					const w = group?.width;
					if (w === undefined) return 'max-content';
					if (typeof w === 'number') return `${w}px`;
					return w;
				})
				.join(' ')};`,
		''
	);

	$: allStyles = `
    --table-column-count: ${grid.columns.length};
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

<table bind:this={table} style={allStyles} {id} class={klass} class:ssr={!browser}>
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
		grid-template-columns: repeat(var(--table-column-count), max-content);

		:global(colgroup),
		:global(tbody),
		:global(thead),
		:global(tfoot),
		:global(tr),
		:global(th) {
			display: contents;
		}

		:global(tr) {
			:global(td) {
				display: inline;
			}
		}
	}
</style>
