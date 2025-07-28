// ==================== GLOBAL PAGINATION CONFIG ====================

export const PAGINATION_CONFIG = {
  DEFAULT_ITEMS_PER_PAGE: 9,

  MAX_VISIBLE_PAGES: 5,

  DEFAULT_PAGE: 1,
} as const;

export type PaginationConfig = typeof PAGINATION_CONFIG;