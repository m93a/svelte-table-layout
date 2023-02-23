<script>
	import Table, { Row, Cell } from '$lib';
</script>

<h1>Svelte Table Layout</h1>
A table layout created using CSS Grid and JS mutation observers. The goal is to provide a replacement
for classic HTML tables with some new features, like decimal point alignment or sticky rows.

<h2>Simple table</h2>

<p>
	First table:
	<Table>
		<Table.Row>
			<Table.Cell>1</Table.Cell>
			<Table.Cell>helou</Table.Cell>
			<Table.Cell>asdf 4</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Cell>abc</Table.Cell>
			<Table.Cell>x</Table.Cell>
			<Table.Cell>b</Table.Cell>
		</Table.Row>
	</Table>
</p>

<p>
	Second table:

	<Table>
		<Row>
			<Cell>yo</Cell>
			<Cell>wazup</Cell>
			<Cell>my dudes & dudettes</Cell>
			<Cell>next cell</Cell>
		</Row>
		<Row>
			<Cell>lorem</Cell>
			<Cell>ipsum</Cell>
			<Cell>sup</Cell>
			<Cell>i'm doin great</Cell>
		</Row>
	</Table>
</p>

<h2>Colspan and rowspan</h2>
<Table>
	<Row>
		<Cell>lil</Cell>
		<Cell colspan={2} style="background: lightblue">widewidewide</Cell>
		<Cell rowspan={2} style="background: lightpink">tall</Cell>
		<Cell>wa</Cell>
	</Row>
	<Row>
		<Cell>smol</Cell>
		<Cell>tiny</Cell>
		<Cell>mimi</Cell>
		<Cell>nunu</Cell>
	</Row>
</Table>

<h2>Colored rows</h2>
<Table>
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
