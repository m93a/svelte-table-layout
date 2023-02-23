<script lang="ts">
	import { mapOpt } from './utils';

	export let colspan: number = 1;
	$: colspanCSS = `span ${colspan}`;
</script>

<td {colspan} style:grid-column-end={colspanCSS}>
	<slot />
</td>
