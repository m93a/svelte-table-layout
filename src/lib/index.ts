// Reexport your entry components here

import Table from './Table.svelte';
import Row from './Row.svelte';
import Cell from './Cell.svelte';

export default Object.assign(Table, { Row, Cell });
export { Row, Cell };
