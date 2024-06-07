import { BROWSER } from 'esm-env';
import { onMount, tick } from 'svelte';
import type { Readable } from 'svelte/store';

export type GridSize =
	| number
	| `${number}px`
	| `${number}em`
	| `${number}rem`
	| `${number}fr`
	| 'max-content';

export interface FullColumnSpec {
	width?: GridSize;
	style?: string;
	span?: number;
}

export type ColumnsSpec = number | (GridSize | FullColumnSpec)[];

// iterators
function* rowsOfTable(table: HTMLTableElement): Iterable<HTMLTableRowElement> {
	yield* table.querySelectorAll('tr');
}
function* cellsOfRow(row: HTMLTableRowElement): Iterable<HTMLTableCellElement> {
	yield* row.querySelectorAll('td');
	yield* row.querySelectorAll('th');
}

// parsing
function colspanOfCell(cell: HTMLTableCellElement): number | 'group' | 'row' {
	const attr = cell.getAttribute('colspan') ?? '1';
	if (attr === 'group' || attr === 'row') return attr;
	return Math.max(1, parseInt(attr));
}
function rowspanOfCell(cell: HTMLTableCellElement): number {
	const attr = cell.getAttribute('rowspan') ?? '1';
	return Math.max(1, parseInt(attr));
}
function fillInColumnSpec(cols: ColumnsSpec | undefined): FullColumnSpec[] {
	if (cols === undefined) return [];
	if (typeof cols === 'number') {
		return Array(cols)
			.fill(1)
			.map(() => ({}));
	}
	return cols.map((c) => {
		if (typeof c === 'object') return c;
		return { width: c };
	});
}

// gridmaking
interface GridCell {
	colspan: number;
	rowspan: number;
	forceColspan?: boolean;
	element: HTMLTableCellElement;
}
interface GridRow {
	children: GridCell[];

	// placing a cell with rowspan > 1 in the last row will result
	// in a grid row without a corresponding HTML table row element
	element?: HTMLTableRowElement;
}
interface GridColumn {
	children: GridCell[];
	group?: FullColumnSpec;
}
export interface Grid {
	rows: GridRow[];
	columns: GridColumn[];
}

function makeTableGrid(table: HTMLTableElement, colspec: FullColumnSpec[]) {
	const grid: Grid = { rows: [], columns: [] };

	// Step #1
	// pre-populate columns & rows
	for (const spec of colspec) {
		const span = spec.span ?? 1;
		for (let i = 0; i < span; i++) {
			grid.columns.push({ group: spec, children: [] });
		}
	}
	for (const row of rowsOfTable(table)) {
		grid.rows.push({ element: row, children: [] });
	}

	// Step #2
	// collect cells, ignoring rowspan and colspan
	const cells: HTMLTableCellElement[][] = [];
	for (const row of grid.rows) {
		const children: HTMLTableCellElement[] = [];
		cells.push(children);

		const el = row.element;
		if (!el) continue;

		for (const cell of cellsOfRow(el)) {
			children.push(cell);
		}
	}

	// Step #3
	// place cells into grid, filling colspan=row by the longest row yet
	let maxColIndex = grid.columns.length - 1;
	for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
		let colIndex = 0;
		for (const element of cells[rowIndex]) {
			// move to the next free space
			while (grid.rows[rowIndex].children[colIndex] !== undefined) colIndex++;
			if (colIndex > maxColIndex) maxColIndex = colIndex;

			// the colspan specified by the user
			const specifiedColspan = colspanOfCell(element);
			const forceColspan = typeof specifiedColspan === 'string';

			// the maximum colspan the cell would like to take
			let intendedColspan: number;
			if (specifiedColspan === 'row') intendedColspan = maxColIndex - colIndex + 1;
			else if (specifiedColspan === 'group')
				intendedColspan = findGroupEnd(grid.columns, colIndex) - colIndex + 1;
			else intendedColspan = specifiedColspan;

			// the actual colspan: the intended colspan shortened by already placed multirow cells
			const colspan = Math.min(intendedColspan, availableSpace(grid.rows[rowIndex], colIndex));

			// place down the cell
			const rowspan = rowspanOfCell(element);
			const cell: GridCell = { element, colspan, rowspan, forceColspan };
			for (let i = rowIndex; i < rowIndex + rowspan; i++) {
				for (let j = colIndex; j < colIndex + colspan; j++) {
					grid.rows[i] ??= { children: [] };
					grid.rows[i].children[j] = cell;
				}
			}
			maxColIndex = Math.max(maxColIndex, grid.rows[rowIndex].children.length - 1);
		}
	}

	// Step #4
	// expand the cells with colspan=row to the end of the row
	for (const row of grid.rows) {
		const cell = row.children.at(-1);
		if (!cell || colspanOfCell(cell.element) !== 'row') continue;

		let index = row.children.length - 1;
		const freeSpace = index - maxColIndex;
		if (freeSpace <= 0) continue;

		cell.colspan += freeSpace;
		for (; index <= maxColIndex; index++) {
			row.children[index] = cell;
		}
	}

	// Step #5
	// update columns to match rows
	for (let rowIndex = 0; rowIndex < grid.rows.length; rowIndex++) {
		for (let colIndex = 0; colIndex <= maxColIndex; colIndex++) {
			grid.columns[colIndex] ??= { children: [] };
			grid.columns[colIndex].children[rowIndex] = grid.rows[rowIndex].children[colIndex];
		}
	}

	return grid;
}

/**
 * Given grid columns and the index of the current column, returns
 * the index of the last column that belongs to the same group.
 */
function findGroupEnd(cols: GridColumn[], index: number): number {
	const group = cols[index].group;
	if (group === undefined) return index;
	while (index < cols.length && group === cols[index].group) index++;
	return index - 1;
}

/**
 * Given a row and the index of the current cell, returns the maximum
 * colspan available before running into an already placed cell.
 */
function availableSpace(row: GridRow, index: number): number {
	const startingIndex = index;
	while (index <= row.children.length && row.children[index] === undefined) index++;
	if (index > row.children.length) return Infinity;
	return index - startingIndex;
}

// counting columns & rows
function setIndicesInGrid(grid: Grid): void {
	const cellVarAlreadyAdded = new Set<Element>();
	// row vars
	for (let rowIndex = 0; rowIndex < grid.rows.length; rowIndex++) {
		const row = grid.rows[rowIndex];
		row.element?.style.setProperty('--c-ri', `${rowIndex + 1}`);

		for (let colIndex = 0; colIndex < row.children.length; colIndex++) {
			const cell = row.children[colIndex];
			const el = cell.element;

			addToArgument(el, 'data-column', `${colIndex + 1}`);
			addToArgument(el, 'data-row', `${rowIndex + 1}`);

			if (cellVarAlreadyAdded.has(el)) continue;

			el.style.setProperty('--c-ci', `${colIndex + 1}`);
			if (cell.forceColspan) el.style.setProperty('--c-cs', cell.colspan.toString());

			cellVarAlreadyAdded.add(el);
		}
	}
}

function addToArgument(element: Element, attr: string, value: string) {
	const oldStr = element.getAttribute(attr);
	const arr = oldStr?.split(' ');

	if (!arr) return element.setAttribute(attr, value);
	if (arr.includes(value)) return;

	arr.push(value);
	element.setAttribute(attr, arr.join(' '));
}

// compute column and row sizes
interface Dimensions {
	computedColumnWidths: number[];
	computedRowHeights: number[];
}

function computeDimensions(table: HTMLTableElement): Dimensions {
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
function observeFirstRow(table: HTMLTableElement, observer: ResizeObserver): void {
	table
		.querySelector('tr')
		?.querySelectorAll('td,th')
		.forEach((cell) => observer.observe(cell));
}
function observeFirstColumn(table: HTMLTableElement, observer: ResizeObserver): void {
	const elem = table.querySelector('tr td,tr th');

	if (elem) observer.observe(elem);
}

// observe table
interface ObserverParams {
	getTable: () => HTMLTableElement;
	columnSpec: Readable<ColumnsSpec | undefined>;
	gridChanged: (n: Grid) => void;
	dimensionsChanged: (d: Dimensions) => void;
}
export function observe({
	getTable,
	columnSpec,
	gridChanged,
	dimensionsChanged
}: ObserverParams): void {
	if (!BROWSER) return;

	let table: HTMLTableElement;
	let colspec: FullColumnSpec[] = [];

	onMount(() => {
		const onResize = () => {
			dimensionsChanged(computeDimensions(table));
		};

		const onMutation = () => {
			const grid = makeTableGrid(table, colspec);

			gridChanged(grid);
			setIndicesInGrid(grid);

			resizeObserver.disconnect();
			resizeObserver.observe(table);

			observeFirstRow(table, resizeObserver);
			observeFirstColumn(table, resizeObserver);
		};

		const resizeObserver = new ResizeObserver(onResize);
		const mutationObserver = new MutationObserver(onMutation);

		table = getTable();

		mutationObserver.observe(table, {
			attributes: true,
			attributeFilter: ['colspan'],
			childList: true,
			subtree: true
		});

		const unobserve = columnSpec.subscribe(async (c) => {
			colspec = fillInColumnSpec(c);

			await tick();

			onMutation();
			onResize();
		});

		return () => {
			mutationObserver.disconnect();
			resizeObserver.disconnect();
			unobserve();
		};
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
