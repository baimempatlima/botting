'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Tiny Bugis Diamond Ornament used in card corners ─── */
function CardCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-3 h-3 md:w-4 md:h-4 text-bugis-gold/60 absolute ${className}`}
      fill="currentColor"
    >
      <path d="M8 0 L16 8 L8 16 L0 8 Z" />
      <path d="M8 4 L12 8 L8 12 L4 8 Z" fill="transparent" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ─── Animating Digit Card ─── */
function DigitCard({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Pad to 2 digits
  const display = String(value).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3"
    >
      {/* Card */}
      <div className="relative">
        {/* Gold border frame with corner diamonds */}
        <div
          className="relative w-[72px] h-[72px] md:w-[96px] md:h-[96px] flex items-center justify-center rounded-xl"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
            border: '1px solid rgba(201,162,39,0.5)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(201,162,39,0.2)',
          }}
        >
          {/* Corner ornaments */}
          <CardCorner className="top-0.5 left-0.5" />
          <CardCorner className="top-0.5 right-0.5" />
          <CardCorner className="bottom-0.5 left-0.5" />
          <CardCorner className="bottom-0.5 right-0.5" />

          {/* Digit */}
          <motion.span
            suppressHydrationWarning
            key={display}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="font-cormorant font-bold text-bugis-cream"
            style={{ fontSize: 'clamp(1.8rem, 7vw, 2.8rem)', lineHeight: 1 }}
          >
            {display}
          </motion.span>
        </div>

        {/* Thin gold bottom accent line */}
        <div className="absolute -bottom-px left-4 right-4 h-px bg-bugis-gold/40" />
      </div>

      {/* Label */}
      <span className="font-poppins text-[10px] md:text-xs uppercase tracking-[0.2em] text-bugis-gold/70">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Separator dot between cards ─── */
function Separator() {
  return (
    <div className="flex flex-col gap-1.5 items-center self-center mb-6">
      <div className="w-1 h-1 rounded-full bg-bugis-gold/60" />
      <div className="w-1 h-1 rounded-full bg-bugis-gold/60" />
    </div>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({ dateStr }: { dateStr: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center mb-14"
    >
      {/* Ornament top line */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-12 bg-bugis-gold/40" />
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-bugis-gold" fill="currentColor">
          <path d="M6 0L12 6L6 12L0 6Z" />
        </svg>
        <div className="h-px w-12 bg-bugis-gold/40" />
      </div>
      <h2 className="font-playfair text-3xl md:text-5xl text-bugis-cream">Menuju Hari Bahagia</h2>
      <p className="font-poppins text-xs text-bugis-gold/60 tracking-[0.25em] uppercase mt-3">
        {new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, ' · ')}
      </p>
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function Countdown({ weddingDate }: { weddingDate: string }) {
  const WEDDING_DATE = new Date(weddingDate);

  const compute = () => {
    const diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(compute);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(compute()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = [
    { label: 'Hari', value: mounted ? timeLeft.days : 0 },
    { label: 'Jam', value: mounted ? timeLeft.hours : 0 },
    { label: 'Menit', value: mounted ? timeLeft.minutes : 0 },
    { label: 'Detik', value: mounted ? timeLeft.seconds : 0 },
  ];

  return (
    <section
      id="countdown"
      className="relative py-20 md:py-28 px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #3a1010 0%, #6B1D1D 45%, #1F4B3F 100%)',
      }}
    >
      {/* Subtle inner border glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bugis-gold/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bugis-gold/50 to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <SectionHeading dateStr={weddingDate} />

        {/* Digit cards row */}
        <div className="flex items-start justify-center gap-2 md:gap-4">
          <DigitCard value={units[0].value} label={units[0].label} delay={0.1} />
          <Separator />
          <DigitCard value={units[1].value} label={units[1].label} delay={0.2} />
          <Separator />
          <DigitCard value={units[2].value} label={units[2].label} delay={0.3} />
          <Separator />
          <DigitCard value={units[3].value} label={units[3].label} delay={0.4} />
        </div>
      </div>
    </section>
  );
}
