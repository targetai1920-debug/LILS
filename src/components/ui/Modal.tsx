'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}

/** Modal accesible: gestiona foco al abrir/cerrar, cierre con Escape y trampa de foco básica. */
export function Modal({ titleId, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-blue-dark/70 p-0 backdrop-blur-sm md:items-center md:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-slide-up max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] border border-brand-blue/10 bg-brand-cream p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] outline-none md:rounded-[2.25rem] md:p-6"
      >
        {children}
      </div>
    </div>
  );
}
