'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

import type { CoupleProfileData } from '@/lib/types';

/* ─── Types ─── */
interface PersonProps {
  name: string;
  role: 'pria' | 'wanita';
  fatherName?: string;
  motherName?: string;
  birthOrder?: string; // e.g. "Putra Pertama" | "Putri Kedua"
  photo?: string; // path to photo in /public/images/
  instagram?: string;
  facebook?: string;
}

/* ─── Gold Corner Bracket ornament ─── */
function GoldCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotate = { tl: '0deg', tr: '90deg', br: '180deg', bl: '270deg' }[pos];
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute w-6 h-6 md:w-8 md:h-8 text-bugis-gold"
      style={{
        top: pos.startsWith('t') ? -2 : 'auto',
        bottom: pos.startsWith('b') ? -2 : 'auto',
        left: pos.endsWith('l') ? -2 : 'auto',
        right: pos.endsWith('r') ? -2 : 'auto',
        transform: `rotate(${rotate})`,
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 20V4h16" />
      {/* Inner diamond accent */}
      <circle cx="4" cy="4" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/* ─── Social icons ─── */
function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-bugis-gold/40 flex items-center justify-center text-bugis-gold/70 hover:bg-bugis-gold hover:text-bugis-maroon transition-all duration-300"
    >
      {children}
    </a>
  );
}

/* ─── Person Card ─── */
function PersonCard({ person, delay = 0 }: { person: PersonProps; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });

  const isGroom = person.role === 'pria';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className="flex flex-col items-center text-center max-w-xs w-full"
    >
      {/* Photo frame */}
      <div className="relative mb-8">
        {/* Outer decorative ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#C9A227 0deg, transparent 60deg, #C9A227 120deg, transparent 180deg, #C9A227 240deg, transparent 300deg, #C9A227 360deg)`,
            transform: 'scale(1.08)',
            opacity: 0.4,
            borderRadius: '50%',
          }}
        />

        {/* Photo container with gold border */}
        <div
          className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-bugis-gold/60 shadow-xl"
          style={{ boxShadow: '0 0 0 4px rgba(201,162,39,0.15), 0 8px 32px rgba(107,29,29,0.2)' }}
        >
          {person.photo ? (
            <Image
              src={person.photo}
              alt={person.name}
              fill
              className="object-cover"
            />
          ) : (
            /* Placeholder with Bugis motif */
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{
                background: isGroom
                  ? 'linear-gradient(145deg, #1F4B3F, #2d6b5a)'
                  : 'linear-gradient(145deg, #6B1D1D, #8b2828)',
              }}
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-bugis-gold/40" fill="none">
                <path d="M20 0L40 20L20 40L0 20Z" fill="currentColor" />
                <path d="M20 8L32 20L20 32L8 20Z" fill="transparent" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>
              <span className="font-poppins text-xs text-white/40">Foto {person.role === 'pria' ? 'Pria' : 'Wanita'}</span>
            </div>
          )}
        </div>

        {/* Corner brackets on the photo */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
          <GoldCorner key={pos} pos={pos} />
        ))}
      </div>

      {/* Name */}
      <h3
        className="font-cormorant font-bold text-bugis-maroon leading-tight mb-1"
        style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}
      >
        {person.name}
      </h3>

      {/* Birth order label */}
      <p className="font-poppins text-xs text-bugis-gold uppercase tracking-widest mb-3">
        {person.birthOrder}
      </p>

      {/* Parents */}
      <p className="font-poppins text-sm text-gray-500 leading-relaxed mb-5">
        Putra/i dari<br />
        <span className="text-bugis-deepgreen font-medium">{person.fatherName}</span>
        <span className="text-gray-400"> &amp; </span>
        <span className="text-bugis-deepgreen font-medium">{person.motherName}</span>
      </p>

      {/* Social links */}
      {(person.instagram || person.facebook) && (
        <div className="flex gap-3">
          {person.instagram && (
            <SocialLink href={`https://instagram.com/${person.instagram}`} label="Instagram">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </SocialLink>
          )}
          {person.facebook && (
            <SocialLink href={`https://facebook.com/${person.facebook}`} label="Facebook">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
              </svg>
            </SocialLink>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Gold ampersand divider ─── */
function GoldAnd() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 md:py-0">
      <div className="h-12 md:h-20 w-px bg-gradient-to-b from-transparent via-bugis-gold/40 to-transparent hidden md:block" />
      <span
        className="font-cormorant italic text-bugis-gold"
        style={{
          fontSize: 'clamp(3rem, 10vw, 5rem)',
          lineHeight: 1,
          textShadow: '0 2px 20px rgba(201,162,39,0.3)',
        }}
      >
        &amp;
      </span>
      <div className="h-12 md:h-20 w-px bg-gradient-to-b from-transparent via-bugis-gold/40 to-transparent hidden md:block" />
    </div>
  );
}

/* ─── Main export ─── */
export default function CoupleProfile({ data }: { data: CoupleProfileData[] }) {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  const groomData = data.find((p) => p.role === 'pria');
  const brideData = data.find((p) => p.role === 'wanita');

  const groom: PersonProps | null = groomData
    ? {
        name: groomData.name,
        role: groomData.role,
        fatherName: groomData.father_name,
        motherName: groomData.mother_name,
        birthOrder: groomData.birth_order,
        photo: groomData.photo_url,
        instagram: groomData.instagram,
        facebook: groomData.facebook,
      }
    : null;

  const bride: PersonProps | null = brideData
    ? {
        name: brideData.name,
        role: brideData.role,
        fatherName: brideData.father_name,
        motherName: brideData.mother_name,
        birthOrder: brideData.birth_order,
        photo: brideData.photo_url,
        instagram: brideData.instagram,
        facebook: brideData.facebook,
      }
    : null;

  return (
    <section id="mempelai" className="relative py-20 md:py-28 bg-white overflow-hidden px-4">
      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-bugis-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-bugis-deepgreen/8 blur-3xl pointer-events-none" />
      {/* Top/bottom gold rule */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bugis-gold/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bugis-gold/30 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: -20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-poppins text-[10px] text-bugis-gold/70 uppercase tracking-[0.4em] mb-3">
            Bismillahirrahmanirrahim
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl text-bugis-maroon mb-4">Mempelai</h2>
          <p className="font-poppins text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Semoga pernikahan kami
            menjadi ikatan yang penuh berkah dan cinta yang abadi.
          </p>
        </motion.div>

        {/* Cards row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-8">
          {groom && <PersonCard person={groom} delay={0.1} />}
          {groom && bride && <GoldAnd />}
          {bride && <PersonCard person={bride} delay={0.25} />}
        </div>
      </div>
    </section>
  );
}
