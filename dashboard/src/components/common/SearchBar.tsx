// Generic SearchBar Component - Reusable search with filters

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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
  compact = false,
}) => {
  const { theme } = useTheme();
  const searchInput = (
    <div className="flex-1 relative">
      <Search className={theme.searchBar.icon} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={compact ? theme.searchBar.inputCompact : theme.searchBar.input}
      />
    </div>
  );

  // Compact mode - return just the input for use inside other containers
  if (compact) {
    return searchInput;
  }

  // Full mode - return with container
  return (
    <div className="flex gap-4">
      {searchInput}
      {showFilter && onFilterClick && (
        <button
          onClick={onFilterClick}
          className={theme.searchBar.filterButton}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      )}
    </div>
  );
};

export default SearchBar;
