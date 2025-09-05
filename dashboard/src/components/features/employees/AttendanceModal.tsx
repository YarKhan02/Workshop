import React from 'react';
import { FormModal } from '../../shared';
import InputField from '../../form/InputField';
import { CalendarCheck } from 'lucide-react';
import ActionButton from '../../shared/buttons/ActionButton';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
  onDateChange: (date: string) => void;
  onStatusChange: (status: 'Present' | 'Absent' | 'Leave' | 'Half-Day') => void;
  onSave: () => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose, date, status, onDateChange, onStatusChange, onSave }) => (
  <FormModal
    isOpen={isOpen}
    onClose={onClose}
    title="Edit Attendance"
  >
    <InputField
      id="attendance-date"
      label="Date"
      type="date"
      value={date}
      placeholder="Select date"
      Icon={CalendarCheck}
      onChange={e => onDateChange(e.target.value)}
    />
    <div className="mt-4">
      <label className="block text-sm text-slate-400 mb-2">Status</label>
      <select
        className="w-full p-2 rounded bg-slate-800 text-slate-100 border border-slate-600"
        value={status}
        onChange={e => onStatusChange(e.target.value as any)}
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Leave">Leave</option>
        <option value="Half-Day">Half Day</option>
      </select>
    </div>
    <div className="mt-6 flex justify-end">
      <ActionButton onClick={onClose} icon={null} variant="secondary">Cancel</ActionButton>
      <ActionButton onClick={onSave} icon={null} variant="primary" className="ml-2">Save</ActionButton>
    </div>
  </FormModal>
);

export default AttendanceModal;
