export default function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full py-8 opacity-90 ${className}`}>
      {/* Left Line */}
      <div className="h-px flex-1 max-w-[120px] md:max-w-[200px] bg-gradient-to-r from-transparent to-bugis-gold/80" />
      
      {/* Center Ornament (Bugis Geometric Diamond Motif) */}
      <svg 
        width="80" 
        height="24" 
        viewBox="0 0 80 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="mx-3 md:mx-6 text-bugis-gold shrink-0"
      >
        {/* Main Diamond */}
        <path d="M40 2L50 12L40 22L30 12L40 2Z" stroke="currentColor" strokeWidth="1" />
        {/* Inner Diamond Solid */}
        <path d="M40 7L45 12L40 17L35 12L40 7Z" fill="currentColor" opacity="0.8" />
        
        {/* Connecting side lines inside ornament */}
        <path d="M18 12H30 M50 12H62" stroke="currentColor" strokeWidth="1" />
        
        {/* Side decorative dots */}
        <circle cx="14" cy="12" r="2" fill="currentColor" />
        <circle cx="66" cy="12" r="2" fill="currentColor" />
        
        <circle cx="8" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="72" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
        
        <circle cx="2" cy="12" r="1" fill="currentColor" opacity="0.3" />
        <circle cx="78" cy="12" r="1" fill="currentColor" opacity="0.3" />
      </svg>
      
      {/* Right Line */}
      <div className="h-px flex-1 max-w-[120px] md:max-w-[200px] bg-gradient-to-l from-transparent to-bugis-gold/80" />
    </div>
  );
}
