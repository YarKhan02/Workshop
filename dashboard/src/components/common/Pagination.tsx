// Generic Pagination Component - Reusable across all tables

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex?: number; // For display purposes
  onPageChange: (page: number) => void;
  itemName?: string; // e.g., "customers", "invoices"
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  itemName = "items",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700/50">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-300">
          Showing {startItem} to {endItem} of {totalItems} {itemName}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors text-gray-200"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors text-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
