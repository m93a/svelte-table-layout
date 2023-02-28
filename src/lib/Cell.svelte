<script lang="ts">
	export let colspan: number | 'group' | 'row' = 1;
	export let rowspan: number = 1;
	export let header: boolean = false;

	// standard HTML attrs
	export let style: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
	let that: HTMLTableCellElement = undefined as any;
	export { that as this };

	$: allStyles = `
    --table-cell-colspan: ${colspan};
    --table-cell-rowspan: ${rowspan};
    ${style}
  `;

	const asAny = (x: any) => x;
</script>

{#if header}
	<th
		bind:this={that}
		{id}
		class={klass}
		colspan={asAny(colspan)}
		{rowspan}
		style={allStyles}
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
		<slot />
	</th>
{:else}
	<td
		bind:this={that}
		{id}
		class={klass}
		colspan={asAny(colspan)}
		{rowspan}
		style={allStyles}
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
		<slot />
	</td>
{/if}

<style lang="scss">
	td {
		grid-column: var(--table-column-index) / span var(--table-cell-colspan);
		grid-row: var(--table-row-index) / span var(--table-cell-rowspan);
	}
</style>
