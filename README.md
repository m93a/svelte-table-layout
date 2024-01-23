# Svelte Table Layout

A dynamic table layout for Svelte, a drop-in replacement for HTML tables that use CSS grid under the hood. It lets you easily style columns and rows even if there are cells with nontrivial colspan & rowspan.

```svelte
<Table class="my-table">
	<Row style="background: gray">
		<Cell>grey</Cell>
		<Cell>row</Cell>
		<Cell>with no decoration</Cell>
	</Row>
	<Row style="background: pink; border: 1px solid red;">
		<Cell colspan={2}>pink row</Cell>
		<Cell>with red border</Cell>
	</Row>
</Table>

<style>
	/* make all cells that intersect the third column bold */
	:global(.my-table [data-column~='3']) {
		font-weight: bold;
	}
</style>
```

It also supports `colspan=row` to make cells span the entire row, and lets you align the columns of two different tables.

```svelte
<Table bind:computedColumnWidths={columns}>
	<Row>
		<Cell>a-really-long-cell</Cell>
		<Cell>normal-cell</Cell>
		<Cell>xd</Cell>
	</Row>
	<Row>
		<Cell colspan="row">lorem</Cell>
	</Row>
</Table>

<Table {columns}>
	<Row>
		<Cell>a</Cell>
		<Cell>b</Cell>
		<Cell>c</Cell>
	</Row>
	<Row>
		<Cell>d</Cell>
		<Cell>e</Cell>
		<Cell>f</Cell>
	</Row>
</Table>
```
