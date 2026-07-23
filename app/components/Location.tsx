import { MapPin, Calendar, Clock } from 'lucide-react';

export default function Location() {
  return (
    <section className="py-20 bg-bugis-deepgreen text-bugis-cream px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-5xl text-bugis-gold mb-4">Waktu & Tempat</h2>
          <p className="font-poppins opacity-90 max-w-xl mx-auto">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami pada:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Akad Nikah */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-bugis-gold transition-colors">
            <h3 className="font-playfair text-2xl mb-6 text-bugis-gold border-b border-white/20 pb-4">Akad Nikah</h3>
            <div className="space-y-4 font-poppins">
              <div className="flex items-start gap-4">
                <Calendar className="text-bugis-gold shrink-0" />
                <div>
                  <p className="font-bold">Minggu, 12 Desember 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-bugis-gold shrink-0" />
                <div>
                  <p>08:00 WITA - Selesai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-bugis-gold shrink-0" />
                <div>
                  <p className="font-bold">Kediaman Mempelai Wanita</p>
                  <p className="text-sm opacity-80 mt-1">Jl. Andi Djemma No. 12, Makassar, Sulawesi Selatan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-bugis-gold transition-colors">
            <h3 className="font-playfair text-2xl mb-6 text-bugis-gold border-b border-white/20 pb-4">Resepsi Mappacci</h3>
            <div className="space-y-4 font-poppins">
              <div className="flex items-start gap-4">
                <Calendar className="text-bugis-gold shrink-0" />
                <div>
                  <p className="font-bold">Minggu, 12 Desember 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-bugis-gold shrink-0" />
                <div>
                  <p>19:00 WITA - Selesai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-bugis-gold shrink-0" />
                <div>
                  <p className="font-bold">Hotel Claro Makassar</p>
                  <p className="text-sm opacity-80 mt-1">Jl. A. P. Pettarani No.03, Mannuruki, Tamalate, Kota Makassar</p>
                  <a href="#" className="inline-block mt-4 px-4 py-2 bg-bugis-gold text-bugis-deepgreen rounded-full text-sm font-bold hover:bg-white transition-colors">
                    Lihat Peta
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
