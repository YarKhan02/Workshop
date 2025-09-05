// ==================== MISCELLANEOUS BILL TYPES ====================

export interface MiscellaneousBill {
  id: string;
  title: string; // Changed from 'name' to 'title' to match backend
  category: string;
  amount: number;
  description?: string;
  paid_on: string; // Date when bill was paid
  created_at: string;
  updated_at: string;
  created_by?: string;
  created_by_name?: string;
}

// ==================== API TYPES ====================

export interface MiscellaneousBillCreateData {
  title: string; // Changed from 'name' to 'title'
  category: string;
  amount: number;
  description?: string;
  paid_on: string; // Date when bill was paid
}

export interface MiscellaneousBillUpdateData extends Partial<MiscellaneousBillCreateData> {}

export interface MiscellaneousBillsResponse {
  bills: MiscellaneousBill[];
  total: number;
  page: number;
  limit: number;
}

export interface MiscellaneousBillApiResponse {
  message: string;
  bill: MiscellaneousBill;
}

// ==================== COMPONENT PROPS INTERFACES ====================

export interface MiscellaneousBillTableProps {
  bills: MiscellaneousBill[];
  isLoading: boolean;
  onEditBill: (bill: MiscellaneousBill) => void;
//   onDeleteBill: (billId: string) => void;
}

export interface AddMiscellaneousBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditMiscellaneousBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: MiscellaneousBill | null;
}

// ==================== FILTER TYPES ====================

export interface MiscellaneousBillFilters {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ==================== STATS TYPES ====================

export interface MiscellaneousBillStatsData {
  totalBills: number;
  totalAmount: number;
  avgAmount: number;
  thisMonthBills: number;
}
