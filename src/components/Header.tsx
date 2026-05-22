"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Cpu, MapPin, Menu, Phone, X } from "lucide-react";

interface HeaderProps {
  phoneHref: string;
  whatsappHref: string;
  visitHref: string;
  since: string;
}

export default function Header({
  phoneHref,
  whatsappHref,
  visitHref,
  since,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/88 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-3 py-3">
          <Link href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary-dark)] soft-ring">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-[0.18em] text-[var(--primary-dark)] uppercase">
                Orion Computers
              </div>
              <div className="text-xs text-[var(--muted)]">Trusted in Nanded since 1999</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 lg:flex">
            <Link href="#home">Home</Link>
            <Link href="#products">Products</Link>
            <Link href="#services">Services</Link>
            <Link href="#reviews">Reviews</Link>
            <Link href="#contact">Contact</Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-bold text-[var(--primary-dark)]">
              Since {since}
            </div>
            <a href={phoneHref} className="button-secondary inline-flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              Call
            </a>
            <a href={whatsappHref} className="button-primary inline-flex items-center gap-2 text-sm">
              <ArrowRight className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={visitHref} className="button-ghost inline-flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              Location
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-white transition-all lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={closeMobileMenu} />
      )}

      <nav
        className={`fixed left-0 right-0 top-[73px] z-40 border-b border-[var(--line)] bg-white shadow-lg transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="section-shell flex flex-col gap-3 py-4">
          <Link
            href="#home"
            onClick={closeMobileMenu}
            className="block py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[var(--primary-dark)]"
          >
            Home
          </Link>
          <Link
            href="#products"
            onClick={closeMobileMenu}
            className="block py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[var(--primary-dark)]"
          >
            Products
          </Link>
          <Link
            href="#services"
            onClick={closeMobileMenu}
            className="block py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[var(--primary-dark)]"
          >
            Services
          </Link>
          <Link
            href="#contact"
            onClick={closeMobileMenu}
            className="block py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[var(--primary-dark)]"
          >
            Contact
          </Link>
          <div className="border-t border-[var(--line)] pt-4">
            <a
              href={phoneHref}
              onClick={closeMobileMenu}
              className="button-secondary mb-3 flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a
              href={whatsappHref}
              onClick={closeMobileMenu}
              className="button-primary flex items-center justify-center gap-2 text-sm"
            >
              <ArrowRight className="h-4 w-4" />
              WhatsApp Chat
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
