'use client';
import { useState } from 'react';

export default function RSVP() {
  const [formData, setFormData] = useState({ name: '', attendance: 'hadir', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Terima kasih atas konfirmasinya!');
  };

  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-playfair text-3xl md:text-5xl mb-4 text-bugis-maroon">RSVP & Ucapan</h2>
        <p className="font-poppins text-gray-600 mb-12">Kehadiran dan doa restu Anda adalah kado terindah bagi kami.</p>

        <form onSubmit={handleSubmit} className="bg-bugis-cream p-8 rounded-3xl shadow-lg border border-bugis-gold/20">
          <div className="space-y-6 text-left">
            <div>
              <label className="block font-poppins text-sm font-medium text-bugis-deepgreen mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-bugis-gold/30 focus:border-bugis-gold focus:ring-1 focus:ring-bugis-gold outline-none font-poppins"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block font-poppins text-sm font-medium text-bugis-deepgreen mb-2">Konfirmasi Kehadiran</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-bugis-gold/30 focus:border-bugis-gold focus:ring-1 focus:ring-bugis-gold outline-none font-poppins"
                value={formData.attendance}
                onChange={(e) => setFormData({...formData, attendance: e.target.value})}
              >
                <option value="hadir">Ya, Saya akan hadir</option>
                <option value="tidak_hadir">Maaf, Saya tidak bisa hadir</option>
              </select>
            </div>

            <div>
              <label className="block font-poppins text-sm font-medium text-bugis-deepgreen mb-2">Ucapan & Doa</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-bugis-gold/30 focus:border-bugis-gold focus:ring-1 focus:ring-bugis-gold outline-none font-poppins resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-bugis-maroon text-bugis-cream rounded-xl font-bold font-poppins hover:bg-opacity-90 transition-all shadow-md"
            >
              Kirim Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
