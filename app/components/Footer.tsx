export default function Footer({
  groomName,
  brideName,
}: {
  groomName: string;
  brideName: string;
}) {
  const shortGroom = groomName.split(" ")[0] || "Andi";
  const shortBride = brideName.split(" ")[0] || "Tenri";

  return (
    <footer className="py-12 bg-bugis-maroon text-bugis-cream text-center px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="font-cormorant text-4xl text-bugis-gold">
          {shortGroom} & {shortBride}
        </h2>
        <p className="font-poppins text-sm opacity-80">
          Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima
          kasih.
        </p>
        <div className="pt-8 border-t border-bugis-gold/30">
          <p className="font-poppins text-xs opacity-60">
            © 2026 The Wedding of {shortGroom} & {shortBride} by Bayu (Anri' ta). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
