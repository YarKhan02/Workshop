import { createPortal } from 'react-dom';

export default function Portal({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') return null;
  const modalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(children, modalRoot);
} 