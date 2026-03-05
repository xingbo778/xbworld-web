/**
 * Lightweight table sorting — replaces jquery.tablesorter for basic use cases.
 *
 * Usage: initTableSort('#my_table', { sortList: [[2, 0]] })
 *   sortList: array of [columnIndex, direction] where 0=asc, 1=desc
 */

export function initTableSort(selector: string, options?: { sortList?: number[][] }): void {
  const table = document.querySelector(selector) as HTMLTableElement | null;
  if (!table) return;

  const thead = table.tHead;
  if (!thead) return;

  const headers = thead.querySelectorAll('th');
  headers.forEach((th, colIdx) => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const currentDir = th.dataset.sortDir === 'asc' ? 'desc' : 'asc';
      // Clear all other headers
      headers.forEach(h => {
        h.dataset.sortDir = '';
        h.classList.remove('tablesorter-headerAsc', 'tablesorter-headerDesc');
      });
      th.dataset.sortDir = currentDir;
      th.classList.add(currentDir === 'asc' ? 'tablesorter-headerAsc' : 'tablesorter-headerDesc');
      sortTable(table, colIdx, currentDir === 'asc' ? 0 : 1);
    });
  });

  // Apply initial sort
  if (options?.sortList) {
    for (const [col, dir] of options.sortList) {
      if (col < headers.length) {
        const dirStr = dir === 0 ? 'asc' : 'desc';
        headers[col].dataset.sortDir = dirStr;
        headers[col].classList.add(dirStr === 'asc' ? 'tablesorter-headerAsc' : 'tablesorter-headerDesc');
        sortTable(table, col, dir);
      }
    }
  }
}

function sortTable(table: HTMLTableElement, colIdx: number, direction: number): void {
  const tbody = table.tBodies[0];
  if (!tbody) return;

  const rows = Array.from(tbody.rows);
  rows.sort((a, b) => {
    const aText = a.cells[colIdx]?.textContent?.trim() ?? '';
    const bText = b.cells[colIdx]?.textContent?.trim() ?? '';
    // Try numeric sort first
    const aNum = parseFloat(aText);
    const bNum = parseFloat(bText);
    let cmp: number;
    if (!isNaN(aNum) && !isNaN(bNum)) {
      cmp = aNum - bNum;
    } else {
      cmp = aText.localeCompare(bText);
    }
    return direction === 0 ? cmp : -cmp;
  });

  for (const row of rows) {
    tbody.appendChild(row);
  }
}
