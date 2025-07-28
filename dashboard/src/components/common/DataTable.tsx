import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface Action<T> {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: (item: T) => void;
  className?: string;
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  isLoading = false,
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
  onSort,
  sortKey,
  sortDirection,
  className = "",
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-300">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/30 border-b border-gray-600/30">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-700/30' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-orange-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-600/30">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700/20 transition-colors duration-200">
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 ${column.className || ''}`}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {actions.map((action, actionIndex) => {
                        if (action.show && !action.show(item)) return null;
                        return (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={`transition-colors duration-200 hover:scale-110 ${action.className || 'text-orange-400 hover:text-orange-300'}`}
                            title={action.label}
                          >
                            <action.icon size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
