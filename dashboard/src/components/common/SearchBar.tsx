// Generic SearchBar Component - Reusable search with filters

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
  className?: string;
  compact?: boolean; // New prop for compact mode without container
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  showFilter = false,
  onFilterClick,
  className = "",
  compact = false,
}) => {
  const searchInput = (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={compact 
          ? "w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          : "w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700/50 text-white placeholder-gray-400"
        }
      />
    </div>
  );

  // Compact mode - return just the input for use inside other containers
  if (compact) {
    return searchInput;
  }

  // Full mode - return with container
  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md ${className}`}>
      <div className="flex gap-4">
        {searchInput}
        {showFilter && onFilterClick && (
          <button
            onClick={onFilterClick}
            className="flex items-center px-4 py-3 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
