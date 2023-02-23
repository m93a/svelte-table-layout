<table>
	<slot />
</table>

<style lang="scss">
	table {
		display: grid;
		width: fit-content;
		grid-template-columns: 1fr 1fr 1fr;

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
