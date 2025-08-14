import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme, cn, ThemedInput, ThemedButton } from '../../ui';
import type { ServiceFormData } from '../../../types/service';
import { SERVICE_CATEGORIES } from '../../../types/service';

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  submitLabel?: string;
  showSubmitButton?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  submitLabel = 'Create Service',
  showSubmitButton = true,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: 'maintenance',
    price: 0,
    is_active: true,
    items: [],
    ...initialData,
  });

  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (initialData) {
      const newFormData: ServiceFormData = {
        name: '',
        description: '',
        category: 'maintenance' as const,
        price: 0,
        is_active: true,
        items: [],
        ...initialData,
      };
      setFormData(newFormData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : 
                     type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { name: newItem.trim() }],
      }));
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textPrimary)}>
            Service Name *
          </label>
          <ThemedInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter service name"
            required
          />
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textPrimary)}>
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              theme.components.input.base,
              theme.components.input.focus
            )}
            required
          >
            {Object.entries(SERVICE_CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textPrimary)}>
            Price (PKR) *
          </label>
          <ThemedInput
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="is_active" className={cn("text-sm", theme.textPrimary)}>
            Active Service
          </label>
        </div>
      </div>

      <div>
        <label className={cn("block text-sm font-medium mb-2", theme.textPrimary)}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter service description"
          rows={3}
          className={cn(
            "w-full px-3 py-2 border rounded-md resize-none",
            theme.components.input.base,
            theme.components.input.focus
          )}
        />
      </div>

      {/* Service Items */}
      <div>
        <label className={cn("block text-sm font-medium mb-2", theme.textPrimary)}>
          Service Items
        </label>
        
        <div className="flex gap-2 mb-3">
          <ThemedInput
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add service item (e.g., Exterior wash, Interior vacuum)"
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem();
              }
            }}
          />
          <ThemedButton
            type="button"
            onClick={handleAddItem}
            variant="secondary"
            size="sm"
            disabled={!newItem.trim()}
          >
            <Plus className="h-4 w-4" />
          </ThemedButton>
        </div>

        {formData.items.length > 0 && (
          <div className="space-y-2">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md",
                  theme.backgroundSecondary
                )}
              >
                <span className={cn("text-sm", theme.textPrimary)}>{item.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className={cn(
                    "p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors",
                    "text-red-600 hover:text-red-700"
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button - Only show if enabled */}
      {showSubmitButton && (
        <div className="flex justify-end pt-6">
          <ThemedButton
            type="submit"
            variant="primary"
            disabled={!formData.name.trim()}
          >
            {submitLabel}
          </ThemedButton>
        </div>
      )}
    </form>
  );
};

export default ServiceForm;
