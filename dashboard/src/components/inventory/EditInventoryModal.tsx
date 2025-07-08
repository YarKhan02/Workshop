import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import Portal from '../ui/Portal';
import type { Inventory } from '../../types';
import { updateInventory } from '../../api/inventory';

interface EditInventoryModalProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
}

const EditInventoryModal: React.FC<EditInventoryModalProps> = ({ open, onClose, inventory }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Inventory>>({
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    sku: '',
    category: '',
  });

  useEffect(() => {
    if (inventory) {
      setFormData({
        name: inventory.name,
        price: inventory.price,
        quantity: inventory.quantity,
        description: inventory.description || '',
        sku: inventory.sku || '',
        category: inventory.category || '',
      });
    }
  }, [inventory]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<Inventory>) => updateInventory(inventory!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      toast.success('Inventory item updated');
      handleClose();
    },
    onError: () => {
      toast.error('Failed to update inventory');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === undefined || formData.quantity === undefined) {
      toast.error('Name, price, and quantity are required');
      return;
    }
    mutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({ name: '', price: 0, quantity: 0, description: '', sku: '', category: '' });
    onClose();
  };

  if (!open || !inventory) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Edit Inventory</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={mutation.status === 'pending'}
              >
                {mutation.status === 'pending' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default EditInventoryModal; 