const BRANDS = ["HP", "Dell", "Lenovo", "ASUS", "Acer", "MSI", "Canon", "Samsung"];

export function BrandTicker() {
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: "#1b6b3a" }}
    >
      <div className="ticker-track py-4">
        {doubled.map((brand, i) => (
          <span key={i} className="flex shrink-0 items-center gap-4">
            <span className="text-base font-black tracking-widest text-white uppercase">
              {brand}
            </span>
            <span className="text-white/30 text-lg" aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
