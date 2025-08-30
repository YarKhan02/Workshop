import React from 'react';
import { Trash2 } from 'lucide-react';
import type { InvoiceItemWithProduct } from './types';

interface InvoiceItemsListProps {
  items: InvoiceItemWithProduct[];
  onUpdateItem: (index: number, field: keyof InvoiceItemWithProduct, value: any) => void;
  onRemoveItem: (index: number) => void;
  errors: Record<string, string>;
  formatCurrency: (amount: number) => string;
}

const InvoiceItemsList: React.FC<InvoiceItemsListProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  errors,
  formatCurrency,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 border border-dashed border-gray-600 rounded-lg bg-gray-700/50">
        <p className="mb-2">No items added yet.</p>
        <p>Click "Add Product" to start adding items to this invoice.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => onUpdateItem(index, "description", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                errors[`item${index}Description`] ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Service description"
              readOnly={!!item.variantId}
            />
            {errors[`item${index}Description`] && (
              <p className="mt-1 text-sm text-red-400">{errors[`item${index}Description`]}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={item.quantity === 0 ? '' : item.quantity}
              onChange={(e) => onUpdateItem(index, "quantity", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white ${
                errors[`item${index}Quantity`] ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors[`item${index}Quantity`] && (
              <p className="mt-1 text-sm text-red-400">{errors[`item${index}Quantity`]}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Unit Price <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.unitPrice || ''}
              onChange={(e) => onUpdateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white ${
                errors[`item${index}UnitPrice`] ? "border-red-500" : "border-gray-600"
              }`}
              readOnly={!!item.variantId}
            />
            {errors[`item${index}UnitPrice`] && (
              <p className="mt-1 text-sm text-red-400">{errors[`item${index}UnitPrice`]}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Total</label>
            <input
              type="text"
              value={formatCurrency(item.totalPrice)}
              readOnly
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-600 text-gray-300"
            />
          </div>
          <div className="col-span-1">
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              disabled={items.length === 1}
              className="p-2 text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              title="Remove Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceItemsList;
