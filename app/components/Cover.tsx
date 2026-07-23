'use client';

import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import BugisPattern from './BugisPattern';

/* ─────────── Audio Controls ─────────── */
function AudioControl({ audioRef, started }: { audioRef: React.RefObject<HTMLAudioElement | null>; started: boolean }) {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  if (!started) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      onClick={toggleMute}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-bugis-maroon/80 backdrop-blur-sm border border-bugis-gold/40 flex items-center justify-center shadow-lg hover:bg-bugis-maroon transition-colors"
    >
      {muted ? (
        /* Muted icon */
        <svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" className="w-5 h-5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Playing icon — animated bars */
        <svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" className="w-5 h-5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </motion.button>
  );
}

/* ─────────── Calligraphic Ampersand ─────────── */
function Ampersand() {
  return (
    <span
      className="block font-cormorant leading-none select-none"
      style={{
        fontSize: 'clamp(4rem, 14vw, 9rem)',
        color: '#C9A227',
        fontStyle: 'italic',
        fontWeight: 300,
        lineHeight: 1,
        textShadow: '0 2px 24px rgba(201,162,39,0.25)',
      }}
    >
      &amp;
    </span>
  );
}

/* ─────────── Inner cover (needs useSearchParams) ─────────── */
function CoverInner({ groomName, brideName, weddingDate }: { groomName: string; brideName: string; weddingDate: string }) {
  const searchParams = useSearchParams();
  const rawGuest = searchParams.get('to') ?? '';
  const decoded = decodeURIComponent(rawGuest).trim();
  const guestName = decoded
    ? decoded
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Tamu Undangan';

  const [opened, setOpened] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ── Play audio + scroll to main on first interaction ── */
  const handleOpen = async () => {
    setOpened(true);

    // Start audio (user gesture allows autoplay)
    if (audioRef.current && !audioStarted) {
      audioRef.current.volume = 0.4;
      try {
        await audioRef.current.play();
        setAudioStarted(true);
      } catch {
        /* silently ignore if no audio file yet */
      }
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} loop preload="none">
        <source src="/audio/background.mp3" type="audio/mpeg" />
      </audio>

      {/* ───── COVER OVERLAY ───── */}
      <AnimatePresence>
        {!opened && (
          <motion.section
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 flex flex-col items-center overflow-y-auto"
            style={{
              background: 'linear-gradient(160deg, #6B1D1D 0%, #3a1010 40%, #1F4B3F 100%)',
            }}
          >
            {/* BugisPattern overlay */}
            <BugisPattern className="text-bugis-gold" opacity="0.07" color="#C9A227" />

            {/* Radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl mx-auto w-full pt-16 pb-12 min-h-full"
            >
              {/* Image Centerpiece (Paling atas) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative flex-shrink-0 mb-4 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(201,162,39,0.3)] border-[2px] border-bugis-gold/40"
              >
                <Image 
                  src="/images/cover.jpg" 
                  alt="Cover Illustration" 
                  width={400}
                  height={400}
                  className="w-full max-w-[140px] md:max-w-[160px] h-auto object-contain" 
                  priority 
                />
              </motion.div>

              {/* Teks "THE WEDDING OF" */}
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, letterSpacing: '0.45em' }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="font-poppins text-[10px] md:text-xs text-bugis-gold/90 uppercase mb-3 tracking-[0.45em]"
              >
                The Wedding Of
              </motion.p>

              {/* Teks Nama "Amir & Warda" */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-0 leading-none mb-2 w-full"
              >
                <h1
                  className="font-cormorant font-bold text-bugis-cream truncate w-full"
                  style={{ fontSize: 'clamp(3.2rem, 14vw, 7rem)', lineHeight: 1.05 }}
                >
                  {groomName.split(' ')[0]}
                </h1>
                <span
                  className="block font-cormorant leading-none select-none text-bugis-gold italic font-light drop-shadow-[0_2px_12px_rgba(201,162,39,0.4)]"
                  style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
                >
                  &amp;
                </span>
                <h1
                  className="font-cormorant font-bold text-bugis-cream truncate w-full"
                  style={{ fontSize: 'clamp(3.2rem, 14vw, 7rem)', lineHeight: 1.05 }}
                >
                  {brideName.split(' ')[0]}
                </h1>
              </motion.div>

              {/* Tanggal Acara ("SENIN, 3 AGUSTUS 2026") */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-poppins text-xs md:text-sm text-bugis-cream/60 tracking-widest uppercase mt-4 mb-8"
              >
                {new Date(weddingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </motion.p>

              {/* Kotak "Kepada Yth. Tamu Undangan" (Dipindah ke bagian bawah) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 px-5 py-2 border border-bugis-gold/30 rounded-full"
              >
                <p className="font-poppins text-xs text-bugis-cream/70 leading-relaxed">
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <p className="font-playfair text-sm md:text-base text-bugis-gold font-semibold mt-0.5 truncate max-w-[260px]">
                  {guestName}
                </p>
              </motion.div>

              {/* Tombol "Buka Undangan" (Berdekatan dengan nama tamu) */}
              <motion.button
                onClick={handleOpen}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="group relative flex items-center justify-center gap-2.5 px-8 md:px-10 py-3 md:py-4 rounded-full overflow-hidden font-poppins font-medium text-[13px] md:text-sm shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #C9A227 0%, #e8c349 50%, #C9A227 100%)',
                  color: '#3a1010',
                  boxShadow: '0 0 24px rgba(201,162,39,0.35)',
                }}
              >
                {/* shimmer */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                {/* heart icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                </svg>
                Buka Undangan
              </motion.button>

              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="mt-10 flex flex-col items-center gap-1"
              >
                <span className="font-poppins text-[10px] text-bugis-cream/40 uppercase tracking-widest">Scroll</span>
                <svg viewBox="0 0 20 20" className="w-4 h-4 text-bugis-gold/40" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 3v14M4 11l6 6 6-6" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating audio toggle */}
      <AudioControl audioRef={audioRef} started={audioStarted} />
    </>
  );
}

/* ─────────── Public export (wraps in Suspense for useSearchParams) ─────────── */
export default function Cover({ groomName, brideName, weddingDate }: { groomName: string; brideName: string; weddingDate: string }) {
  return (
    <Suspense fallback={null}>
      <CoverInner groomName={groomName} brideName={brideName} weddingDate={weddingDate} />
    </Suspense>
  );
}
