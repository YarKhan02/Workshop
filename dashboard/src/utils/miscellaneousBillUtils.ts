import type { MiscellaneousBill, MiscellaneousBillFilters, MiscellaneousBillStatsData } from '../types';

/**
 * Filter miscellaneous bills based on search criteria
 */
export const filterMiscellaneousBills = (
  bills: MiscellaneousBill[], 
  filters: MiscellaneousBillFilters
): MiscellaneousBill[] => {
  let filtered = [...bills];

  // Search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(bill =>
      bill.title.toLowerCase().includes(searchLower) ||
      (bill.description && bill.description.toLowerCase().includes(searchLower))
    );
  }

  // Date range filter
  if (filters.dateFrom) {
    filtered = filtered.filter(bill => 
      new Date(bill.paid_on) >= new Date(filters.dateFrom!)
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(bill => 
      new Date(bill.paid_on) <= new Date(filters.dateTo!)
    );
  }

  return filtered;
};

/**
 * Calculate statistics for miscellaneous bills
 */
export const calculateMiscellaneousBillStats = (
  allBills: MiscellaneousBill[], 
  filteredBills: MiscellaneousBill[]
): MiscellaneousBillStatsData => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthBills = allBills.filter(bill => 
    new Date(bill.paid_on) >= thisMonth
  ).length;

  const totalAmount = allBills.reduce((sum, bill) => sum + bill.amount, 0);
  const avgAmount = allBills.length > 0 ? totalAmount / allBills.length : 0;

  return {
    totalBills: filteredBills.length,
    totalAmount,
    avgAmount,
    thisMonthBills,
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  // Using custom formatting to avoid encoding issues
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `Rs ${formattedAmount}`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Validate bill form data
 */
export const validateBillData = (data: { title: string; amount: number; description?: string }) => {
  const errors: { [key: string]: string } = {};

  if (!data.title.trim()) {
    errors.title = 'Bill title is required';
  }

  if (data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate and print a compact receipt-style bill
 */
export const downloadBill = (bill: MiscellaneousBill): void => {
  const billId = bill.id?.toString().slice(0, 8) || 'N/A';
  
  const receiptContent = `<!DOCTYPE html>
<html>
<head>
    <title>Receipt - ${bill.title}</title>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', monospace;
            max-width: 80mm;
            margin: 0 auto;
            padding: 10mm;
            color: #333;
            line-height: 1.3;
            background: white;
            font-size: 12px;
        }
        .receipt-header {
            text-align: center;
            border-bottom: 2px dashed #333;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .company-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .company-tagline {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
        }
        .receipt-title {
            font-size: 14px;
            font-weight: bold;
            margin-top: 8px;
        }
        .receipt-section {
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            padding-bottom: 2px;
            margin-bottom: 8px;
        }
        .info-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            font-size: 11px;
        }
        .bill-details {
            margin-bottom: 15px;
        }
        .bill-title-line {
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
            font-size: 12px;
            text-transform: uppercase;
        }
        .amount-section {
            border-top: 2px dashed #333;
            border-bottom: 2px dashed #333;
            padding: 10px 0;
            margin: 15px 0;
        }
        .amount-line {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
        }
        .description-section {
            margin: 10px 0;
            font-size: 10px;
            text-align: center;
            color: #666;
        }
        .receipt-footer {
            text-align: center;
            border-top: 2px dashed #333;
            padding-top: 10px;
            margin-top: 15px;
            font-size: 10px;
            color: #666;
        }
        .thank-you {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        @media print {
            body { 
                margin: 0; 
                padding: 5mm; 
                font-size: 11px;
            }
            @page {
                margin: 5mm;
                size: 80mm auto;
            }
        }
        @media screen {
            body {
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                margin: 20px auto;
                background: #f5f5f5;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-header">
        <div class="company-name">DETAILING HUB</div>
        <div class="company-tagline">Professional Auto Services</div>
        <div class="receipt-title">EXPENSE RECEIPT #${billId}</div>
        <div style="font-size: 10px; margin-top: 5px;">${formatDate(bill.paid_on)}</div>
    </div>
    
    <div class="receipt-section">
        <div class="section-title">Bill Details</div>
        <div class="info-line">
            <span>Category:</span>
            <span>${bill.category.charAt(0).toUpperCase() + bill.category.slice(1)}</span>
        </div>
        <div class="info-line">
            <span>Bill ID:</span>
            <span>${billId}</span>
        </div>
        <div class="info-line">
            <span>Date Paid:</span>
            <span>${formatDate(bill.paid_on)}</span>
        </div>
        ${bill.created_by_name ? `
        <div class="info-line">
            <span>Processed By:</span>
            <span>${bill.created_by_name}</span>
        </div>
        ` : ''}
    </div>
    
    <div class="bill-title-line">${bill.title}</div>
    
    ${bill.description ? `
    <div class="description-section">
        <div style="font-weight: bold; margin-bottom: 3px;">Description:</div>
        <div>${bill.description}</div>
    </div>
    ` : ''}
    
    <div class="amount-section">
        <div class="amount-line">
            <span>TOTAL AMOUNT:</span>
            <span>${formatCurrency(bill.amount)}</span>
        </div>
    </div>
    
    <div class="receipt-footer">
        <div class="thank-you">Thank You!</div>
        <div>DETAILING HUB</div>
        <div>Professional Auto Services</div>
        <div style="margin-top: 8px; font-size: 9px;">
            Generated: ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
    </div>
    
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 100);
        };
    </script>
</body>
</html>`;

  // Create a new window/tab with the receipt content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
  } else {
    // Fallback: download as HTML if popup is blocked
    const blob = new Blob([receiptContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${bill.title.replace(/[^a-zA-Z0-9]/g, '_')}_${bill.paid_on}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
