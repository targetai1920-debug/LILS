'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    dialogRef.current?.focus();
    if (dialogRef.current) dialogRef.current.scrollTop = 0;

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
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-brand-blue-dark/70 p-0 backdrop-blur-sm md:items-center md:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-slide-up h-[100dvh] max-h-[100dvh] w-full max-w-lg touch-pan-y overflow-y-auto overscroll-contain border border-brand-blue/10 bg-brand-cream px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] outline-none md:h-auto md:max-h-[calc(100dvh-2rem)] md:rounded-[2.25rem] md:px-6 md:pb-6"
      >
        <div className="sticky top-0 z-30 -mx-2 mb-2 flex justify-end bg-gradient-to-b from-brand-cream via-brand-cream to-transparent px-2 pb-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar selección"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-brand-blue/20 bg-brand-white px-4 py-2 font-display text-sm font-black text-brand-blue shadow-md transition hover:-translate-y-0.5 hover:bg-brand-blue hover:text-brand-white"
          >
            <span>Cerrar</span>
            <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
