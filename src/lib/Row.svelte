<script lang="ts">
	// standard HTML attrs
	export let style: string | undefined = undefined;
	export let title: string = '';
	export let id: string | undefined = undefined;
	let klass: string | undefined = undefined;
	export { klass as class };
	let that: HTMLTableRowElement = undefined as any;
	export { that as innerThis };
	export let data: Record<string, any> = {};

	let dataAttrs: Record<`data-${string}`, any>;
	$: dataAttrs = Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v]));
</script>

<tr
	bind:this={that}
	{title}
	{id}
	{style}
	class={klass}
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
>
	<slot />
</tr>
