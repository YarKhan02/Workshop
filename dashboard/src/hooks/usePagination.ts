// ==================== PAGINATION HOOK ====================

import { useState } from 'react';
import { PAGINATION_CONFIG } from '../config/pagination';

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetToFirstPage = () => {
    setCurrentPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  };

  return {
    currentPage,
    itemsPerPage: PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE,
    onPageChange: handlePageChange,
    resetToFirstPage,
  };
};