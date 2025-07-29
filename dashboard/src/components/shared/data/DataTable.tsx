import React from 'react';

interface Column {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
}

interface Action {
  label: string;
  icon: React.ComponentType<any>;
  onClick: (item: any) => void;
  className?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  actions,
  isLoading = false,
  emptyMessage = "No data available",
  loadingMessage = "Loading..."
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl overflow-hidden">
        <div className="p-8 text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
          {loadingMessage}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl overflow-hidden">
        <div className="p-8 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/30">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(item)}
                          className={`p-2 rounded-lg transition-colors ${action.className || 'text-gray-400 hover:text-white hover:bg-gray-600/50'}`}
                          title={action.label}
                        >
                          {React.createElement(action.icon, { className: "h-4 w-4" })}
                        </button>
                      ))}
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
};

export default DataTable;
