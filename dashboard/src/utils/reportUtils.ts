import type { MonthlyReportData } from '../hooks/useMonthlyReport';
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
  });
};

/**
 * Download comprehensive monthly analytics report as PDF
 */
export const downloadMonthlyReportPDF = (reportData: MonthlyReportData): void => {
  const reportContent = `<!DOCTYPE html>
<html>
<head>
    <title>Monthly Analytics Report - ${reportData.period.month} ${reportData.period.year}</title>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            color: #333;
            line-height: 1.6;
            background: white;
            font-size: 12px;
        }
        .report-header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        .company-tagline {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .report-title {
            font-size: 22px;
            font-weight: bold;
            margin-top: 15px;
            color: #1f2937;
        }
        .report-period {
            font-size: 16px;
            color: #666;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        .section-icon {
            margin-right: 10px;
            font-size: 20px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .metric-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .metric-label {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .metric-subtitle {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 5px;
        }
        .financial-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .financial-table th,
        .financial-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .financial-table th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        .financial-table .amount {
            text-align: right;
            font-weight: 600;
        }
        .positive {
            color: #059669;
        }
        .negative {
            color: #dc2626;
        }
        .total-row {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .product-list {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
        }
        .product-item {
            display: flex;
            justify-content: between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .product-item:last-child {
            border-bottom: none;
        }
        .product-info {
            flex: 1;
        }
        .product-name {
            font-weight: 600;
            color: #1f2937;
        }
        .product-details {
            font-size: 11px;
            color: #6b7280;
            margin-top: 2px;
        }
        .product-stats {
            text-align: right;
        }
        .service-list {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
        }
        .service-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .service-item:last-child {
            border-bottom: none;
        }
        .service-name {
            font-weight: 600;
            color: #1f2937;
        }
        .service-count {
            font-size: 12px;
            color: #6b7280;
        }
        .summary-section {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .summary-title {
            font-size: 18px;
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        .summary-text {
            color: #78350f;
            line-height: 1.6;
        }
        .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 11px;
        }
        @media print {
            body { 
                margin: 0; 
                padding: 15mm; 
                font-size: 11px;
            }
            @page {
                margin: 15mm;
                size: A4;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="company-name">DETAILING HUB</div>
        <div class="company-tagline">Professional Auto Services - Analytics Dashboard</div>
        <div class="report-title">Monthly Analytics Report</div>
        <div class="report-period">${reportData.period.month} ${reportData.period.year}</div>
        <div style="font-size: 12px; margin-top: 8px; color: #6b7280;">
            Period: ${formatDate(reportData.period.start_date)} - ${formatDate(reportData.period.end_date)}
        </div>
    </div>

    <!-- Key Metrics Overview -->
    <div class="section">
        <div class="section-title">
            <span class="section-icon">📊</span>
            Key Performance Metrics
        </div>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${reportData.bookings.total_bookings}</div>
                <div class="metric-label">Total Bookings</div>
                <div class="metric-subtitle">${reportData.bookings.completion_rate}% completion rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value positive">${formatCurrency(reportData.financial.total_sales)}</div>
                <div class="metric-label">Total Sales</div>
                <div class="metric-subtitle">${reportData.financial.profit_margin}% profit margin</div>
            </div>
            <div class="metric-card">
                <div class="metric-value positive">${formatCurrency(reportData.financial.net_revenue)}</div>
                <div class="metric-label">Net Revenue</div>
                <div class="metric-subtitle">After product costs</div>
            </div>
            <div class="metric-card">
                <div class="metric-value ${reportData.financial.total_profit >= 0 ? 'positive' : 'negative'}">${formatCurrency(reportData.financial.total_profit)}</div>
                <div class="metric-label">Total Profit</div>
                <div class="metric-subtitle">After all expenses</div>
            </div>
        </div>
    </div>

    <!-- Financial Breakdown -->
    <div class="section">
        <div class="section-title">
            <span class="section-icon">💰</span>
            Financial Breakdown
        </div>
        <table class="financial-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="amount">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Service Revenue</td>
                    <td class="amount positive">${formatCurrency(reportData.financial.service_revenue)}</td>
                </tr>
                <tr>
                    <td>Total Sales (Gross)</td>
                    <td class="amount positive">${formatCurrency(reportData.financial.total_sales)}</td>
                </tr>
                <tr>
                    <td>Products Used in Services</td>
                    <td class="amount negative">-${formatCurrency(reportData.financial.products_used_cost)}</td>
                </tr>
                <tr>
                    <td>Employee Salaries</td>
                    <td class="amount negative">-${formatCurrency(reportData.financial.employee_salaries)}</td>
                </tr>
                <tr>
                    <td>Other Expenses</td>
                    <td class="amount negative">-${formatCurrency(reportData.financial.total_expenses)}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Net Profit</strong></td>
                    <td class="amount ${reportData.financial.total_profit >= 0 ? 'positive' : 'negative'}">
                        <strong>${formatCurrency(reportData.financial.total_profit)}</strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Product Sales Analysis -->
    ${reportData.products.product_sales_details.length > 0 ? `
    <div class="section">
        <div class="section-title">
            <span class="section-icon">📦</span>
            Product Sales Analysis
        </div>
        <div style="margin-bottom: 20px;">
            <div class="metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="metric-card">
                    <div class="metric-value">${reportData.products.products_sold_quantity.toFixed(0)}</div>
                    <div class="metric-label">Units Sold</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value positive">${formatCurrency(reportData.products.products_sold_value)}</div>
                    <div class="metric-label">Product Revenue</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${formatCurrency(reportData.products.products_used_in_services)}</div>
                    <div class="metric-label">Service Materials</div>
                </div>
            </div>
        </div>
        <div class="product-list">
            <h4 style="margin-bottom: 15px; color: #374151;">Top Selling Products</h4>
            ${reportData.products.product_sales_details.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <div class="product-name">${product.product_name}</div>
                    <div class="product-details">
                        ${product.variant_name ? `Variant: ${product.variant_name} • ` : ''}
                        SKU: ${product.sku} • 
                        Unit Price: ${formatCurrency(product.unit_price)}
                    </div>
                </div>
                <div class="product-stats">
                    <div style="font-weight: 600; color: #059669;">${formatCurrency(product.revenue)}</div>
                    <div style="font-size: 11px; color: #6b7280;">${product.quantity_sold.toFixed(0)} units sold</div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <!-- Top Services -->
    ${reportData.top_services.length > 0 ? `
    <div class="section">
        <div class="section-title">
            <span class="section-icon">🔧</span>
            Top Performing Services
        </div>
        <div class="service-list">
            ${reportData.top_services.map(service => `
            <div class="service-item">
                <div>
                    <div class="service-name">${service.service_name}</div>
                    <div class="service-count">${service.bookings_count} bookings</div>
                </div>
                <div style="font-weight: 600; color: #059669;">${formatCurrency(service.revenue)}</div>
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <!-- Expense Breakdown -->
    ${reportData.expense_breakdown.length > 0 ? `
    <div class="section">
        <div class="section-title">
            <span class="section-icon">💸</span>
            Expense Breakdown
        </div>
        <table class="financial-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Transactions</th>
                    <th class="amount">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${reportData.expense_breakdown.map(expense => `
                <tr>
                    <td style="text-transform: capitalize;">${expense.category.replace('_', ' ')}</td>
                    <td>${expense.transaction_count}</td>
                    <td class="amount negative">${formatCurrency(expense.total_amount)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    <!-- Summary -->
    <div class="section">
        <div class="summary-section">
            <div class="summary-title">Monthly Performance Summary</div>
            <div class="summary-text">
                In ${reportData.period.month} ${reportData.period.year}, your workshop processed ${reportData.bookings.total_bookings} bookings 
                with a ${reportData.bookings.completion_rate}% completion rate. Total sales reached ${formatCurrency(reportData.financial.total_sales)} 
                with a net profit of ${formatCurrency(reportData.financial.total_profit)} (${reportData.financial.profit_margin}% margin).
                ${reportData.products.product_sales_details.length > 0 ? 
                  ` The best-selling product was ${reportData.products.product_sales_details[0].product_name} with ${reportData.products.product_sales_details[0].quantity_sold.toFixed(0)} units sold.` 
                  : ''
                }
            </div>
        </div>
    </div>

    <div class="report-footer">
        <div style="font-weight: 600; margin-bottom: 5px;">DETAILING HUB - Professional Auto Services</div>
        <div>Report generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
        <div style="margin-top: 10px; font-style: italic;">
            This report contains confidential business information.
        </div>
    </div>

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>`;

  // Create a new window/tab with the report content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.focus();
  } else {
    // Fallback: download as HTML if popup is blocked
    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Monthly_Report_${reportData.period.month}_${reportData.period.year}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
