import { browser } from '$app/environment';
import { onDestroy, onMount } from 'svelte';

export type GridSize =
	| number
	| `${number}px`
	| `${number}em`
	| `${number}rem`
	| `${number}fr`
	| 'max-content';

// iterators
export function* rowsOfTable(table: HTMLTableElement): Iterable<HTMLTableRowElement> {
	for (const body of table.children) {
		for (const row of body.children) {
			if (!(row instanceof HTMLTableRowElement)) continue;
			yield row;
		}
	}
}
export function* cellsOfRow(row: HTMLTableRowElement): Iterable<HTMLTableCellElement> {
	for (const cell of row.children) {
		if (!(cell instanceof HTMLTableCellElement)) continue;
		yield cell;
	}
}

// parsing
export function colspanOfCell(cell: HTMLTableCellElement): number {
	return Math.max(1, parseInt(cell.getAttribute('colspan') ?? '1'));
}

// counting columns & rows
export function countColumsInRow(row: HTMLTableRowElement): number {
	let count = 0;
	for (const cell of cellsOfRow(row)) {
		count += colspanOfCell(cell);
	}
	return count;
}
export function countColumnsInTable(table: HTMLTableElement): number {
	let count = 0;
	for (const row of rowsOfTable(table)) {
		const c = countColumsInRow(row);
		count = Math.max(count, c);
	}

	return count;
}
export function setRowIndicesInTable(table: HTMLTableElement): void {
	let index = 1;
	for (const row of rowsOfTable(table)) {
		row.style.setProperty('--table-row-index', `${index++}`);
	}
}
export function setColumnIndicesInTable(table: HTMLTableElement): void {
	for (const row of rowsOfTable(table)) {
		let index = 1;
		for (const cell of cellsOfRow(row)) {
			cell.style.setProperty('--table-column-index', `${index}`);
			index += colspanOfCell(cell);
		}
	}
}

// compute column and row sizes
interface Dimensions {
	computedColumnWidths: number[];
	computedRowHeights: number[];
}
export function computeDimensions(table: HTMLTableElement): Dimensions {
	const style = getComputedStyle(table);

	const cols = style.gridTemplateColumns
		.split('px')
		.filter((s) => s !== '')
		.map(parseFloat);

	const rows = style.gridTemplateRows
		.split('px')
		.filter((s) => s !== '')
		.map(parseFloat);

	return {
		computedColumnWidths: cols,
		computedRowHeights: rows
	};
}
export function observeFirstRow(table: HTMLTableElement, observer: ResizeObserver): void {
	for (const row of rowsOfTable(table)) {
		for (const cell of cellsOfRow(row)) {
			observer.observe(cell);
		}
		break;
	}
}
export function observeFirstColumn(table: HTMLTableElement, observer: ResizeObserver): void {
	for (const row of rowsOfTable(table)) {
		for (const cell of cellsOfRow(row)) {
			observer.observe(cell);
			break;
		}
	}
}

// observe table
interface ObserverCallbacks {
	columnCountChanged: (n: number) => void;
	dimensionsChanged: (d: Dimensions) => void;
}
export function observe(
	getTable: () => HTMLTableElement,
	{ columnCountChanged, dimensionsChanged }: ObserverCallbacks
): void {
	if (!browser) return;

	let table: HTMLTableElement;

	const onResize = () => {
		dimensionsChanged(computeDimensions(table));
	};
	const onMutation = () => {
		columnCountChanged(countColumnsInTable(table));
		setRowIndicesInTable(table);
		setColumnIndicesInTable(table);

		resizeObserver.disconnect();
		resizeObserver.observe(table);
		observeFirstRow(table, resizeObserver);
		observeFirstColumn(table, resizeObserver);
	};

	const resizeObserver = new ResizeObserver(onResize);
	const mutationObserver = new MutationObserver(onMutation);

	onMount(() => {
		table = getTable();

		mutationObserver.observe(table, {
			attributes: true,
			attributeFilter: ['colspan'],
			childList: true,
			subtree: true
		});

		onMutation();
		onResize();
	});

	onDestroy(() => {
		mutationObserver.disconnect();
		resizeObserver.disconnect();
	});
}

/** The bind operation for the "Maybe Monad", in TS represented by `T | undefined` */
export function mapOpt<T, S>(value: T | undefined, fn: (value: T) => S | undefined): S | undefined;
export function mapOpt<T, S>(value: T | undefined, fn: (value: T) => S | undefined, def: S): S;
export function mapOpt<T, S>(
	value: T | undefined,
	fn: (value: T) => S | undefined,
	def?: S
): S | undefined {
	return (value === undefined ? undefined : fn(value)) ?? def;
}
