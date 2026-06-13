"use client";

interface HeaderProps {
  phoneHref: string;
}

export function Header({ phoneHref }: HeaderProps) {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1b6b3a] shadow-lg">
      <div className="page-shell flex items-center justify-between py-3.5">
        <button
          onClick={handleLogoClick}
          className="cursor-pointer text-left transition-opacity hover:opacity-80"
          aria-label="Scroll to top"
        >
          <p className="text-base font-black tracking-[0.15em] text-white uppercase">
            Orion Computers
          </p>
          <p className="text-[0.7rem] text-white/70 tracking-wide">
            Trusted in Nanded since 1999
          </p>
        </button>
        <a
          href={phoneHref}
          className="rounded-full border-2 border-white/80 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#1b6b3a]"
        >
          Call Store
        </a>
      </div>
    </header>
  );
}
