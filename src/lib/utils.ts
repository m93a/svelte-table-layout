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

export function colspanOfCell(cell: HTMLTableCellElement): number {
	return Math.max(1, parseInt(cell.getAttribute('colspan') ?? '1'));
}

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

/**
 * The bind operation for the "Maybe Monad", in TS represented by `T | undefined`
 */
export function mapOpt<T, S>(value: T | undefined, fn: (value: T) => S | undefined): S | undefined;
export function mapOpt<T, S>(value: T | undefined, fn: (value: T) => S | undefined, def: S): S;
export function mapOpt<T, S>(
	value: T | undefined,
	fn: (value: T) => S | undefined,
	def?: S
): S | undefined {
	return (value === undefined ? undefined : fn(value)) ?? def;
}
