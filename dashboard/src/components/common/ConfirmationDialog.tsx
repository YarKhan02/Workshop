import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../shared/overlays/dialog';
import { useTheme, cn } from '../ui';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}) => {
  const { theme } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-700",
        "shadow-xl"
      )}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              variant === 'destructive' 
                ? "bg-red-100 dark:bg-red-900/20" 
                : "bg-orange-100 dark:bg-orange-900/20"
            )}>
              <AlertTriangle className={cn(
                "h-5 w-5",
                variant === 'destructive' 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-orange-600 dark:text-orange-400"
              )} />
            </div>
            <DialogTitle className={cn("text-lg font-semibold", theme.textPrimary)}>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className={cn("text-sm leading-relaxed", theme.textSecondary)}>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              theme.border,
              theme.textSecondary,
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "text-white",
              variant === 'destructive'
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "cursor-wait"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
