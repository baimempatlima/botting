'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitRsvp, fetchMessages, type RsvpEntry, type AttendanceStatus } from '@/lib/supabase';

// ─── Attendance radio option ─────────────────────────────────
const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string; icon: string; color: string }[] = [
  { value: 'hadir',        label: 'Hadir',       icon: '✓', color: 'border-bugis-deepgreen bg-bugis-deepgreen text-white' },
  { value: 'tidak_hadir',  label: 'Tidak Hadir', icon: '✕', color: 'border-bugis-maroon bg-bugis-maroon text-white'      },
  { value: 'ragu',         label: 'Masih Ragu',  icon: '?', color: 'border-bugis-gold bg-bugis-gold text-bugis-maroon'   },
];

// ─── Animated background ornament ───────────────────────────
function SectionBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-bugis-maroon/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-bugis-gold/8 blur-3xl" />
      {/* Decorative quote mark */}
      <div className="absolute top-8 right-6 font-cormorant text-[12rem] leading-none text-bugis-gold/5 select-none">&ldquo;</div>
    </div>
  );
}

// ─── Single message card ─────────────────────────────────────
function MessageCard({ entry, idx }: { entry: RsvpEntry; idx: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px 0px' });

  const badgeConf = {
    hadir:       { label: 'Hadir',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200'   },
    tidak_hadir: { label: 'Tidak Hadir', cls: 'bg-red-50 text-red-600 border-red-200'               },
    ragu:        { label: 'Masih Ragu',  cls: 'bg-amber-50 text-amber-700 border-amber-200'         },
  }[entry.attendance] ?? { label: '-', cls: '' };

  const elapsed = (created: string) => {
    const diff = Date.now() - new Date(created).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'baru saja';
    if (m < 60) return `${m} mnt lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
      className="bg-white rounded-2xl p-5 border border-bugis-gold/10 shadow-sm relative overflow-hidden"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-bugis-maroon/40 to-bugis-gold/40 rounded-full" />

      <div className="flex items-start justify-between gap-3 mb-3 pl-3">
        {/* Avatar circle */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-cormorant font-bold text-lg text-white"
            style={{ background: 'linear-gradient(135deg, #6B1D1D, #C9A227)' }}
          >
            {entry.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-playfair font-bold text-bugis-maroon text-base leading-tight truncate">{entry.name}</p>
            <p className="font-poppins text-[10px] text-gray-400 mt-0.5">{elapsed(entry.created_at)}</p>
          </div>
        </div>

        {/* Badge */}
        <span className={`shrink-0 font-poppins text-[10px] px-2.5 py-0.5 rounded-full border ${badgeConf.cls}`}>
          {badgeConf.label}
        </span>
      </div>

      {/* Message */}
      {entry.message && (
        <blockquote className="font-poppins text-sm text-gray-600 leading-relaxed pl-3 border-l-0 italic">
          &ldquo;{entry.message}&rdquo;
        </blockquote>
      )}

      {/* Pax */}
      {entry.attendance === 'hadir' && entry.pax > 1 && (
        <p className="font-poppins text-[10px] text-bugis-deepgreen/70 mt-2 pl-3">
          Hadir bersama {entry.pax} orang
        </p>
      )}
    </motion.div>
  );
}

// ─── Messages list ───────────────────────────────────────────
function MessagesList({ refresh }: { refresh: number }) {
  const [messages, setMessages] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMessages(30)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-2 border-bugis-gold/40 border-t-bugis-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10">
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-bugis-gold/30 mx-auto mb-3" fill="none">
          <path d="M24 0L48 24L24 48L0 24Z" fill="currentColor" />
          <path d="M24 10L38 24L24 38L10 24Z" fill="transparent" stroke="white" strokeWidth="1.5" />
        </svg>
        <p className="font-poppins text-sm text-gray-400">Belum ada ucapan. Jadilah yang pertama!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
      <AnimatePresence>
        {messages.map((m, i) => (
          <MessageCard key={m.id} entry={m} idx={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Main form (inner, needs useSearchParams) ────────────────
function RSVPInner() {
  const searchParams = useSearchParams();
  const rawGuest = searchParams.get('to') ?? '';
  const decoded = decodeURIComponent(rawGuest).trim();
  const guestName = decoded
    ? decoded
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';

  const [form, setForm] = useState({
    name: guestName,
    attendance: 'hadir' as AttendanceStatus,
    pax: 1,
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [refresh, setRefresh] = useState(0);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const set = (key: string, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      await submitRsvp({
        name: form.name.trim(),
        attendance: form.attendance,
        pax: form.pax,
        message: form.message.trim() || undefined,
      });
      setStatus('success');
      setForm({ name: guestName, attendance: 'hadir', pax: 1, message: '' });
      setRefresh((r) => r + 1); // trigger refetch
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengirim. Coba lagi.');
    }
  }, [form, guestName]);

  return (
    <section id="rsvp" className="relative py-20 md:py-28 px-4 bg-bugis-cream overflow-hidden">
      <SectionBg />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="font-playfair text-3xl md:text-5xl text-bugis-maroon mb-3">
            RSVP &amp; Ucapan
          </h2>
          <p className="font-poppins text-sm text-gray-500 max-w-xl mx-auto">
            Kehadiran dan doa restu Anda adalah kado paling berharga bagi kami.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl shadow-md border border-bugis-gold/15 overflow-hidden"
              style={{ boxShadow: '0 4px 32px rgba(107,29,29,0.08), 0 0 0 1px rgba(201,162,39,0.1)' }}>
              {/* Card header */}
              <div className="px-8 py-5 border-b border-bugis-gold/10 bg-gradient-to-r from-bugis-maroon/5 to-bugis-gold/5">
                <p className="font-playfair text-lg text-bugis-maroon">Konfirmasi Kehadiran</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Nama */}
                <div>
                  <label className="block font-poppins text-xs font-semibold text-bugis-deepgreen uppercase tracking-wider mb-2">
                    Nama Lengkap <span className="text-bugis-maroon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Nama Anda..."
                    className="w-full px-4 py-3 rounded-xl border border-bugis-gold/25 bg-bugis-cream/40 font-poppins text-sm focus:outline-none focus:border-bugis-gold focus:ring-2 focus:ring-bugis-gold/20 transition-all"
                  />
                </div>

                {/* Attendance radio */}
                <div>
                  <label className="block font-poppins text-xs font-semibold text-bugis-deepgreen uppercase tracking-wider mb-3">
                    Konfirmasi Kehadiran <span className="text-bugis-maroon">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ATTENDANCE_OPTIONS.map((opt) => {
                      const selected = form.attendance === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set('attendance', opt.value)}
                          className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 font-poppins text-xs font-medium
                            ${selected ? opt.color + ' shadow-sm' : 'border-gray-200 text-gray-500 hover:border-bugis-gold/40'}`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                            ${selected ? 'bg-white/25' : 'bg-gray-100'}`}>
                            {opt.icon}
                          </span>
                          {opt.label}
                          {selected && (
                            <motion.div
                              layoutId="attendance-indicator"
                              className="absolute inset-0 rounded-xl ring-2 ring-offset-1 ring-current opacity-30"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Jumlah orang (only if hadir) */}
                <AnimatePresence>
                  {form.attendance === 'hadir' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <label className="block font-poppins text-xs font-semibold text-bugis-deepgreen uppercase tracking-wider mb-2">
                        Jumlah Tamu (termasuk Anda)
                      </label>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => set('pax', Math.max(1, form.pax - 1))}
                          className="w-10 h-10 rounded-full border border-bugis-gold/30 flex items-center justify-center text-bugis-maroon font-bold hover:bg-bugis-maroon hover:text-white transition-colors">−</button>
                        <span className="font-cormorant text-3xl font-bold text-bugis-maroon w-10 text-center">{form.pax}</span>
                        <button type="button" onClick={() => set('pax', Math.min(20, form.pax + 1))}
                          className="w-10 h-10 rounded-full border border-bugis-gold/30 flex items-center justify-center text-bugis-maroon font-bold hover:bg-bugis-maroon hover:text-white transition-colors">+</button>
                        <span className="font-poppins text-xs text-gray-400">orang</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ucapan */}
                <div>
                  <label className="block font-poppins text-xs font-semibold text-bugis-deepgreen uppercase tracking-wider mb-2">
                    Ucapan &amp; Doa <span className="text-gray-400 normal-case font-normal">(opsional)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Tuliskan doa dan ucapan selamat Anda untuk kami..."
                    className="w-full px-4 py-3 rounded-xl border border-bugis-gold/25 bg-bugis-cream/40 font-poppins text-sm resize-none focus:outline-none focus:border-bugis-gold focus:ring-2 focus:ring-bugis-gold/20 transition-all"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="font-poppins text-xs text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                      ⚠ {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-200"
                    >
                      <p className="font-playfair text-lg text-emerald-700">Jazakallah Khairan 🤍</p>
                      <p className="font-poppins text-xs text-emerald-500 mt-1">Konfirmasi Anda telah kami terima.</p>
                      <button type="button" onClick={() => setStatus('idle')}
                        className="mt-3 font-poppins text-xs text-emerald-600 underline underline-offset-2">
                        Kirim lagi
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="submit"
                      type="submit"
                      disabled={status === 'loading'}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-poppins font-semibold text-sm text-bugis-cream disabled:opacity-60 transition-all shadow-md"
                      style={{ background: 'linear-gradient(135deg, #6B1D1D 0%, #8b2828 50%, #6B1D1D 100%)' }}
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Mengirim...
                        </span>
                      ) : 'Kirim Konfirmasi'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* ── MESSAGES ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-md border border-bugis-gold/15 overflow-hidden"
              style={{ boxShadow: '0 4px 32px rgba(107,29,29,0.08), 0 0 0 1px rgba(201,162,39,0.1)' }}>
              <div className="px-8 py-5 border-b border-bugis-gold/10 bg-gradient-to-r from-bugis-gold/5 to-bugis-maroon/5 flex items-center justify-between">
                <p className="font-playfair text-lg text-bugis-maroon">Ucapan &amp; Doa</p>
                <button
                  onClick={() => setRefresh((r) => r + 1)}
                  className="font-poppins text-[10px] text-bugis-gold/70 hover:text-bugis-gold flex items-center gap-1 transition-colors"
                >
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1.5 8A6.5 6.5 0 0 1 14 5.5M14.5 8A6.5 6.5 0 0 1 2 10.5" />
                    <path d="M12 3.5l2 2-2 2M4 12.5l-2-2 2-2" />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="p-6">
                <MessagesList refresh={refresh} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Public export (Suspense wraps useSearchParams) ──────────
export default function RSVPForm() {
  return (
    <Suspense fallback={null}>
      <RSVPInner />
    </Suspense>
  );
}
