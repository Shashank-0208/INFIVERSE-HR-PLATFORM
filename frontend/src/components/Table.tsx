interface TableProps {
  columns: string[]
  data: any[]
  onRowClick?: (row: any) => void
  renderRow?: (row: any, index: number) => React.ReactNode
}

export default function Table({ columns, data, onRowClick, renderRow }: TableProps) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <svg
          className="empty-state-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="empty-state-text">No data available</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Get started by adding some entries</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {renderRow ? (
                renderRow(row, index)
              ) : (
                Object.values(row).map((value: any, cellIndex) => (
                  <td key={cellIndex}>{String(value)}</td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
