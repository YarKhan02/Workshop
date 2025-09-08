"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FormModal } from '../../shared/FormModal';
import { useMonthlyReport, downloadMonthlyReport } from '../../../hooks/useMonthlyReport';
import { formatCurrency } from '../../../utils/currency';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: reportData, isLoading, error } = useMonthlyReport(selectedMonth, selectedYear);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadMonthlyReport(selectedMonth, selectedYear);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Analytics Report"
      subtitle="Comprehensive financial and operational insights"
      size="xl"
      onSubmit={() => {}}
      footer={null}
    >
      <div className="space-y-6">
        {/* Month/Year Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-white/70">Loading report...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-2">Failed to load report data</p>
            <p className="text-white/60 text-sm">Please try selecting a different month/year</p>
          </div>
        )}

        {/* Report Data */}
        {reportData && !isLoading && (
          <div className="space-y-6">
            {/* Download Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isDownloading ? 'Downloading...' : 'Download PDF Report'}</span>
              </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Bookings"
                value={reportData.bookings.total_bookings.toString()}
                icon={<Calendar className="w-5 h-5" />}
                subtitle={`${reportData.bookings.completion_rate}% completion rate`}
              />
              <MetricCard
                title="Total Sales"
                value={formatCurrency(reportData.financial.total_sales)}
                icon={<DollarSign className="w-5 h-5" />}
                subtitle={`${reportData.financial.profit_margin}% profit margin`}
              />
              <MetricCard
                title="Net Revenue"
                value={formatCurrency(reportData.financial.net_revenue)}
                icon={<TrendingUp className="w-5 h-5" />}
                subtitle="After product costs"
              />
              <MetricCard
                title="Total Profit"
                value={formatCurrency(reportData.financial.total_profit)}
                icon={<TrendingUp className="w-5 h-5" />}
                subtitle="After all expenses"
                valueColor={reportData.financial.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}
              />
            </div>

            {/* Financial Breakdown */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Financial Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <FinancialItem 
                    label="Service Revenue" 
                    value={formatCurrency(reportData.financial.service_revenue)} 
                  />
                  <FinancialItem 
                    label="Products Used Cost" 
                    value={formatCurrency(reportData.financial.products_used_cost)}
                    isExpense 
                  />
                  <FinancialItem 
                    label="Gross Revenue" 
                    value={formatCurrency(reportData.financial.gross_revenue)} 
                  />
                </div>
                <div className="space-y-3">
                  <FinancialItem 
                    label="Employee Salaries" 
                    value={formatCurrency(reportData.financial.employee_salaries)}
                    isExpense 
                  />
                  <FinancialItem 
                    label="Other Expenses" 
                    value={formatCurrency(reportData.financial.total_expenses)}
                    isExpense 
                  />
                  <FinancialItem 
                    label="Net Profit" 
                    value={formatCurrency(reportData.financial.total_profit)}
                    isTotal
                    isExpense={reportData.financial.total_profit < 0}
                  />
                </div>
              </div>
            </div>

            {/* Product Statistics */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-400" />
                Product Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <ProductStat
                  label="Products Sold"
                  value={`${reportData.products.products_sold_quantity} units`}
                  subValue={formatCurrency(reportData.products.products_sold_value)}
                />
                <ProductStat
                  label="Products Used in Services"
                  value={formatCurrency(reportData.products.products_used_in_services)}
                  subValue="Service materials"
                />
                <ProductStat
                  label="Product Revenue"
                  value={formatCurrency(reportData.products.products_sold_value)}
                  subValue="Direct sales"
                />
              </div>
              
              {/* Product Sales Details */}
              {reportData.products.product_sales_details.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-white mb-3">Top Selling Products</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {reportData.products.product_sales_details.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium">{product.product_name}</p>
                          {product.variant_name && (
                            <p className="text-white/60 text-sm">Variant: {product.variant_name}</p>
                          )}
                          <p className="text-white/50 text-xs">
                            SKU: {product.sku} • Unit Price: {formatCurrency(product.unit_price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold">
                            {formatCurrency(product.revenue)}
                          </p>
                          <p className="text-white/60 text-sm">{product.quantity_sold.toFixed(0)} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Services */}
            {reportData.top_services.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Top Services
                </h3>
                <div className="space-y-3">
                  {reportData.top_services.slice(0, 5).map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{service.service_name}</p>
                        <p className="text-white/60 text-sm">{service.bookings_count} bookings</p>
                      </div>
                      <p className="text-green-400 font-semibold">
                        {formatCurrency(service.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expense Breakdown */}
            {reportData.expense_breakdown.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Expense Breakdown
                </h3>
                <div className="space-y-3">
                  {reportData.expense_breakdown.map((expense, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium capitalize">{expense.category.replace('_', ' ')}</p>
                        <p className="text-white/60 text-sm">{expense.transaction_count} transactions</p>
                      </div>
                      <p className="text-red-400 font-semibold">
                        {formatCurrency(expense.total_amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </FormModal>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  valueColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  subtitle,
  valueColor = 'text-white'
}) => (
  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
    <div className="flex items-center justify-between mb-2">
      <div className="text-blue-400">{icon}</div>
    </div>
    <p className="text-white/70 text-sm mb-1">{title}</p>
    <p className={`text-xl font-bold ${valueColor} mb-1`}>{value}</p>
    {subtitle && <p className="text-white/50 text-xs">{subtitle}</p>}
  </div>
);

interface FinancialItemProps {
  label: string;
  value: string;
  isExpense?: boolean;
  isTotal?: boolean;
}

const FinancialItem: React.FC<FinancialItemProps> = ({ 
  label, 
  value, 
  isExpense = false,
  isTotal = false 
}) => (
  <div className={`flex justify-between items-center p-2 rounded ${isTotal ? 'bg-gray-700/50 border-t border-gray-600' : ''}`}>
    <span className={`text-white/80 ${isTotal ? 'font-semibold' : ''}`}>{label}</span>
    <span className={`font-medium ${isExpense ? 'text-red-400' : 'text-green-400'} ${isTotal ? 'text-lg' : ''}`}>
      {isExpense && !value.startsWith('-') ? '-' : ''}{value}
    </span>
  </div>
);

interface ProductStatProps {
  label: string;
  value: string;
  subValue: string;
}

const ProductStat: React.FC<ProductStatProps> = ({ label, value, subValue }) => (
  <div className="text-center">
    <p className="text-white/70 text-sm mb-1">{label}</p>
    <p className="text-white font-semibold text-lg">{value}</p>
    <p className="text-white/50 text-xs">{subValue}</p>
  </div>
);

export default MonthlyReportModal;
