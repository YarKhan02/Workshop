import React, { useState } from 'react';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';
import type { NotificationFilter } from '../types/notification';

// Reusable Components
import { PageHeader, StatsCard, ActionButton } from '../components/shared';
import { FilterBar, NotificationList } from '../components/features/notifications';

const Notifications: React.FC = () => {
  const { 
    stats, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    filterNotifications 
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredNotifications = filterNotifications(activeFilter);

  const handleBulkAction = async (action: 'read' | 'delete') => {
    if (selectedIds.length === 0) return;

    if (action === 'read') {
      await Promise.all(selectedIds.map(id => markAsRead(id)));
    } else {
      await Promise.all(selectedIds.map(id => deleteNotification(id)));
    }
    setSelectedIds([]);
  };

  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(existingId => existingId !== id));
    }
  };

  // Actions for header
  const headerActions = (
    <ActionButton
      onClick={() => console.log('Add notification feature coming soon')}
      icon={<PlusIcon className="h-5 w-5" />}
      variant="primary"
    >
      Add Notification
    </ActionButton>
  );

  // Bulk actions for filter bar
  const bulkActions = (
    <>
      {selectedIds.length > 0 && (
        <>
          <ActionButton
            onClick={() => handleBulkAction('read')}
            icon={<CheckIcon className="h-4 w-4" />}
            variant="success"
            size="sm"
          >
            Mark Read ({selectedIds.length})
          </ActionButton>
          <ActionButton
            onClick={() => handleBulkAction('delete')}
            icon={<TrashIcon className="h-4 w-4" />}
            variant="danger"
            size="sm"
          >
            Delete ({selectedIds.length})
          </ActionButton>
        </>
      )}
      
      {stats.unread > 0 && (
        <ActionButton
          onClick={markAllAsRead}
          icon={<CheckIcon className="h-4 w-4" />}
          variant="warning"
          size="sm"
        >
          Mark All Read
        </ActionButton>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Notifications"
          subtitle="Manage your system notifications and alerts"
          icon={<BellIcon className="h-8 w-8 text-orange-400" />}
          actions={headerActions}
          delay={0}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total"
            value={stats.total}
            icon={<BellIcon className="h-8 w-8" />}
            delay={0.1}
          />
          <StatsCard
            title="Unread"
            value={stats.unread}
            icon={<BellIcon className="h-8 w-8" />}
            color="primary"
            hasAlert={stats.unread > 0}
            delay={0.15}
          />
          <StatsCard
            title="Urgent"
            value={stats.byPriority.urgent}
            icon={<ExclamationTriangleIcon className="h-8 w-8" />}
            color="danger"
            delay={0.2}
          />
          <StatsCard
            title="Bookings"
            value={stats.byType.booking}
            icon={<CalendarDaysIcon className="h-8 w-8" />}
            color="info"
            delay={0.25}
          />
        </div>

        {/* Filters and Actions */}
        <FilterBar
          filter={activeFilter}
          onFilterChange={setActiveFilter}
          bulkActions={bulkActions}
          delay={0.3}
        />

        {/* Notifications List */}
        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          delay={0.35}
        />
      </div>
    </div>
  );
};

export default Notifications;
