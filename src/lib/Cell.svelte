<script lang="ts">
	export let colspan: number = 1;
	export let rowspan: number = 1;

	// standard HTML attrs
	export let style: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };

	$: allStyles = `
    grid-column: var(--table-column-index) / span ${colspan};
    grid-row: var(--table-row-index) / span ${rowspan};
    ${style}
  `;
</script>

<td {id} class={klass} {colspan} {rowspan} style={allStyles}>
	<slot />
</td>
