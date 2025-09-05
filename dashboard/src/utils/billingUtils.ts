import type { Invoice } from '../types/billing';
import { formatCurrency } from './currency';

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * Get invoice field with fallback for different naming conventions
 */
export const getInvoiceField = (invoice: any, field: string): any => {
  const fieldMappings: { [key: string]: string[] } = {
    invoiceNumber: ['invoice_number', 'invoiceNumber', 'id'],
    createdAt: ['created_at', 'createdAt', 'date_created'],
    paidDate: ['paid_date', 'paidDate'],
    paymentMethod: ['payment_method', 'paymentMethod'],
    subtotal: ['subtotal', 'sub_total'],
    totalAmount: ['total_amount', 'totalAmount', 'grand_total'],
    discountAmount: ['discount_amount', 'discount', 'discountAmount'],
  };

  const possibleFields = fieldMappings[field] || [field];
  
  for (const possibleField of possibleFields) {
    if (invoice[possibleField] !== undefined) {
      return invoice[possibleField];
    }
  }
  
  return null;
};

/**
 * Download and print a compact receipt-style invoice
 */
export const downloadInvoice = (invoice: Invoice): void => {
  const invoiceNumber = getInvoiceField(invoice, 'invoiceNumber') || invoice.id?.toString().slice(0, 8) || 'N/A';
  const createdAt = getInvoiceField(invoice, 'createdAt') || '';
  const paymentMethod = getInvoiceField(invoice, 'paymentMethod');
  const subtotal = getInvoiceField(invoice, 'subtotal') || getInvoiceField(invoice, 'totalAmount') || 0;
  const discountAmount = getInvoiceField(invoice, 'discountAmount') || 0;
  const totalAmount = getInvoiceField(invoice, 'totalAmount') || 0;

  const receiptContent = `<!DOCTYPE html>
<html>
<head>
    <title>Receipt #${invoiceNumber}</title>
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
        .invoice-number {
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
        .item-line {
            margin-bottom: 5px;
            font-size: 11px;
        }
        .item-desc {
            font-weight: bold;
        }
        .item-details {
            display: flex;
            justify-content: space-between;
            margin-top: 2px;
        }
        .total-section {
            border-top: 2px dashed #333;
            padding-top: 10px;
            margin-top: 15px;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            font-size: 11px;
        }
        .grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
            padding: 5px 0;
            margin-top: 5px;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-cancelled {
            background-color: #f8d7da;
            color: #721c24;
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
        <div class="invoice-number">RECEIPT #${invoiceNumber}</div>
        <div style="font-size: 10px; margin-top: 5px;">${formatDate(createdAt).split(',')[0]}</div>
    </div>
    
    <div class="receipt-section">
        <div class="section-title">Customer</div>
        <div class="info-line">
            <span>Name:</span>
            <span>${invoice.customer?.name || 'N/A'}</span>
        </div>
        <div class="info-line">
            <span>Phone:</span>
            <span>${invoice.customer?.phone_number || 'N/A'}</span>
        </div>
        <div class="info-line">
            <span>Status:</span>
            <span class="status-badge status-${invoice.status}">${invoice.status}</span>
        </div>
        ${paymentMethod ? `
        <div class="info-line">
            <span>Payment:</span>
            <span>${paymentMethod.replace('_', ' ').toUpperCase()}</span>
        </div>
        ` : ''}
    </div>
    
    <div class="receipt-section">
        <div class="section-title">Items</div>
        ${invoice.items?.map(item => `
        <div class="item-line">
            <div class="item-desc">${item.description || (item as any).variant_name || 'Item'}</div>
            <div class="item-details">
                <span>${item.quantity} x ${formatCurrency((item as any).unit_price || item.unitPrice || 0)}</span>
                <span>${formatCurrency((item as any).total_amount || (item as any).total_price || item.totalPrice || 0)}</span>
            </div>
        </div>
        `).join('') || '<div style="text-align: center; color: #666;">No items</div>'}
    </div>
    
    <div class="total-section">
        <div class="total-line">
            <span>Subtotal:</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        ${discountAmount > 0 ? `
        <div class="total-line">
            <span>Discount:</span>
            <span>-${formatCurrency(discountAmount)}</span>
        </div>
        ` : ''}
        <div class="total-line grand-total">
            <span>TOTAL:</span>
            <span>${formatCurrency(totalAmount)}</span>
        </div>
    </div>
    
    <div class="receipt-footer">
        <div class="thank-you">Thank You!</div>
        <div>DETAILING HUB</div>
        <div>Professional Auto Services</div>
        <div style="margin-top: 8px; font-size: 9px;">
            ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
    a.download = `Receipt_${invoiceNumber}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
