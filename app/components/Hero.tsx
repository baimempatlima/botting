'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import BugisPattern from './BugisPattern';

export default function Hero({
  groomName,
  brideName,
}: {
  groomName: string;
  brideName: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax effect for the background and text
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="main-content"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-bugis-maroon"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg, opacity }}
      >
        <Image 
          src="/images/hero.jpg" 
          alt="Prewedding Photo" 
          fill 
          className="object-cover object-[center_35%]" 
          priority 
        />
        
        {/* Smooth golden gradient overlay for a premium warm feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.25)_0%,rgba(58,16,16,0.8)_80%,rgba(58,16,16,1)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bugis-gold/20 via-transparent to-bugis-maroon/95" />
        
        {/* Bugis Pattern Overlay (subtle) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 mix-blend-overlay">
          <BugisPattern className="w-full h-full object-cover" color="#C9A227" opacity="1" />
        </div>
      </motion.div>

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-bugis-maroon via-bugis-gold to-bugis-maroon z-20" />

      {/* Content */}
      <motion.div
        style={{ y: yText }}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="mb-6 flex flex-col items-center gap-2">
            {/* Glowing Rings Icon */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-10 h-10 text-bugis-gold drop-shadow-[0_0_12px_rgba(201,162,39,1)]" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <circle cx="9.5" cy="12" r="5.5" />
              <circle cx="14.5" cy="12" r="5.5" />
            </svg>
            <p className="font-poppins text-xs text-bugis-cream uppercase tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Bismillahirahmanirrahim
            </p>
          </div>

          <p className="font-poppins text-xs md:text-sm text-bugis-cream leading-relaxed max-w-sm mx-auto mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh.
          </p>
          <p className="font-poppins text-[11px] md:text-xs text-bugis-cream leading-relaxed max-w-sm mx-auto mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami:
          </p>

          <h2
            className="font-cormorant font-bold text-bugis-gold leading-none mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
          >
            {groomName.split(' ')[0]} &amp; {brideName.split(' ')[0]}
          </h2>

          <p className="font-poppins text-sm text-bugis-cream leading-relaxed max-w-md mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            &quot;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.&quot;
          </p>
          <p className="font-poppins text-xs text-bugis-cream mt-3 italic drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            (QS. Ar-Rum: 21)
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
