import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageGallery } from "@/components/ImageGallery";
import { BrandCarousel } from "@/components/BrandCarousel";
import { Header } from "@/components/Header";

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
  heroImages: Array<{ src: string; alt: string }>;
  galleryImages?: Array<{ src: string; alt: string }>;
  reviews: Array<{ name: string; role: string; rating: number; text: string }>;
};

function getWhatsAppLink(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const dealItems = [
  {
    title: "Laptops / Desktops",
    details: "Sales, service, and complete hardware support for all brands.",
  },
  {
    title: "Gaming PC",
    details: "Custom builds, upgrades, and performance optimization.",
  },
  {
    title: "Laptop Repairs",
    details: "Fast diagnosis, repairs, and genuine component replacement.",
  },
  {
    title: "Printers",
    details: "Sales and maintenance for home and office printers.",
  },
  {
    title: "Accessories",
    details: "Keyboards, mice, cables, and all computer peripherals.",
  },
];

export default function Home() {
  const content = JSON.parse(
    readFileSync(path.join(process.cwd(), "data/content.json"), "utf8")
  ) as SiteContent;

  const phoneHref = `tel:${content.business.phonePrimary.replace(/\s+/g, "")}`;
  const whatsappHref = getWhatsAppLink(
    content.business.whatsapp,
    "Hello Orion Computers, I want to enquire on WhatsApp."
  );
  const googleBusinessHref = content.business.googleBusinessUrl || content.business.directionsUrl;

  const galleryImages =
    content.galleryImages && content.galleryImages.length > 0
      ? content.galleryImages
      : [
          { src: "/orion-images/hero-mobile.png", alt: "Orion Computers day view" },
          { src: "/orion-images/services.png", alt: "Products and accessories" },
          { src: "/orion-images/store-view.png", alt: "Store interior" },
        ];

  return (
    <main className="pb-28">
      <Header phoneHref={phoneHref} />

      <section id="hero" className="page-shell pt-5 md:pt-8">
        <div className="hero-panel grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="trust-chip">Authorized Dealer Since 1999</span>
            </div>
            <h1 className="hero-title">Trusted Computer Sales &amp; Service Since 1999</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
              Laptops, Repairs, CCTV &amp; Accessories in Nanded.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <a href={whatsappHref} className="button-primary text-center">WhatsApp Now</a>
              <a href={phoneHref} className="button-secondary text-center">Call Store</a>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="trust-chip text-[11px]">HP | Dell | Lenovo | MSI</span>
              <span className="trust-chip text-[11px]">Genuine Products</span>
              <span className="trust-chip text-[11px]">10,000+ Customers</span>
              <span className="trust-chip text-[11px]">25+ Years Experience</span>
            </div>
          </div>

          <ImageGallery images={content.heroImages.slice(0, 2)} variant="hero" />
        </div>
      </section>

      <section className="page-shell mt-5">
        <ImageGallery images={galleryImages} variant="strip" />
      </section>

      <section id="reviews" className="page-shell mt-8 md:mt-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="section-heading">Google Reviews</h2>
          <div className="rating-chip">4.9★ Google Rating</div>
        </div>
        <div className="review-scroll hide-scrollbar">
          {content.reviews.slice(0, 5).map((review) => (
            <article key={review.name} className="review-card snap-start">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-soft)] text-sm font-bold text-[var(--primary-dark)]">
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{review.name}</p>
                  <p className="text-xs text-[var(--muted)]">{review.role}</p>
                </div>
              </div>
              <p className="mt-2 text-amber-500">{"★".repeat(review.rating)}</p>
              <p className="review-text mt-2 text-sm text-[var(--muted)]">{review.text}</p>
              <a
                href={googleBusinessHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-xs font-semibold text-[var(--primary-dark)] underline"
              >
                Read more on Google
              </a>
            </article>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
          <a href={whatsappHref} className="button-primary inline-flex">WhatsApp for Quick Enquiry</a>
          <a href={content.business.directionsUrl} target="_blank" rel="noreferrer" className="button-secondary inline-flex">
            View on Google Maps
          </a>
        </div>
      </section>

      <section id="services" className="page-shell mt-8 md:mt-10">
        <h2 className="section-heading">Services</h2>
        <div className="mt-4 grid gap-2.5 md:grid-cols-2">
          {dealItems.map((item) => (
            <details key={item.title} className="deal-item group">
              <summary className="deal-summary">{item.title}</summary>
              <p className="deal-details">{item.details}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="brands" className="page-shell mt-8 md:mt-10">
        <h2 className="section-heading">Brands &amp; Authorized Dealer</h2>
        <div className="mt-6">
          <BrandCarousel />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="trust-chip">Authorized Dealer</span>
          <span className="trust-chip">Genuine Products</span>
          <span className="trust-chip">Trusted Brands</span>
        </div>
        <div className="mt-4">
          <a href={whatsappHref} className="button-primary inline-flex">WhatsApp Now</a>
        </div>
      </section>

      <section id="location" className="page-shell mt-8 md:mt-10">
        <h2 className="section-heading">Visit Orion Computers</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.1fr]">
          <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Store Address</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{content.business.address}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">{content.business.timings}</p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <a href={content.business.directionsUrl} target="_blank" rel="noreferrer" className="button-primary text-center">
                Navigate to Orion Computers
              </a>
              <a href={phoneHref} className="button-secondary text-center">Call Store</a>
            </div>
          </article>
          <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
            <iframe
              title="Orion Computers location"
              src={content.business.mapEmbedUrl}
              className="h-[260px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white py-6">
        <div className="page-shell text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Orion Computers | Trusted in Nanded since 1999
        </div>
      </footer>

      <a href={whatsappHref} className="floating-whatsapp items-center justify-center rounded-full bg-[#2f7a4f] px-4 py-3 text-sm font-bold text-white shadow-lg">
        WhatsApp
      </a>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-white/95 p-3 backdrop-blur">
        <div className="page-shell flex gap-2.5">
          <a href={phoneHref} className="button-secondary flex-1 text-center">Call Now</a>
          <a href={whatsappHref} className="button-primary flex-1 text-center">WhatsApp Chat</a>
        </div>
      </div>
    </main>
  );
}
