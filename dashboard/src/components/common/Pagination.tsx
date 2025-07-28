import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showDetails?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalItems,
  onPageChange,
  showDetails = true,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`px-6 py-4 border-t border-gray-700/30 bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between">
        {showDetails && (
          <div className="text-sm text-gray-300">
            <span className="text-orange-400 font-semibold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> records on this page
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800/60 border border-gray-600/50 rounded-xl text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-600/20 hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`px-4 py-2 text-sm border rounded-xl transition-all duration-300 backdrop-blur-sm ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                        : 'bg-gray-800/60 border-gray-600/50 text-gray-200 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-600/20 hover:border-orange-500/30'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800/60 border border-gray-600/50 rounded-xl text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-600/20 hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
