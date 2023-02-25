<script lang="ts">
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

<table bind:this={table} style={allStyles} {id} class={klass}>
	<tbody>
		<slot />
	</tbody>
</table>

<style lang="scss">
	table {
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
