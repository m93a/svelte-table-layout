<script lang="ts">
	import { Table } from './lib/index.js';
	let columns: number[] = [];
</script>

<h1>Svelte Table Layout</h1>
A table layout created using CSS Grid and JS mutation observers. The goal is to provide a replacement
for classic HTML tables with some new features, like decimal point alignment or sticky rows.

<h2>Simple table</h2>

<p>
	First table:
	<Table>
		<tr>
			<td>1</td>
			<td>helou</td>
			<td>asdf 4</td>
		</tr>
		<tr>
			<td>abc</td>
			<td>x</td>
			<td>b</td>
		</tr>
	</Table>
</p>

<p>
	Second table:

	<Table>
		<tbody>
			<tr>
				<td>yo</td>
				<td>wazup</td>
				<td>my dudes & dudettes</td>
				<td>next cell</td>
			</tr>
			<tr>
				<td>lorem</td>
				<td>ipsum</td>
				<td>sup</td>
				<td>i'm doin great</td>
			</tr>
		</tbody>
	</Table>
</p>

<h2>Colspan and rowspan</h2>
<Table>
	<tr>
		<td>lil</td>
		<td colspan={2} style="background: lightblue">widewidewide</td>
		<td rowspan={2} style="background: lightpink">tall</td>
		<td>wa</td>
	</tr>
	<tr>
		<td>smol</td>
		<td>tiny</td>
		<td>mimi</td>
		<td>nunu</td>
	</tr>
</Table>

<h2>Colored rows</h2>
<Table>
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

<h2>Copying table dimensions</h2>
<p>
	Template table:
	<Table bind:computedColumnWidths={columns}>
		<tr>
			<td>a-really-long-cell</td>
			<td>normal-cell</td>
			<td>xd</td>
		</tr>
		<tr>
			<td>lorem</td>
			<td>ipsum</td>
			<td>dolor-sit</td>
		</tr>
	</Table>
</p>
<p>
	Reflecting table:
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
</p>

<h2>Column groups</h2>
<Table columns={[{ span: 1 }, { span: 2 }, { span: 1 }, { span: 1 }]}>
	<tr>
		<td colspan="row">this cell spans the entire row</td>
	</tr>
	<tr>
		<td>a</td>
		<td>b</td>
		<td>c</td>
		<td>d</td>
		<td>e</td>
	</tr>
	<tr>
		<td>1</td>
		<td colspan="group">2</td>
		<td colspan="row">2</td>
	</tr>
</Table>
