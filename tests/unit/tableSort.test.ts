/**
 * Unit tests for utils/tableSort.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';

function makeTable(rows: string[][]): { table: HTMLTableElement; cleanup: () => void } {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const colCount = rows[0]?.length ?? 0;
  for (let i = 0; i < colCount; i++) {
    const th = document.createElement('th');
    th.textContent = `Col${i}`;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const cells of rows) {
    const tr = document.createElement('tr');
    for (const text of cells) {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  table.id = 'test-sort-table';
  document.body.appendChild(table);
  return { table, cleanup: () => document.body.removeChild(table) };
}

describe('initTableSort', () => {
  it('is exported as a function', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    expect(typeof initTableSort).toBe('function');
  });

  it('does not throw when selector matches nothing', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    expect(() => initTableSort('#nonexistent-table-xyz')).not.toThrow();
  });

  it('does not throw on table without thead', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const table = document.createElement('table');
    table.id = 'headless-table';
    document.body.appendChild(table);
    expect(() => initTableSort('#headless-table')).not.toThrow();
    document.body.removeChild(table);
  });

  it('applies initial sort in ascending order', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const { table, cleanup } = makeTable([
      ['Banana', '2'],
      ['Apple', '1'],
      ['Cherry', '3'],
    ]);

    initTableSort('#test-sort-table', { sortList: [[0, 0]] });

    const rows = Array.from(table.tBodies[0].rows);
    expect(rows[0].cells[0].textContent).toBe('Apple');
    expect(rows[1].cells[0].textContent).toBe('Banana');
    expect(rows[2].cells[0].textContent).toBe('Cherry');
    cleanup();
  });

  it('applies initial sort in descending order', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const { table, cleanup } = makeTable([
      ['Banana', '2'],
      ['Apple', '1'],
      ['Cherry', '3'],
    ]);

    initTableSort('#test-sort-table', { sortList: [[0, 1]] });

    const rows = Array.from(table.tBodies[0].rows);
    expect(rows[0].cells[0].textContent).toBe('Cherry');
    expect(rows[1].cells[0].textContent).toBe('Banana');
    expect(rows[2].cells[0].textContent).toBe('Apple');
    cleanup();
  });

  it('sorts numeric column numerically (not lexicographically)', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const { table, cleanup } = makeTable([
      ['10'],
      ['9'],
      ['100'],
    ]);

    initTableSort('#test-sort-table', { sortList: [[0, 0]] });

    const rows = Array.from(table.tBodies[0].rows);
    expect(rows[0].cells[0].textContent).toBe('9');
    expect(rows[1].cells[0].textContent).toBe('10');
    expect(rows[2].cells[0].textContent).toBe('100');
    cleanup();
  });

  it('clicking a column header sorts that column ascending', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const { table, cleanup } = makeTable([
      ['Zebra'],
      ['Ant'],
      ['Monkey'],
    ]);

    initTableSort('#test-sort-table');

    const th = table.tHead!.querySelectorAll('th')[0];
    th.click();

    const rows = Array.from(table.tBodies[0].rows);
    expect(rows[0].cells[0].textContent).toBe('Ant');
    expect(rows[1].cells[0].textContent).toBe('Monkey');
    expect(rows[2].cells[0].textContent).toBe('Zebra');
    cleanup();
  });

  it('clicking column header twice reverses sort to descending', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const { table, cleanup } = makeTable([
      ['Zebra'],
      ['Ant'],
      ['Monkey'],
    ]);

    initTableSort('#test-sort-table');

    const th = table.tHead!.querySelectorAll('th')[0];
    th.click(); // asc
    th.click(); // desc

    const rows = Array.from(table.tBodies[0].rows);
    expect(rows[0].cells[0].textContent).toBe('Zebra');
    expect(rows[1].cells[0].textContent).toBe('Monkey');
    expect(rows[2].cells[0].textContent).toBe('Ant');
    cleanup();
  });

  it('sets cursor:pointer on th elements', async () => {
    const { initTableSort } = await import('@/utils/tableSort');
    const { table, cleanup } = makeTable([['A'], ['B']]);

    initTableSort('#test-sort-table');

    const th = table.tHead!.querySelectorAll('th')[0];
    expect(th.style.cursor).toBe('pointer');
    cleanup();
  });
});
