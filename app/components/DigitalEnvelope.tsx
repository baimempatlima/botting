'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { BankAccount } from '@/lib/types';

export default function DigitalEnvelope({ data }: { data: BankAccount[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="amplop" className="relative py-20 px-4 bg-white overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-bugis-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-bugis-deepgreen/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Title */}
        <h2 className="font-playfair text-3xl md:text-5xl text-bugis-maroon mb-4">Tanda Kasih</h2>
        <p className="font-poppins text-sm text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih secara digital, Anda dapat melalui pilihan di bawah ini.
        </p>

        {/* Collapsed Button / Trigger */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-8 py-3.5 bg-bugis-maroon text-bugis-cream rounded-full font-poppins font-medium text-sm shadow-lg hover:bg-opacity-95 transition-all"
            style={{ boxShadow: '0 4px 20px rgba(107,29,29,0.2)' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 animate-pulse"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {isOpen ? 'Sembunyikan Amplop Digital' : 'Kirim Kado / Amplop Digital'}
          </motion.button>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6 p-1">
                {/* Bank Account Cards */}
                {data.length === 0 && (
                   <p className="md:col-span-2 text-center text-gray-400 font-poppins text-sm py-5">Belum ada data rekening.</p>
                )}
                {data.map((acc, index) => (
                  <motion.div
                    key={acc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-bugis-cream/30 border border-bugis-gold/25 rounded-2xl p-6 text-left shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Bank Tag */}
                      <span className="inline-block font-poppins text-xs font-semibold text-bugis-deepgreen tracking-widest uppercase mb-4">
                        {acc.bank_name}
                      </span>
                      {/* Account Number */}
                      <p className="font-cormorant text-2xl font-bold text-bugis-maroon tracking-wider mb-1">
                        {acc.account_number}
                      </p>
                      {/* Account Holder */}
                      <p className="font-poppins text-xs text-gray-500 mb-6">
                        a.n. {acc.account_holder}
                      </p>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(acc.account_number, index)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-poppins text-xs font-medium flex items-center justify-center gap-2 transition-all
                        ${
                          copiedIndex === index
                            ? 'bg-bugis-deepgreen border-bugis-deepgreen text-white'
                            : 'border-bugis-maroon text-bugis-maroon hover:bg-bugis-maroon hover:text-white'
                        }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Salin Berhasil!
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Salin No. Rekening
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* QRIS / Custom Image Section (taking first one that has QRIS) */}
              {data.find(d => d.qris_url) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 max-w-sm mx-auto bg-bugis-cream/20 border border-bugis-gold/15 rounded-2xl p-6 shadow-sm"
                >
                  <span className="inline-block font-poppins text-xs font-semibold text-bugis-deepgreen tracking-widest uppercase mb-4">
                    QRIS Pembayaran
                  </span>
                  
                  {/* QRIS Image */}
                  <div className="relative w-48 h-48 mx-auto bg-white rounded-xl border border-gray-200 flex items-center justify-center p-3 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.find(d => d.qris_url)?.qris_url || ''} alt="QRIS" className="w-full h-full object-contain" />
                  </div>
                  <p className="font-poppins text-[11px] text-gray-500 mt-4 leading-relaxed">
                    Pindai QRIS di atas untuk mengirimkan tanda kasih secara instan dari aplikasi e-wallet / mobile banking Anda.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
