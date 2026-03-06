import type { ComponentChildren } from 'preact';
import { useState, useCallback, useMemo } from 'preact/hooks';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ComponentChildren;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectedRow?: T;
  rowKey: (row: T) => string | number;
}

export function Table<T>({
  columns,
  data,
  onRowClick,
  selectedRow,
  rowKey,
}: TableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = useCallback(
    (key: string) => {
      if (sortCol === key) setSortAsc((a) => !a);
      else { setSortCol(key); setSortAsc(true); }
    },
    [sortCol],
  );

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const va = (a as any)[sortCol], vb = (b as any)[sortCol];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [data, sortCol, sortAsc]);

  const selectedKey = selectedRow != null ? rowKey(selectedRow) : undefined;

  const cellStyle = {
    padding: '4px 8px',
    borderBottom: '1px solid var(--xb-border-default, #30363d)',
    fontSize: 'var(--xb-font-size-sm, 12px)',
  };

  return (
    <table
      class="xb-table"
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        color: 'var(--xb-text-primary, #e6edf3)',
      }}
    >
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              onClick={c.sortable ? () => handleSort(c.key) : undefined}
              style={{
                ...cellStyle,
                background: 'var(--xb-bg-secondary, #161b22)',
                fontWeight: 'bold',
                textAlign: 'left',
                cursor: c.sortable ? 'pointer' : 'default',
                userSelect: 'none',
              }}
            >
              {c.header}
              {sortCol === c.key ? (sortAsc ? ' \u25B2' : ' \u25BC') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => {
          const rk = rowKey(row);
          return (
            <tr
              key={rk}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{
                background: rk === selectedKey
                  ? 'var(--xb-bg-elevated, #21262d)'
                  : 'transparent',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map((c) => (
                <td key={c.key} style={cellStyle}>
                  {c.render ? c.render(row) : String((row as any)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
