import React from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { FilterSelect } from '../../shared/forms';
import type { NotificationFilter } from '../../../types/notification';

interface FilterBarProps {
  filter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  bulkActions?: React.ReactNode;
  delay?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filter, 
  onFilterChange, 
  bulkActions,
  delay = 0 
}) => {
  const typeOptions = [
    { value: 'booking', label: 'Bookings' },
    { value: 'system', label: 'System' },
    { value: 'warning', label: 'Warnings' },
    { value: 'error', label: 'Errors' },
    { value: 'success', label: 'Success' },
    { value: 'info', label: 'Info' }
  ];

  const statusOptions = [
    { value: 'false', label: 'Unread' },
    { value: 'true', label: 'Read' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 mb-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          
          <FilterSelect
            value={filter.type || ''}
            onChange={(value) => onFilterChange({ 
              ...filter, 
              type: value as any || undefined 
            })}
            options={typeOptions}
            placeholder="All Types"
          />

          <FilterSelect
            value={filter.isRead === undefined ? '' : String(filter.isRead)}
            onChange={(value) => onFilterChange({ 
              ...filter, 
              isRead: value === '' ? undefined : value === 'true'
            })}
            options={statusOptions}
            placeholder="All Status"
          />

          <FilterSelect
            value={filter.priority || ''}
            onChange={(value) => onFilterChange({ 
              ...filter, 
              priority: value as any || undefined 
            })}
            options={priorityOptions}
            placeholder="All Priority"
          />
        </div>

        {bulkActions && (
          <div className="flex items-center gap-2">
            {bulkActions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FilterBar;
