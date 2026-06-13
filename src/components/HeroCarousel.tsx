"use client";

import { useEffect, useRef, useState } from "react";

type Slide = { src: string; alt: string };

interface HeroCarouselProps {
  slides: Slide[];
  phoneHref: string;
  whatsappHref: string;
}

export function HeroCarousel({ slides, phoneHref, whatsappHref }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = slides.length;

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % count);
      setAnimKey((k) => k + 1);
    }, 3000);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  function goTo(i: number) {
    setCurrent(i);
    setAnimKey((k) => k + 1);
    startTimer();
  }

  const hasImages = slides.length > 0 && slides.some((s) => s.src);

  return (
    <section className="relative w-full overflow-hidden bg-[#0d3d21]" style={{ minHeight: "560px" }}>
      {/* Slides */}
      {hasImages &&
        slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== current}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {slide.src && (
              <img
                key={i === current ? animKey : -i - 1}
                src={slide.src}
                alt={slide.alt}
                className={`h-full w-full object-cover${i === current ? " ken-burns" : ""}`}
                loading={i === 0 ? "eager" : "lazy"}
                style={{ position: "absolute", inset: 0, minHeight: "560px" }}
              />
            )}
          </div>
        ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.48) 60%, rgba(0,0,0,0.68) 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center px-5 text-center text-white"
        style={{ zIndex: 3, minHeight: "560px" }}
      >
        <span
          className="mb-4 rounded-full border border-white/30 bg-white/12 px-5 py-1.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          Est. 1999 · Nanded, Maharashtra
        </span>

        <h1 className="hero-title max-w-3xl text-white" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
          Trusted Computer Sales &amp; Service Since 1999
        </h1>

        <p className="mt-4 text-xl font-semibold text-white/90" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
          Nanded&apos;s #1 Computer Store
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={whatsappHref} className="btn-green text-base px-8 py-3.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L0 24l6.336-1.501A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.006-1.368l-.36-.215-3.727.883.936-3.638-.236-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            WhatsApp Now
          </a>
          <a href={phoneHref} className="btn-outline-white text-base px-8 py-3.5">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
            </svg>
            Call Store
          </a>
        </div>
      </div>

      {/* Slide indicators */}
      {count > 1 && (
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2" style={{ zIndex: 4 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? "1.75rem" : "0.5rem",
                background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
