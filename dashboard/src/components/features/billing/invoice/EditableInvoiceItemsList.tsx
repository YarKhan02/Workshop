import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { InvoiceItem } from '../../../../types/billing';

interface EditableInvoiceItem extends Omit<InvoiceItem, 'id' | 'invoiceId' | 'isActive' | 'createdAt' | 'updatedAt'> {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface EditableInvoiceItemsListProps {
  items: EditableInvoiceItem[];
  onUpdateItem: (index: number, field: keyof EditableInvoiceItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  errors: Record<string, string>;
  formatCurrency: (amount: number) => string;
}

const EditableInvoiceItemsList: React.FC<EditableInvoiceItemsListProps> = ({
  items,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  errors,
  formatCurrency,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`item${index}Description`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Service description"
              />
              {errors[`item${index}Description`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`item${index}Description`]}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`item${index}Quantity`] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[`item${index}Quantity`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`item${index}Quantity`]}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => onUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`item${index}UnitPrice`] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[`item${index}UnitPrice`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`item${index}UnitPrice`]}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total
              </label>
              <input
                type="text"
                value={formatCurrency(item.totalPrice)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div className="col-span-1">
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                disabled={items.length === 1}
                className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableInvoiceItemsList;
