# Svelte Table Layout

A dynamic table layout for Svelte, a drop-in replacement for HTML tables that use CSS grid under the hood. It lets you easily style columns and rows even if there are cells with nontrivial colspan & rowspan.

```svelte
<Table class="my-table">
	<tr style="background: gray">
		<td>grey</td>
		<td>row</td>
		<td>with no decoration</td>
	</tr>
	<tr style="background: pink; border: 1px solid red;">
		<td colspan={2}>pink row</td>
		<td>with red border</td>
	</tr>
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
	<tr>
		<td>a-really-long-cell</td>
		<td>normal-cell</td>
		<td>xd</td>
	</tr>
	<tr>
		<td colspan="row">lorem</td>
	</tr>
</Table>

<Table {columns}>
	<tr>
		<td>a</td>
		<td>b</td>
		<td>c</td>
	</tr>
	<tr>
		<td>d</td>
		<td>e</td>
		<td>f</td>
	</tr>
</Table>
```
