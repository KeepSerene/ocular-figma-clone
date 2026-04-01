/*
 * ICON ONLY - LOGO MARK
 */
export const OcularIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    aria-label="Ocular logo mark"
  >
    {/*
     * Eye / lens silhouette — the classic almond form of an eye,
     * or optically: the cross-section of a precision lens.
     */}
    <path
      d="M 5,32 C 18,7 46,7 59,32 C 46,57 18,57 5,32 Z"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />

    {/*
     * Iris ring — a perfect circle inside the eye.
     * In design-tool language: a closed vector path.
     */}
    <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1.75" />

    {/*
     * Vector anchor nodes — four filled squares at N / E / S / W
     * of the iris circumference. In any vector editor (Figma, Illustrator,
     * Pen tool) these are exactly what path anchor handles look like.
     *
     * They serve double duty: iris detail + anchor-point metaphor.
     * This is the "aha" layer of the mark.
     */}
    {/* N (32, 20) */}
    <rect
      x="29.5"
      y="17.5"
      width="5"
      height="5"
      rx="0.75"
      fill="currentColor"
    />
    {/* E (44, 32) */}
    <rect
      x="41.5"
      y="29.5"
      width="5"
      height="5"
      rx="0.75"
      fill="currentColor"
    />
    {/* S (32, 44) */}
    <rect
      x="29.5"
      y="41.5"
      width="5"
      height="5"
      rx="0.75"
      fill="currentColor"
    />
    {/* W (20, 32) */}
    <rect
      x="17.5"
      y="29.5"
      width="5"
      height="5"
      rx="0.75"
      fill="currentColor"
    />

    {/* Pupil — the focal point */}
    <circle cx="32" cy="32" r="5" fill="currentColor" />

    {/*
     * Lens glint — a small highlight that reads as optical glass,
     * tying the "precision instrument" quality back to the name Ocular.
     */}
    <circle cx="26.5" cy="26.5" r="1.75" fill="currentColor" opacity="0.4" />
  </svg>
);

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = 32, showText = true, className = "" }: LogoProps) => (
  <div
    className={className}
    style={{
      display: "flex",
      alignItems: "center",
      gap: `${Math.round(size * 0.28)}px`,
    }}
  >
    <OcularIcon size={size} />

    {showText && (
      <span
        style={{
          fontFamily:
            "var(--font-sans), 'Open Sans', ui-sans-serif, system-ui, sans-serif",
          fontSize: `${size * 0.72}px`,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Ocular
      </span>
    )}
  </div>
);

export default Logo;
