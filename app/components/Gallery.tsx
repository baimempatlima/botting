'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Safe image: hides itself on error, showing placeholder beneath ─── */
function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';

import type { GalleryPhoto } from '@/lib/types';

/* ─── Placeholder card (when no real image yet) ─── */
function PhotoPlaceholder({ index }: { index: number }) {
  const bg = index % 2 === 0
    ? 'linear-gradient(135deg, #1F4B3F 0%, #2d6b5a 100%)'
    : 'linear-gradient(135deg, #6B1D1D 0%, #8b2828 100%)';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: bg }}>
      {/* Diamond ornament */}
      <svg viewBox="0 0 48 48" className="w-8 h-8 text-bugis-gold/30" fill="currentColor">
        <path d="M24 0L48 24L24 48L0 24Z" />
        <path d="M24 10L38 24L24 38L10 24Z" fill="transparent" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="5" />
      </svg>
      <span className="font-poppins text-[10px] text-white/30 uppercase tracking-widest">Foto {index + 1}</span>
    </div>
  );
}

/* ─── Static map to force Tailwind compilation for dynamic database classes ─── */
const GRID_CLASS_MAP: Record<string, string> = {
  'col-span-2': 'col-span-2',
  'row-span-2': 'row-span-2',
  'md:col-span-2': 'md:col-span-2',
  'md:row-span-2': 'md:row-span-2',
  'md:col-span-3': 'md:col-span-3',
  'md:row-span-3': 'md:row-span-3',
};

/* ─── Individual photo tile ─── */
function PhotoTile({
  photo,
  index,
  onClick,
}: {
  photo: GalleryPhoto;
  index: number;
  onClick: (index: number) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px 0px' });

  // Map raw database strings safely to compiled Tailwind classes
  const safeSpanClasses = (photo.span_class || '')
    .split(' ')
    .map((c) => GRID_CLASS_MAP[c.trim()] || '')
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: 'easeOut' }}
      onClick={() => onClick(index)}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${safeSpanClasses}`}
      style={{
        minHeight: (photo.span_class || '').includes('row-span-2') ? 340 : 160,
        border: '1px solid rgba(201,162,39,0.12)',
        boxShadow: '0 2px 16px rgba(107,29,29,0.06)',
      }}
    >
      {/* Image / placeholder */}
      <div className="absolute inset-0">
        <SafeImage src={photo.src} alt={photo.title || 'Foto'} />
        {/* Placeholder shown beneath (visible when no real photo) */}
        <PhotoPlaceholder index={index} />
      </div>

      {/* Hover overlay with caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="font-playfair text-white text-lg leading-tight">{photo.title}</p>
        <p className="font-poppins text-white/70 text-xs mt-0.5 line-clamp-1">{photo.description}</p>
      </div>

      {/* Gold corner accent on hover */}
      <div className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg viewBox="0 0 24 24" className="text-bugis-gold w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20V4h16" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function Gallery({ data }: { data: GalleryPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);

  const slides = data.map((p) => ({
    src: p.src,
    title: p.title,
    description: p.description,
  }));

  return (
    <section id="galeri" className="py-20 md:py-28 bg-bugis-cream px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: -20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="font-playfair text-3xl md:text-5xl text-bugis-maroon mb-3">Galeri</h2>
          <p className="font-poppins text-sm text-gray-500">Sepotong kenangan yang kami abadikan</p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[160px]">
          {data.length === 0 && (
            <p className="col-span-2 md:col-span-4 text-center text-gray-400 font-poppins text-sm py-10">
              Belum ada foto galeri.
            </p>
          )}
          {data.map((photo, index) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              index={index}
              onClick={openLightbox}
            />
          ))}
        </div>

        {/* Note */}
        <p className="text-center font-poppins text-[10px] text-gray-400 mt-6 uppercase tracking-widest">
          Klik foto untuk melihat lebih jelas
        </p>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={[...slides]}
        plugins={[Zoom, Captions]}
        styles={{
          container: { backgroundColor: 'rgba(15,5,5,0.97)' },
        }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </section>
  );
}
