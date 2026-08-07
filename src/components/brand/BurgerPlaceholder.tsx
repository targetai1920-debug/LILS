interface BurgerPlaceholderProps {
  className?: string;
  label?: string;
}

/**
 * Placeholder de marca consistente para productos sin fotografía oficial
 * todavía. Se usa en lugar de fotos genéricas de stock, según lo indicado
 * en docs/ASSET_MANIFEST.md.
 */
export function BurgerPlaceholder({ className, label }: BurgerPlaceholderProps) {
  return (
    <div
      className={`checker-pattern-light flex items-center justify-center overflow-hidden ${className ?? ''}`}
      role="img"
      aria-label={label ? `Foto próximamente: ${label}` : 'Foto próximamente'}
    >
      <svg viewBox="0 0 120 90" className="h-3/5 w-3/5" fill="none">
        <ellipse cx="60" cy="22" rx="38" ry="16" fill="var(--brand-blue)" />
        <rect x="20" y="34" width="80" height="10" rx="5" fill="var(--brand-white)" />
        <rect x="20" y="46" width="80" height="12" rx="4" fill="var(--brand-blue)" />
        <rect x="20" y="60" width="80" height="10" rx="5" fill="var(--brand-white)" />
        <ellipse cx="60" cy="76" rx="38" ry="10" fill="var(--brand-blue)" />
      </svg>
    </div>
  );
}
