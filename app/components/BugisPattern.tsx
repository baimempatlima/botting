export default function BugisPattern({ 
  className = "", 
  opacity = "0.05",
  color = "currentColor"
}: { 
  className?: string, 
  opacity?: string,
  color?: string 
}) {
  return (
    <svg 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern 
          id="bugis-songket-motif" 
          width="48" 
          height="48" 
          patternUnits="userSpaceOnUse" 
          patternTransform="scale(1.5)"
        >
          {/* Sulapa Eppa (Diamond) Core Motif */}
          <path d="M24 0 L48 24 L24 48 L0 24 Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
          <path d="M24 6 L42 24 L24 42 L6 24 Z" fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
          <path d="M24 12 L36 24 L24 36 L12 24 Z" fill={color} opacity={`calc(${opacity} * 2)`} />
          
          {/* Geometric connection lines */}
          <line x1="0" y1="24" x2="48" y2="24" stroke={color} strokeWidth="0.5" opacity={opacity} strokeDasharray="2 2" />
          <line x1="24" y1="0" x2="24" y2="48" stroke={color} strokeWidth="0.5" opacity={opacity} strokeDasharray="2 2" />
          
          {/* Corner accents */}
          <circle cx="0" cy="0" r="1.5" fill={color} opacity={opacity} />
          <circle cx="48" cy="0" r="1.5" fill={color} opacity={opacity} />
          <circle cx="0" cy="48" r="1.5" fill={color} opacity={opacity} />
          <circle cx="48" cy="48" r="1.5" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bugis-songket-motif)" />
    </svg>
  );
}
