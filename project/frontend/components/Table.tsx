export default function Table({
  columns,
  rows,
  emptyText = 'No rows.',
}: {
  columns: string[];
  rows: Array<Array<string | number | null | undefined>>;
  emptyText?: string;
}) {
  if (!rows.length) return <p className="muted">{emptyText}</p>;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j}>{cell ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
