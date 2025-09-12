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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            color: #1a1a1a;
            line-height: 1.5;
            background: white;
            font-size: 11px;
            font-weight: 400;
        }
        
        .report-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 40px 30px;
            margin: -20mm -20mm 40px -20mm;
            position: relative;
            overflow: hidden;
        }
        
        .report-header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: translate(50px, -50px);
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .company-name {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .company-tagline {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 30px;
            font-weight: 300;
        }
        
        .report-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .report-period {
            font-size: 18px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .report-meta {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 15px;
            font-weight: 300;
        }
        
        .section {
            margin-bottom: 50px;
            page-break-inside: avoid;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid #f1f5f9;
            overflow: hidden;
        }
        
        .section-header {
            background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 20px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
            display: flex;
            align-items: center;
        }
        
        .section-number {
            background: #3b82f6;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
            margin-right: 12px;
        }
        
        .section-content {
            padding: 30px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            width: 100%;
            max-width: 100%;
            overflow: hidden;
        }
        
        .metrics-grid.three-column {
            grid-template-columns: repeat(3, 1fr);
            max-width: 100%;
        }
        
        .metrics-grid.four-column {
            grid-template-columns: repeat(4, 1fr);
            max-width: 100%;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
            min-width: 0;
            word-wrap: break-word;
            overflow: hidden;
        }
        
        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
            border-radius: 12px 12px 0 0;
        }
        
        .metric-value {
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
            line-height: 1.1;
            word-break: break-word;
        }
        
        .metric-label {
            font-size: 13px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .metric-subtitle {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 6px;
            font-weight: 400;
        }
        
        .financial-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        
        .financial-table th {
            background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%);
            padding: 16px 20px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #d1d5db;
        }
        
        .financial-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 12px;
            color: #4b5563;
        }
        
        .financial-table tr:last-child td {
            border-bottom: none;
        }
        
        .financial-table tr:hover {
            background: #f9fafb;
        }
        
        .financial-table .amount {
            text-align: right;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
        }
        
        .positive {
            color: #059669;
        }
        
        .negative {
            color: #dc2626;
        }
        
        .total-row {
            background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%);
            border-top: 2px solid #0ea5e9;
        }
        
        .total-row td {
            font-weight: 700;
            color: #0c4a6e;
            border-bottom: none;
        }
        
        .data-list {
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #e2e8f0;
        }
        
        .data-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #e5e7eb;
            transition: all 0.2s ease;
        }
        
        .data-item:last-child {
            border-bottom: none;
        }
        
        .data-item:hover {
            background: rgba(59, 130, 246, 0.02);
            margin: 0 -12px;
            padding: 16px 12px;
            border-radius: 8px;
        }
        
        .item-info {
            flex: 1;
        }
        
        .item-name {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
            font-size: 13px;
        }
        
        .item-details {
            font-size: 11px;
            color: #64748b;
            line-height: 1.4;
        }
        
        .item-stats {
            text-align: right;
            margin-left: 16px;
        }
        
        .item-value {
            font-weight: 700;
            color: #059669;
            font-size: 14px;
            margin-bottom: 2px;
        }
        
        .item-subtitle {
            font-size: 10px;
            color: #64748b;
        }
        
        .summary-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 16px;
            padding: 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .summary-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100px;
            height: 100px;
            background: rgba(245, 158, 11, 0.1);
            border-radius: 50%;
        }
        
        .summary-title {
            font-size: 24px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 16px;
            position: relative;
            z-index: 1;
        }
        
        .summary-text {
            color: #78350f;
            line-height: 1.6;
            font-size: 13px;
            position: relative;
            z-index: 1;
            max-width: 80%;
            margin: 0 auto;
        }
        
        .report-footer {
            margin-top: 60px;
            padding: 30px 0;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
            background: linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%);
            margin-left: -30px;
            margin-right: -30px;
            padding-left: 30px;
            padding-right: 30px;
        }
        
        .footer-company {
            font-weight: 600;
            font-size: 14px;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .footer-timestamp {
            color: #6b7280;
            margin-bottom: 12px;
        }
        
        .footer-confidential {
            font-style: italic;
            color: #9ca3af;
            font-size: 9px;
        }
        
        .subsection-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
        }
        
        @media print {
            body { 
                margin: 0; 
                padding: 15mm; 
                font-size: 10px;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            @page {
                margin: 15mm;
                size: A4;
                @top-left { content: ""; }
                @top-center { content: ""; }
                @top-right { content: ""; }
                @bottom-left { content: ""; }
                @bottom-center { content: ""; }
                @bottom-right { content: ""; }
            }
            .section {
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #e5e7eb;
            }
            .report-header {
                margin: -15mm -15mm 30px -15mm;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            .metrics-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
            }
            .metrics-grid.three-column {
                grid-template-columns: repeat(3, 1fr);
            }
            .metric-card {
                padding: 15px;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            .metric-value {
                font-size: 12px !important;
            }
            .financial-table,
            .data-list,
            .highlight-box,
            .summary-section {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            /* Hide any browser-generated links */
            a[href]:after {
                content: none !important;
            }
            /* Hide browser print headers/footers */
            @page {
                margin: 0;
                @top-left { content: none !important; }
                @top-center { content: none !important; }
                @top-right { content: none !important; }
                @bottom-left { content: none !important; }
                @bottom-center { content: none !important; }
                @bottom-right { content: none !important; }
            }
        }
        
        @media screen and (max-width: 800px) {
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            .metrics-grid.three-column,
            .metrics-grid.four-column {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media screen and (max-width: 500px) {
            .metrics-grid,
            .metrics-grid.three-column,
            .metrics-grid.four-column {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="header-content">
            <div class="company-name">DETAILING HUB</div>
            <div class="company-tagline">Professional Automotive Services & Analytics</div>
            <div class="report-title">Monthly Business Analytics Report</div>
            <div class="report-period">${reportData.period.month} ${reportData.period.year}</div>
            <div class="report-meta">
                Reporting Period: ${formatDate(reportData.period.start_date)} - ${formatDate(reportData.period.end_date)}
            </div>
        </div>
    </div>

    <!-- Executive Summary -->
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">1</span>
                Executive Summary
            </div>
        </div>
        <div class="section-content">
            <div class="metrics-grid four-column">
                <div class="metric-card">
                    <div class="metric-value">${reportData.bookings.total_bookings}</div>
                    <div class="metric-label">Total Bookings</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value positive">${formatCurrency(reportData.financial.total_sales)}</div>
                    <div class="metric-label">Gross Revenue</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value positive">${formatCurrency(reportData.financial.net_revenue)}</div>
                    <div class="metric-label">Net Revenue</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value ${reportData.financial.total_profit >= 0 ? 'positive' : 'negative'}">${formatCurrency(reportData.financial.total_profit)}</div>
                    <div class="metric-label">Net Profit</div>
                </div>
            </div>
            
            <div class="highlight-box">
                <strong>Key Performance Highlights:</strong><br>
                • Achieved ${reportData.bookings.completion_rate}% service completion rate<br>
                • Generated ${formatCurrency(reportData.financial.total_sales)} in total revenue<br>
                • Maintained ${reportData.financial.profit_margin}% profit margin<br>
                • Processed ${reportData.bookings.total_bookings} customer bookings
            </div>
        </div>
    </div>

    <!-- Financial Performance -->
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">2</span>
                Financial Performance Analysis
            </div>
        </div>
        <div class="section-content">
            <table class="financial-table">
                <thead>
                    <tr>
                        <th>Revenue & Expense Categories</th>
                        <th class="amount">Amount (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(0).replace('0.00', '')})</th>
                        <th class="amount">% of Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Service Revenue</td>
                        <td class="amount positive">${formatCurrency(reportData.financial.service_revenue)}</td>
                        <td class="amount">${((reportData.financial.service_revenue / reportData.financial.total_sales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Total Gross Sales</td>
                        <td class="amount positive">${formatCurrency(reportData.financial.total_sales)}</td>
                        <td class="amount">100.0%</td>
                    </tr>
                    <tr>
                        <td>Cost of Materials</td>
                        <td class="amount negative">-${formatCurrency(reportData.financial.products_used_cost)}</td>
                        <td class="amount">${((reportData.financial.products_used_cost / reportData.financial.total_sales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Employee Compensation</td>
                        <td class="amount negative">-${formatCurrency(reportData.financial.employee_salaries)}</td>
                        <td class="amount">${((reportData.financial.employee_salaries / reportData.financial.total_sales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Operating Expenses</td>
                        <td class="amount negative">-${formatCurrency(reportData.financial.total_expenses)}</td>
                        <td class="amount">${((reportData.financial.total_expenses / reportData.financial.total_sales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Net Profit (EBITDA)</strong></td>
                        <td class="amount ${reportData.financial.total_profit >= 0 ? 'positive' : 'negative'}">
                            <strong>${formatCurrency(reportData.financial.total_profit)}</strong>
                        </td>
                        <td class="amount"><strong>${reportData.financial.profit_margin}%</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Product Performance Analysis -->
    ${reportData.products.product_sales_details.length > 0 ? `
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">3</span>
                Product Performance Analysis
            </div>
        </div>
        <div class="section-content">
            <div class="metrics-grid three-column" style="margin-bottom: 30px;">
                <div class="metric-card">
                    <div class="metric-value">${reportData.products.products_sold_quantity.toFixed(0)}</div>
                    <div class="metric-label">Units Sold</div>
                    <div class="metric-subtitle">Total product volume</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value positive">${formatCurrency(reportData.products.products_sold_value)}</div>
                    <div class="metric-label">Product Revenue</div>
                    <div class="metric-subtitle">Direct sales income</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${formatCurrency(reportData.products.products_used_in_services)}</div>
                    <div class="metric-label">Service Materials</div>
                    <div class="metric-subtitle">Cost of goods used</div>
                </div>
            </div>
            
            <div class="subsection-title">All Products Sold This Month</div>
            <div class="data-list">
                ${reportData.products.product_sales_details.map((product) => `
                <div class="data-item">
                    <div class="item-info">
                        <div class="item-name">${product.product_name}</div>
                        <div class="item-details">
                            ${product.variant_name ? `${product.variant_name} • ` : ''}
                            SKU: ${product.sku} • Unit Price: ${formatCurrency(product.unit_price)}
                        </div>
                    </div>
                    <div class="item-stats">
                        <div class="item-value">${formatCurrency(product.revenue)}</div>
                        <div class="item-subtitle">${product.quantity_sold.toFixed(0)} units sold</div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>
    ` : ''}

    <!-- Service Performance Analysis -->
    ${reportData.top_services.length > 0 ? `
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">4</span>
                Service Performance Analysis
            </div>
        </div>
        <div class="section-content">
            <div class="subsection-title">Most Popular Services</div>
            <div class="data-list">
                ${reportData.top_services.slice(0, 8).map((service, index) => `
                <div class="data-item">
                    <div class="item-info">
                        <div class="item-name">#${index + 1} ${service.service_name}</div>
                        <div class="item-details">${service.bookings_count} bookings completed this month</div>
                    </div>
                    <div class="item-stats">
                        <div class="item-value">${formatCurrency(service.revenue)}</div>
                        <div class="item-subtitle">Revenue generated</div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>
    ` : ''}

    <!-- Operating Expenses Analysis -->
    ${reportData.expense_breakdown.length > 0 ? `
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">5</span>
                Operating Expenses Breakdown
            </div>
        </div>
        <div class="section-content">
            <table class="financial-table">
                <thead>
                    <tr>
                        <th>Expense Category</th>
                        <th>Transactions</th>
                        <th class="amount">Amount</th>
                        <th class="amount">% of Total Expenses</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.expense_breakdown.map(expense => `
                    <tr>
                        <td style="text-transform: capitalize; font-weight: 500;">${expense.category.replace('_', ' ')}</td>
                        <td>${expense.transaction_count}</td>
                        <td class="amount negative">${formatCurrency(expense.total_amount)}</td>
                        <td class="amount">${((expense.total_amount / reportData.financial.total_expenses) * 100).toFixed(1)}%</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td><strong>Total Operating Expenses</strong></td>
                        <td><strong>${reportData.expense_breakdown.reduce((sum, exp) => sum + exp.transaction_count, 0)}</strong></td>
                        <td class="amount"><strong>${formatCurrency(reportData.financial.total_expenses)}</strong></td>
                        <td class="amount"><strong>100.0%</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    ` : ''}

    <!-- Human Resources & Payroll -->
    ${reportData.salaries && reportData.salaries.length > 0 ? `
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">6</span>
                Human Resources & Payroll Summary
            </div>
        </div>
        <div class="section-content">
            <div class="highlight-box">
                <strong>Payroll Overview:</strong> Total compensation of ${formatCurrency(reportData.financial.employee_salaries)} 
                distributed across ${reportData.salaries.length} employees for ${reportData.period.month} ${reportData.period.year}.
            </div>
            
            <table class="financial-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th class="amount">Base Salary</th>
                        <th class="amount">Bonus & Incentives</th>
                        <th class="amount">Total Compensation</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.salaries.map(salary => `
                    <tr>
                        <td style="font-weight: 500;">${salary.employee_name}</td>
                        <td class="amount">${formatCurrency(salary.amount)}</td>
                        <td class="amount">${formatCurrency(salary.bonus || 0)}</td>
                        <td class="amount" style="font-weight: 600;">${formatCurrency(salary.total_salary)}</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td><strong>Total Payroll</strong></td>
                        <td class="amount"><strong>${formatCurrency(reportData.salaries.reduce((sum, sal) => sum + sal.amount, 0))}</strong></td>
                        <td class="amount"><strong>${formatCurrency(reportData.salaries.reduce((sum, sal) => sum + (sal.bonus || 0), 0))}</strong></td>
                        <td class="amount"><strong>${formatCurrency(reportData.financial.employee_salaries)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    ` : ''}

    <!-- Executive Summary & Outlook -->
    <div class="section">
        <div class="section-header">
            <div class="section-title">
                <span class="section-number">7</span>
                Executive Summary & Business Outlook
            </div>
        </div>
        <div class="section-content">
            <div class="summary-section">
                <div class="summary-title">Monthly Performance Overview</div>
                <div class="summary-text">
                    <strong>Business Performance:</strong> During ${reportData.period.month} ${reportData.period.year}, Detailing Hub successfully processed 
                    <strong>${reportData.bookings.total_bookings} customer bookings</strong> with an exceptional <strong>${reportData.bookings.completion_rate}% completion rate</strong>, 
                    demonstrating operational excellence and customer satisfaction.
                    <br><br>
                    <strong>Financial Results:</strong> The company generated <strong>${formatCurrency(reportData.financial.total_sales)}</strong> in gross revenue, 
                    achieving a healthy <strong>${reportData.financial.profit_margin}% profit margin</strong> with net profit of <strong>${formatCurrency(reportData.financial.total_profit)}</strong>. 
                    This performance reflects strong market positioning and efficient cost management.
                    ${reportData.products.product_sales_details.length > 0 ? 
                      `<br><br><strong>Product Leadership:</strong> Our top-performing product, ${reportData.products.product_sales_details[0].product_name}, 
                      achieved outstanding sales of ${reportData.products.product_sales_details[0].quantity_sold.toFixed(0)} units, contributing significantly to our product revenue stream.` 
                      : ''
                    }
                    <br><br>
                    <strong>Strategic Outlook:</strong> With consistent service delivery, diversified revenue streams, and controlled operational expenses, 
                    the business is well-positioned for sustainable growth and continued market expansion.
                </div>
            </div>
        </div>
    </div>

    <div class="report-footer">
        <div class="footer-company">DETAILING HUB • Professional Automotive Services</div>
        <div class="footer-timestamp">Report Generated: ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })}</div>
        <div class="footer-confidential">
            This document contains confidential and proprietary business information. 
            Distribution is restricted to authorized personnel only.
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
