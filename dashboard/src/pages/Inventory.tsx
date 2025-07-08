import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInventories, createInventory, updateInventory, deleteInventory } from '../api/inventory';
import type { Inventory } from '../types';
import AddInventoryModal from '../components/inventory/AddInventoryModal';
import EditInventoryModal from '../components/inventory/EditInventoryModal';

const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch inventories
  const { data, isLoading } = useQuery({
    queryKey: ['inventories', currentPage, searchTerm],
    queryFn: async () => {
      return getInventories({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      });
    },
  });

  const inventories: Inventory[] = data?.inventories || [];
  const pagination = data?.pagination;

  // Mutations
  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      toast.success('Inventory deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete inventory');
    },
  });

  // Handlers
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryMutation.mutate(id);
    }
  };

  const handleEdit = (item: Inventory) => {
    setSelectedInventory(item);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2" /> Add Inventory
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
            ) : inventories.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">No inventory found.</td></tr>
            ) : (
              inventories.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.price}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.sku || '-'}</td>
                  <td className="px-4 py-2 border">{item.category || '-'}</td>
                  <td className="px-4 py-2 border">
                    <button onClick={() => handleEdit(item)} className="mr-2 text-blue-600 hover:underline"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      <AddInventoryModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditInventoryModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} inventory={selectedInventory} />
    </div>
  );
};

export default InventoryPage; 