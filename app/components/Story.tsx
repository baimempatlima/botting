export default function Story() {
  return (
    <section className="py-20 bg-bugis-cream px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-playfair text-3xl md:text-5xl mb-8 text-bugis-deepgreen">Kisah Kami</h2>
        
        <div className="space-y-12 mt-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-bugis-gold before:to-transparent">
          {[
            {
              year: "2020",
              title: "Pertemuan Pertama",
              desc: "Kami bertemu secara tidak sengaja di sebuah acara keluarga besar di Makassar."
            },
            {
              year: "2023",
              title: "Mulai Dekat",
              desc: "Komunikasi semakin intens dan kami menemukan banyak kecocokan satu sama lain."
            },
            {
              year: "2025",
              title: "Lamaran (Mappetuada)",
              desc: "Keluarga besar bertemu untuk membicarakan dan merencanakan hari bahagia kami."
            }
          ].map((item, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-bugis-cream bg-bugis-gold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white shadow-lg border border-bugis-gold/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-playfair font-bold text-bugis-maroon text-xl">{item.title}</h3>
                  <span className="font-cormorant font-bold text-bugis-gold text-lg">{item.year}</span>
                </div>
                <p className="font-poppins text-sm text-gray-600 text-left">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
