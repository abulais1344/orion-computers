import { readFileSync } from "node:fs";
import path from "node:path";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ReviewMarquee } from "@/components/ReviewMarquee";
import { BrandTicker } from "@/components/BrandTicker";
import { ScrollAnimator } from "@/components/ScrollAnimator";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type SiteContent = {
  business: {
    address: string;
    timings: string;
    mapEmbedUrl: string;
    directionsUrl: string;
    googleBusinessUrl?: string;
    phonePrimary: string;
    whatsapp: string;
  };
  reviews: Array<{ name: string; role: string; rating: number; text: string }>;
};

type ImageItem = { src: string; alt: string };

async function getHeroSlides(): Promise<ImageItem[]> {
  // Try hero_images table first (new system)
  try {
    const supabase = getSupabaseAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("hero_images")
      .select("image_url, caption")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }) as {
        data: Array<{ image_url: string; caption: string | null }> | null;
        error: unknown;
      };

    if (!error && data && data.length > 0) {
      return data.map((row, i) => ({
        src: row.image_url,
        alt: row.caption ?? `Hero image ${i + 1}`,
      }));
    }
  } catch {
    // fall through to legacy
  }

  // Fall back to _layout.json in Supabase storage (existing system)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  if (!supabaseUrl) return [];

  try {
    const res = await fetch(
      `${supabaseUrl}/storage/v1/object/public/orion-images/_layout.json`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const layout = (await res.json()) as { heroImages?: ImageItem[] };
    return Array.isArray(layout.heroImages) ? layout.heroImages : [];
  } catch {
    return [];
  }
}

function getWhatsAppLink(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

const SERVICES = [
  {
    name: "Laptops & Desktops",
    desc: "Sales, service, and complete hardware support for all brands.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M0 21h24" />
        <path strokeLinecap="round" d="M9 18h6" />
      </svg>
    ),
  },
  {
    name: "Gaming PC",
    desc: "Custom builds, upgrades, and performance optimisation.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="7" width="20" height="12" rx="3" />
        <path strokeLinecap="round" d="M6 13h4M8 11v4" />
        <circle cx="15" cy="13" r="1" fill="currentColor" />
        <circle cx="18" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Laptop Repairs",
    desc: "Fast diagnosis, genuine parts, and reliable turnaround.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    name: "Printers",
    desc: "Sales and maintenance for home and office printers.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
      </svg>
    ),
  },
  {
    name: "Accessories",
    desc: "Keyboards, mice, cables, monitors, and all peripherals.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    ),
  },
  {
    name: "CCTV & Security",
    desc: "Installation and servicing of CCTV surveillance systems.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
];

export default async function Home() {
  const content = JSON.parse(
    readFileSync(path.join(process.cwd(), "data/content.json"), "utf8")
  ) as SiteContent;

  const heroImages = await getHeroSlides();

  const phoneHref = `tel:${content.business.phonePrimary.replace(/\s+/g, "")}`;
  const whatsappHref = getWhatsAppLink(
    content.business.whatsapp,
    "Hello Orion Computers, I want to enquire on WhatsApp."
  );
  const googleBusinessHref =
    content.business.googleBusinessUrl || content.business.directionsUrl;

  return (
    <main className="bg-white">
      <ScrollAnimator />
      <Header phoneHref={phoneHref} />

      {/* ── 1. HERO ─────────────────────────────────── */}
      <HeroCarousel
        slides={heroImages}
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
      />

      {/* ── 2. GOOGLE REVIEWS ───────────────────────── */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="page-shell">
          <div className="fade-up mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="section-label">Customer Reviews</p>
            <span className="rating-badge">4.9 ★ on Google</span>
          </div>
          <h2 className="fade-up section-heading mb-10" style={{ transitionDelay: "80ms" }}>
            What Our Customers Say
          </h2>
        </div>

        <ReviewMarquee reviews={content.reviews} />

        <div className="page-shell mt-10 fade-up" style={{ transitionDelay: "120ms" }}>
          <a
            href={googleBusinessHref}
            target="_blank"
            rel="noreferrer"
            className="btn-outline-green"
          >
            View All Reviews on Google
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── 3. SERVICES ─────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "#f0faf4" }}>
        <div className="page-shell">
          <p className="fade-up section-label mb-3">What We Offer</p>
          <h2 className="fade-up section-heading mb-10" style={{ transitionDelay: "80ms" }}>
            Our Services
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((svc, i) => (
              <div
                key={svc.name}
                className="service-card fade-up"
                style={{ transitionDelay: `${i * 60 + 120}ms` }}
              >
                <div
                  className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-[#1b6b3a]"
                  style={{ background: "#ddf2e6" }}
                >
                  {svc.icon}
                </div>
                <h3 className="text-base font-bold text-[#0f2e1c]">{svc.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5c7466]">{svc.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 fade-up" style={{ transitionDelay: "500ms" }}>
            <a href={whatsappHref} className="btn-green">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L0 24l6.336-1.501A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.006-1.368l-.36-.215-3.727.883.936-3.638-.236-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. CONTACT + BRANDS ─────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="page-shell">
          <p className="fade-up section-label mb-3">Find Us</p>
          <h2 className="fade-up section-heading mb-10" style={{ transitionDelay: "80ms" }}>
            Visit Orion Computers
          </h2>

          <div className="grid gap-6 md:grid-cols-2 fade-up" style={{ transitionDelay: "120ms" }}>
            {/* Info card */}
            <div className="rounded-2xl border border-[#d5e5d7] bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="mt-0.5 text-[#1b6b3a]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-[#5c7466]">{content.business.address}</p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 text-[#1b6b3a]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-[#5c7466]">{content.business.timings}</p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 text-[#1b6b3a]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                    </svg>
                  </span>
                  <p className="text-sm font-semibold text-[#0f2e1c]">{content.business.phonePrimary}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappHref} className="btn-green flex-1 justify-center">
                  WhatsApp Us
                </a>
                <a
                  href={content.business.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-green flex-1 justify-center"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-[#d5e5d7] shadow-sm" style={{ minHeight: "280px" }}>
              <iframe
                title="Orion Computers location"
                src={content.business.mapEmbedUrl}
                className="h-full w-full"
                style={{ minHeight: "280px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Brands ticker */}
          <div className="mt-12 fade-up" style={{ transitionDelay: "200ms" }}>
            <p className="mb-4 text-sm font-bold text-[#5c7466] uppercase tracking-widest">
              Brands We Deal In
            </p>
            <BrandTicker />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-[#d5e5d7] bg-[#f0faf4] py-6">
        <div className="page-shell flex flex-col items-center gap-2 text-center text-xs text-[#5c7466]">
          <p>© {new Date().getFullYear()} Orion Computers · Nanded, Maharashtra</p>
          <p>Trusted Computer Sales &amp; Service Since 1999</p>
        </div>
      </footer>

      {/* ── Floating WhatsApp ────────────────────────── */}
      <a
        href={whatsappHref}
        className="wa-btn fixed right-4 bottom-20 z-50 hidden md:flex items-center gap-2 rounded-full bg-[#1b6b3a] px-5 py-3 text-sm font-bold text-white shadow-lg"
        aria-label="Chat on WhatsApp"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L0 24l6.336-1.501A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.006-1.368l-.36-.215-3.727.883.936-3.638-.236-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
        WhatsApp
      </a>

      {/* ── Mobile sticky bar ────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#d5e5d7] bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="page-shell flex gap-3">
          <a href={phoneHref} className="btn-outline-green flex-1 justify-center py-3 text-sm">
            Call Now
          </a>
          <a href={whatsappHref} className="btn-green flex-1 justify-center py-3 text-sm">
            WhatsApp Chat
          </a>
        </div>
      </div>
    </main>
  );
}
