import { useMemo } from 'react';

// Generic search hook that can be used for any array of objects
export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
) {
  return useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [items, searchTerm, searchFields]);
}

// Generic pagination hook
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 10
) {
  const paginate = (currentPage: number) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return {
      items: paginatedItems,
      totalPages,
      startIndex,
      currentPage,
      totalItems: items.length,
    };
  };

  return paginate;
}

// Generic sorting hook
export function useSort<T extends Record<string, any>>(
  items: T[],
  sortKey?: string,
  sortDirection?: 'asc' | 'desc'
) {
  return useMemo(() => {
    if (!sortKey) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let result = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        result = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        result = aValue - bValue;
      } else {
        result = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'desc' ? -result : result;
    });
  }, [items, sortKey, sortDirection]);
}

// Combined hook for search, sort, and pagination
export function useTableData<T extends Record<string, any>>(
  items: T[],
  options: {
    searchTerm?: string;
    searchFields?: (keyof T)[];
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    itemsPerPage?: number;
  } = {}
) {
  const {
    searchTerm = '',
    searchFields = [],
    sortKey,
    sortDirection,
    itemsPerPage = 10,
  } = options;

  // Apply search
  const searchedItems = useSearch(items, searchTerm, searchFields);
  
  // Apply sorting
  const sortedItems = useSort(searchedItems, sortKey, sortDirection);
  
  // Get pagination function
  const paginateItems = usePagination(sortedItems, itemsPerPage);

  return {
    searchedItems,
    sortedItems,
    paginateItems,
    totalFilteredItems: sortedItems.length,
  };
}
