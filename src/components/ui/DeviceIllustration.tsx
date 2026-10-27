interface DeviceIllustrationProps {
  /** Accessible name; omit (default) when the image is decorative. */
  title?: string
  className?: string
}

/**
 * Simple inline SVG of a DIN-rail measuring device, used wherever a product
 * or category has no photo. Colors come from the design tokens.
 */
export function DeviceIllustration({ title, className }: DeviceIllustrationProps) {
  const labelled = Boolean(title)
  return (
    <svg
      className={className}
      viewBox="0 0 240 180"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {labelled && <title>{title}</title>}
      {/* DIN rail */}
      <rect x="16" y="78" width="208" height="24" rx="3" fill="var(--color-border-strong)" />
      <rect x="16" y="86" width="208" height="8" fill="var(--color-text-muted)" opacity="0.35" />
      {/* Device body */}
      <rect x="62" y="30" width="116" height="120" rx="8" fill="var(--color-navy)" />
      <rect x="70" y="38" width="100" height="104" rx="5" fill="var(--color-navy-raised)" />
      {/* Display */}
      <rect x="80" y="48" width="80" height="40" rx="3" fill="var(--color-bg)" />
      <rect x="86" y="56" width="22" height="10" rx="1.5" fill="var(--color-brand)" />
      <rect x="112" y="56" width="42" height="10" rx="1.5" fill="var(--color-border)" />
      <rect x="86" y="72" width="68" height="8" rx="1.5" fill="var(--color-border)" />
      {/* Buttons */}
      <circle cx="92" cy="106" r="6" fill="var(--color-accent)" />
      <circle cx="112" cy="106" r="6" fill="var(--color-border)" />
      <circle cx="132" cy="106" r="6" fill="var(--color-border)" />
      <circle cx="152" cy="106" r="6" fill="var(--color-border)" />
      {/* Terminals */}
      <g fill="var(--color-navy)">
        <rect x="74" y="124" width="12" height="12" rx="2" />
        <rect x="92" y="124" width="12" height="12" rx="2" />
        <rect x="110" y="124" width="12" height="12" rx="2" />
        <rect x="128" y="124" width="12" height="12" rx="2" />
        <rect x="146" y="124" width="12" height="12" rx="2" />
      </g>
      <g fill="var(--color-border-strong)">
        <rect x="78" y="128" width="4" height="4" />
        <rect x="96" y="128" width="4" height="4" />
        <rect x="114" y="128" width="4" height="4" />
        <rect x="132" y="128" width="4" height="4" />
        <rect x="150" y="128" width="4" height="4" />
      </g>
      {/* Brand accent bar */}
      <rect x="70" y="142" width="100" height="4" rx="2" fill="var(--color-brand)" />
    </svg>
  )
}
