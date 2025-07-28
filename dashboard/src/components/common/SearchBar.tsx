import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  filters?: Array<{
    label: string;
    value: string;
    active: boolean;
    onToggle: () => void;
  }>;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  showFilterButton = false,
  onFilterClick,
  filters = [],
  className = "",
}) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md ${className}`}>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          {showFilterButton && (
            <button
              onClick={onFilterClick}
              className="flex items-center gap-2 px-4 py-3 border border-gray-600/50 bg-gray-900/50 rounded-xl hover:bg-gray-700/50 transition-colors duration-200 text-gray-200"
            >
              <Filter size={16} />
              Filters
            </button>
          )}
        </div>

        {/* Active Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {filters.filter(f => f.active).map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30"
              >
                {filter.label}
                <button
                  onClick={filter.onToggle}
                  className="hover:text-orange-300 transition-colors duration-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
