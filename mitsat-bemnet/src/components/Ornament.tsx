/**
 * Ornament — a small reusable divider (hairline — diamond — hairline)
 * used to give sections the feel of printed stationery.
 */

interface OrnamentProps {
  className?: string
  tone?: 'forest' | 'cream'
}

export default function Ornament({ className = '', tone = 'forest' }: OrnamentProps) {
  const color = tone === 'forest' ? '#304B38' : '#EED7AC'

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: color, opacity: 0.55 }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L13 7L7 13L1 7Z" stroke={color} strokeWidth="1" />
        <circle cx="7" cy="7" r="1.4" fill={color} />
      </svg>
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: color, opacity: 0.55 }} />
    </div>
  )
}
