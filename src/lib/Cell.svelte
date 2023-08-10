<script lang="ts">
	export let colspan: number | 'group' | 'row' = 1;
	export let rowspan: number = 1;
	export let header: boolean = false;

	// standard HTML attrs
	export let style: string = '';
	export let title: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
	export let innerThis: HTMLTableCellElement = undefined as any;
	export let data: Record<string, any> = {};
	let dataAttrs: Record<`data-${string}`, any>;
	$: dataAttrs = Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v]));

	$: allStyles = `
    --table-cell-colspan: ${colspan};
    --table-cell-rowspan: ${rowspan};
    ${style}
  `;

	type Action = (
		element: HTMLTableCellElement,
		params: any
	) => void | {
		update?: ((args: any) => void) | undefined;
		destroy?: (() => void) | undefined;
	};
	type Use = Action | [callback: Action, params: any];
	export let use: Use = () => void 0;

	$: [action, arg] = Array.isArray(use) ? use : [use];

	const asAny = (x: any) => x;
</script>

<svelte:element
	this={header ? 'th' : 'td'}
	bind:this={innerThis}
	{title}
	{id}
	class={klass}
	colspan={asAny(colspan)}
	{rowspan}
	style={allStyles}
	{...dataAttrs}
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
	use:action={arg}
>
	<slot />
</svelte:element>
