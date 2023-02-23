<script lang="ts">
	import { mapOpt, observe, type GridSize } from './utils';
	let table: HTMLTableElement;
	let columnCount: number = 0;

	export let columns: GridSize[] | undefined = undefined;

	// standard HTML attrs
	export let style: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };

	// output props
	export let computedColumnWidths: number[] = [];
	export let computedRowHeights: number[] = [];

	$: templateCols = mapOpt(
		columns,
		(c) =>
			`grid-template-columns: ${c.map((s) => (typeof s === 'number' ? s + 'px' : s)).join(' ')};`,
		''
	);

	$: allStyles = `
    --table-column-count: ${columnCount};
    ${templateCols}
    ${style}
  `;

	// Observe the table's DOM
	observe(() => table, {
		columnCountChanged: (c) => (columnCount = c),
		dimensionsChanged: (d) => {
			computedColumnWidths = d.computedColumnWidths;
			computedRowHeights = d.computedRowHeights;
		}
	});

	$: console.log('dimensions: ', computedColumnWidths, computedRowHeights);
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

		:global(tr),
		:global(th),
		:global(tbody),
		:global(thead) {
			display: contents;
		}

		:global(tr) {
			:global(td) {
				display: inline;
			}
		}
	}
</style>
