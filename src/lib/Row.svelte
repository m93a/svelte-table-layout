<script lang="ts">
	// standard HTML attrs
	export let style: string | undefined = undefined;
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
  let that: HTMLTableRowElement = undefined as any;
  export { that as this };
</script>

<tr bind:this={that} {id} {style} class={klass}>
	<slot />
</tr>

<style lang="scss">
	tr::before {
		content: '';
		grid-row-start: var(--table-row-index);
		grid-row-end: span 1;
		grid-column-start: 1;
		grid-column-end: span var(--table-column-count);
		background: inherit;
		border: inherit;
	}
</style>
