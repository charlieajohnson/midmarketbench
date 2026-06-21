import type { CaseTable } from "@/lib/types";

export function DataTable({ table, label }: { table: CaseTable; label: string }) {
  return (
    <div className="table-wrap">
      <table className="data-table" aria-label={label}>
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={`${cellIndex}-${cell}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
