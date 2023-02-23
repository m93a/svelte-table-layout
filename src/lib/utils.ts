export function countColumsInRow(row: HTMLTableRowElement): number {
	let count = 0;
	for (const cell of row.children) {
		count += Math.max(1, parseInt(cell.getAttribute('colspan') ?? '1'));
	}
  return count;
}
export function countColumnsInTable(table: HTMLTableElement): number {
  let count = 0;
  for (const body of table.children) {
    for (const row of body.children) {
      const c = countColumsInRow(row as any);
      count = Math.max(count, c);
    }
  }
  return count;
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
