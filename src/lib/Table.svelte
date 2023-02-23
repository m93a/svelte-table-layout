<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { countColumnsInTable, setColumnIndicesInTable, setRowIndicesInTable } from './utils';
	let table: HTMLTableElement;
	let columnCount: number = 0;

	// standard HTML attrs
	export let style: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };

	$: allStyles = `
    --table-column-count: ${columnCount};
    ${style}
  `;

	// Observe the table's DOM
	const onChange = () => {
		columnCount = countColumnsInTable(table);
		setRowIndicesInTable(table);
		setColumnIndicesInTable(table);
	};
	const observer = browser ? new MutationObserver(onChange) : undefined;
	onMount(() => {
		observer!.observe(table, {
			attributes: true,
			attributeFilter: ['colspan'],
			childList: true,
			subtree: true
		});
		onChange();
	});
	onDestroy(() => {
		observer?.disconnect();
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
		grid-template-columns: repeat(var(--table-column-count), 1fr);

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