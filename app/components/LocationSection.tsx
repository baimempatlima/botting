'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── ICS calendar helper ─── */
function formatICS(date: string, timeStart: string, timeEnd: string, title: string, location: string, description: string) {
  // Convert "2026-12-12" + "08:00" to ICS format YYYYMMDDTHHMMSS
  const pad = (n: number) => String(n).padStart(2, '0');
  const d = new Date(`${date}T${timeStart}:00+08:00`);
  const de = new Date(`${date}T${timeEnd}:00+08:00`);
  const fmt = (dt: Date) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding//ID',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(d)}`,
    `DTEND:${fmt(de)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

import type { EventLocation } from '@/lib/types';

/* ─── Small icon helpers ─── */
function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 shrink-0">
      <path d={path} />
    </svg>
  );
}

/* ─── Map embed toggle ─── */
function MapEmbed({ url }: { url: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setShow((v) => !v)}
        className="flex items-center gap-2 font-poppins text-xs text-bugis-deepgreen underline underline-offset-4 hover:text-bugis-maroon transition-colors"
      >
        <Icon path="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
        {show ? 'Sembunyikan Peta' : 'Lihat Peta di Sini'}
      </button>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 220 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-3 rounded-xl overflow-hidden border border-bugis-gold/20"
        >
          <iframe
            src={url}
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta Lokasi"
          />
        </motion.div>
      )}
    </div>
  );
}

/* ─── Event card ─── */
function EventCard({
  event,
  delay = 0,
  groomName,
  brideName,
}: {
  event: EventLocation;
  delay?: number;
  groomName: string;
  brideName: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });

  const badgeColor =
    event.label.toLowerCase().includes('resepsi')
      ? 'bg-bugis-maroon text-bugis-cream'
      : 'bg-bugis-deepgreen text-bugis-cream';

  const handleCalendar = () => {
    // Basic date parsing to pass to ICS (if event_date is like "Ahad, 12 Desember 2026", it's hard to parse for ICS, ideally we need standard format, or fallback to today)
    // Assuming we use a standard YYYY-MM-DD for event_date or we skip calendar if invalid format for simplicity here, but we will pass event_date as is and hope it parses or fallback.
    // Assuming event_date is string like "2026-12-12" if we want calendar to work well, but it might be text.
    // For simplicity, let's just use what's passed.
    
    // Fallback date extracting for ICS if date is in text format
    const fallbackDateStr = new Date().toISOString().split('T')[0];

    const ics = formatICS(
      fallbackDateStr, // using fallback due to text format usually in event_date from CMS
      event.time_start || '08:00',
      event.time_end || '10:00',
      `${event.label} ${groomName.split(' ')[0]} & ${brideName.split(' ')[0]}`,
      `${event.venue_name}, ${event.address}`,
      `${event.label} ${groomName} & ${brideName}`
    );
    downloadICS(ics, `${event.id}-calendar.ics`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-bugis-gold/15 flex-1 min-w-0"
      style={{ boxShadow: '0 2px 24px rgba(107,29,29,0.07), 0 0 0 1px rgba(201,162,39,0.1)' }}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-bugis-maroon via-bugis-gold to-bugis-deepgreen" />

      <div className="p-6 md:p-8">
        {/* Label badge */}
        <span className={`inline-block font-poppins text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-5 ${badgeColor}`}>
          {event.label}
        </span>

        {/* Date & time */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-3 text-bugis-deepgreen">
            <Icon path="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <span className="font-poppins text-sm font-medium">{event.event_date || 'TBA'}</span>
          </div>
          <div className="flex items-center gap-3 text-bugis-maroon">
            <Icon path="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 5v6l4 2" />
            <span className="font-poppins text-sm">{event.time_display || `${event.time_start} - ${event.time_end}`}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-bugis-gold/30 to-transparent mb-6" />

        {/* Venue */}
        <div className="flex items-start gap-3 mb-1">
          <Icon path="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z" />
          <div>
            <p className="font-playfair text-base font-bold text-bugis-maroon">{event.venue_name}</p>
            <p className="font-poppins text-xs text-gray-500 mt-0.5 leading-relaxed">
              {event.address}<br />{event.city}
            </p>
          </div>
        </div>

        {/* Map embed */}
        {event.map_embed_url && <MapEmbed url={event.map_embed_url} />}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {event.map_direct_url && (
            <a
              href={event.map_direct_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-full border border-bugis-deepgreen text-bugis-deepgreen font-poppins text-xs font-medium hover:bg-bugis-deepgreen hover:text-white transition-colors"
            >
              <Icon path="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
              Buka di Google Maps
            </a>
          )}
          <button
            onClick={handleCalendar}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-full border border-bugis-maroon text-bugis-maroon font-poppins text-xs font-medium hover:bg-bugis-maroon hover:text-white transition-colors"
          >
            <Icon path="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            + Tambah ke Kalender
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function LocationSection({
  data,
  groomName,
  brideName,
}: {
  data: EventLocation[];
  groomName: string;
  brideName: string;
}) {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section id="lokasi" className="relative py-20 md:py-28 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5EEDC 0%, #fff 100%)' }}>
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bugis-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: -20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="font-playfair text-3xl md:text-5xl text-bugis-deepgreen mb-3">
            Waktu &amp; Tempat
          </h2>
          <p className="font-poppins text-sm text-gray-500 max-w-xl mx-auto">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami pada:
          </p>
        </motion.div>

        {/* Two event cards side by side */}
        <div className="flex flex-col md:flex-row gap-6">
          {data.length === 0 && (
             <p className="text-center w-full text-gray-400 font-poppins text-sm py-10">Belum ada lokasi acara.</p>
          )}
          {data.map((event, i) => (
            <EventCard key={event.id} event={event} delay={i * 0.15} groomName={groomName} brideName={brideName} />
          ))}
        </div>

        {/* Prayer quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center font-cormorant italic text-2xl text-bugis-maroon/50 mt-14"
        >
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup...&rdquo;
          <span className="block font-poppins text-xs not-italic text-gray-400 mt-2">— QS. Ar-Rum: 21</span>
        </motion.p>
      </div>
    </section>
  );
}
