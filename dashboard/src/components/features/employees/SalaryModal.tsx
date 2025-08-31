
import { FormModal } from '../../shared';
import InputField from '../../form/InputField';
import ActionButton from '../../shared/buttons/ActionButton';
import { FileText } from 'lucide-react';
import { MONTHS, getRecentYears } from './helpers/dateOptions';


interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  amount: string;
  bonus?: string;
  currentSalary?: string | number;
  onMonthChange: (month: string) => void;
  onAmountChange: (amount: string) => void;
  onBonusChange?: (bonus: string) => void;
  onSave: (selectedMonth: string, selectedYear: string) => void;
}

const SalaryModal: React.FC<SalaryModalProps> = ({ isOpen, onClose, month, amount, bonus = '', currentSalary, onMonthChange, onAmountChange, onBonusChange, onSave }) => {
  const [selectedMonth, selectedYear] = (() => {
    const [m, y] = month.split(' ');
    return [m || '', y || String(new Date().getFullYear())];
  })();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pay Salary"
    >
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">Month</label>
        <div className="flex gap-2">
          <select
            className="w-1/2 p-2 rounded bg-slate-800 text-slate-100 border border-slate-600"
            value={selectedMonth}
            onChange={e => onMonthChange(`${e.target.value} ${selectedYear}`)}
          >
            <option value="">Select Month</option>
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            className="w-1/2 p-2 rounded bg-slate-800 text-slate-100 border border-slate-600"
            value={selectedYear}
            onChange={e => onMonthChange(`${selectedMonth} ${e.target.value}`)}
          >
            {getRecentYears(5).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      <InputField
        id="salary-amount"
        label="Amount"
        type="number"
        value={amount}
        placeholder={currentSalary ? `Current: ${currentSalary}` : 'Enter amount'}
        Icon={FileText}
        onChange={e => onAmountChange(e.target.value)}
      />
      <InputField
        id="salary-bonus"
        label="Bonus"
        type="number"
        value={bonus}
        placeholder="Enter bonus (optional)"
        Icon={FileText}
        onChange={e => onBonusChange && onBonusChange(e.target.value)}
      />
      <div className="mt-6 flex justify-end">
        <ActionButton onClick={onClose} icon={null} variant="secondary">Cancel</ActionButton>
        <ActionButton onClick={() => onSave(selectedMonth, selectedYear)} icon={null} variant="primary" className="ml-2">Save</ActionButton>
      </div>
    </FormModal>
  );
};

export default SalaryModal;
