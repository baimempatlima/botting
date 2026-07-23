export default function Couple() {
  return (
    <section className="py-20 bg-white px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-bugis-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-bugis-deepgreen/10 rounded-full blur-3xl" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <h2 className="font-playfair text-3xl md:text-5xl mb-4 text-bugis-maroon">Mempelai</h2>
        <p className="font-poppins text-gray-600 mb-16 max-w-2xl mx-auto">
          Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
          Ya Allah, perkenankanlah kami merangkai kasih sayang yang Kau ciptakan di antara putra-putri kami:
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          {/* Groom */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-t-full rounded-b-xl overflow-hidden mb-6 border-4 border-bugis-gold p-1">
              <div className="w-full h-full rounded-t-full rounded-b-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 font-poppins">Foto Pria</span>
              </div>
            </div>
            <h3 className="font-cormorant font-bold text-3xl text-bugis-deepgreen mb-2">Andi Muhammad</h3>
            <p className="font-poppins text-sm text-gray-600">
              Putra Pertama dari Bapak H. Ahmad <br/> & Ibu Hj. Murni
            </p>
          </div>

          <div className="text-4xl text-bugis-gold font-playfair">&</div>

          {/* Bride */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-t-full rounded-b-xl overflow-hidden mb-6 border-4 border-bugis-gold p-1">
              <div className="w-full h-full rounded-t-full rounded-b-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 font-poppins">Foto Wanita</span>
              </div>
            </div>
            <h3 className="font-cormorant font-bold text-3xl text-bugis-deepgreen mb-2">Tenri Ajeng</h3>
            <p className="font-poppins text-sm text-gray-600">
              Putri Kedua dari Bapak H. Usman <br/> & Ibu Hj. Rosdiana
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
