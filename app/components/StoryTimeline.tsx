'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import OrnamentDivider from './OrnamentDivider';

import type { Prosesi } from '@/lib/types';

/* ─── Generic Timeline Icon ─── */
const GENERIC_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6">
    <path d="M12 22s-8-5.2-8-11a8 8 0 0 1 16 0c0 5.8-8 11-8 11Z" />
    <circle cx="12" cy="11" r="3" />
  </svg>
);

/* ─── Bugis decorative icon wrapper ─── */
function EventIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      {/* outer diamond ring */}
      <svg viewBox="0 0 56 56" className="absolute inset-0 w-14 h-14 text-bugis-gold/30" fill="none">
        <path d="M28 1L55 28L28 55L1 28Z" stroke="currentColor" strokeWidth="1" />
        <path d="M28 8L48 28L28 48L8 28Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
      </svg>
      {/* inner filled diamond */}
      <div className="relative w-14 h-14 flex items-center justify-center text-bugis-gold">
        {children}
      </div>
    </div>
  );
}

/* ─── Single timeline item ─── */
function TimelineItem({
  event,
  index,
  isLast,
}: {
  event: Prosesi;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' });

  const isLeft = index % 2 === 0; // alternate sides on desktop

  return (
    <div ref={ref} className="relative flex flex-col md:flex-row items-start gap-0 md:gap-8">
      {/* ── Desktop left card (even) ── */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className={`hidden md:flex md:w-[calc(50%-2.5rem)] flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left opacity-0 pointer-events-none'}`}
      >
        {isLeft && <EventCard event={event} index={index} />}
      </motion.div>

      {/* ── Center timeline node ── */}
      <div className="relative z-10 flex-col items-center hidden md:flex" style={{ width: '5rem' }}>
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-bugis-gold/40 to-bugis-gold/40" style={{ minHeight: 32 }} />
        <EventIcon>{GENERIC_ICON}</EventIcon>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-bugis-gold/40 via-bugis-gold/40 to-transparent" style={{ minHeight: 32 }} />
        )}
      </div>

      {/* ── Desktop right card (odd) ── */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className={`hidden md:flex md:w-[calc(50%-2.5rem)] flex-col ${!isLeft ? 'items-start text-left' : 'opacity-0 pointer-events-none'}`}
      >
        {!isLeft && <EventCard event={event} index={index} />}
      </motion.div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden items-start gap-4 w-full">
        {/* Mobile vertical line + icon */}
        <div className="flex flex-col items-center shrink-0">
          {index > 0 && <div className="w-px h-6 bg-bugis-gold/30" />}
          <EventIcon>{GENERIC_ICON}</EventIcon>
          {!isLast && <div className="w-px flex-1 bg-bugis-gold/30 min-h-[24px]" />}
        </div>

        {/* Mobile card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="flex-1 pb-10"
        >
          <EventCard event={event} index={index} />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Card content ─── */
function EventCard({ event, index }: { event: Prosesi; index: number }) {
  const numDisplay = String(index + 1).padStart(2, '0');
  return (
    <div
      className="relative bg-white rounded-2xl p-6 shadow-md border border-bugis-gold/15 max-w-sm w-full overflow-hidden group"
      style={{ boxShadow: '0 2px 20px rgba(107,29,29,0.06), 0 0 0 1px rgba(201,162,39,0.1)' }}
    >
      {/* Corner accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-bugis-maroon/0 via-bugis-gold to-bugis-maroon/0 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Event number badge */}
      <span className="font-cormorant font-bold text-4xl text-bugis-gold/20 absolute top-3 right-5 leading-none select-none">
        {numDisplay}
      </span>

      <h3 className="font-playfair text-xl font-bold text-bugis-maroon mb-0.5 leading-tight pr-10">
        {event.name}
      </h3>
      <p className="font-poppins text-xs text-bugis-gold mb-3 italic">{event.subtitle}</p>

      {/* Date + time chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 font-poppins text-[10px] text-bugis-deepgreen bg-bugis-deepgreen/8 border border-bugis-deepgreen/20 rounded-full px-3 py-1">
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="2" width="10" height="9" rx="1.5" />
            <path d="M4 1v2M8 1v2M1 5h10" />
          </svg>
          {event.event_date || 'TBA'}
        </span>
        <span className="inline-flex items-center gap-1.5 font-poppins text-[10px] text-bugis-maroon bg-bugis-maroon/8 border border-bugis-maroon/20 rounded-full px-3 py-1">
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3.5l2.5 1.5" />
          </svg>
          {event.event_time || 'TBA'}
        </span>
      </div>

      <p className="font-poppins text-xs text-gray-500 leading-relaxed whitespace-pre-line">{event.description}</p>
    </div>
  );
}

/* ─── Main Export ─── */
export default function StoryTimeline({ data }: { data: Prosesi[] }) {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section id="prosesi" className="py-20 md:py-28 bg-bugis-cream px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: -20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <h2 className="font-playfair text-3xl md:text-5xl text-bugis-deepgreen">
            Prosesi Pernikahan
          </h2>
          <p className="font-poppins text-sm text-bugis-maroon/60 mt-3">
            Rangkaian adat Bugis yang kami jalani
          </p>
        </motion.div>

        <OrnamentDivider className="mb-12" />

        {/* Timeline */}
        <div className="relative">
          {/* Desktop center axis line */}
          <div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,162,39,0.3) 10%, rgba(201,162,39,0.3) 90%, transparent)' }}
          />

          <div className="flex flex-col gap-12 md:gap-10">
            {data.length === 0 && (
              <p className="text-center text-gray-400 font-poppins text-sm py-10">Belum ada data prosesi.</p>
            )}
            {data.map((event, index) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={index}
                isLast={index === data.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
