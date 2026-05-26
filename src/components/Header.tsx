"use client";

interface HeaderProps {
  phoneHref: string;
}

export function Header({ phoneHref }: HeaderProps) {
  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="page-shell flex items-center justify-between py-3">
        <button
          onClick={handleLogoClick}
          className="cursor-pointer transition-opacity hover:opacity-70 text-left"
          aria-label="Scroll to top"
        >
          <p className="text-sm font-black tracking-[0.2em] text-[var(--primary-dark)] uppercase">
            Orion Computers
          </p>
          <p className="text-xs text-[var(--muted)]">Trusted in Nanded since 1999</p>
        </button>
        <a href={phoneHref} className="chip-link">
          Call Store
        </a>
      </div>
    </header>
  );
}
