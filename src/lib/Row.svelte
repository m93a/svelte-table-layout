<script lang="ts">
	// standard HTML attrs
	export let style: string | undefined = undefined;
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
</script>

<tr {id} {style} class={klass}>
	<slot />
</tr>

<style lang="scss">
	tr::before {
		content: '';
		grid-row-start: var(--table-row-index);
		grid-column-start: 1;
		grid-column-end: span var(--table-column-count);
		background: inherit;
		border: inherit;
	}
</style>
