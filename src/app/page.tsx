import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Camera,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Headphones,
  LayoutGrid,
  MapPin,
  MonitorSmartphone,
  MessageCircle,
  Phone,
  Printer,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { getSiteContent } from "@/lib/content";
import Header from "@/components/Header";

const categoryIcons = [
  MonitorSmartphone,
  Cpu,
  Printer,
  Camera,
  Headphones,
  LayoutGrid,
  ShieldCheck,
];

const serviceIcons = [
  Wrench,
  Cpu,
  Printer,
  MonitorSmartphone,
  LayoutGrid,
  ShieldCheck,
  Camera,
];

const trustIcons = [CalendarClock, BadgeCheck, ShieldCheck, Wrench];
const brandLogos = [
  { name: "HP", src: "/brands/hp.svg", icon: true },
  { name: "Dell", src: "/brands/dell.svg", icon: true },
  { name: "Lenovo", src: "/brands/lenovo.svg", icon: false },
  { name: "Asus", src: "/brands/asus.svg", icon: false },
  { name: "Acer", src: "/brands/acer.svg", icon: false },
  { name: "Canon", src: "/brands/canon.svg", icon: false },
  { name: "Samsung", src: "/brands/samsung.svg", icon: false },
  { name: "MSI", src: "/brands/msi.svg", icon: true },
];

function whatsappLink(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export default async function Home() {
  const content = await getSiteContent();
  const phoneHref = `tel:${content.business.phonePrimary.replace(/\s+/g, "")}`;
  const whatsappHref = whatsappLink(
    content.business.whatsapp,
    "Hello Orion Computers, I want to enquire about products and services."
  );
  const visitHref = content.business.directionsUrl;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: content.business.name,
    description: content.seo.description,
    telephone: content.business.phonePrimary,
    email: content.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.business.address,
      addressLocality: content.business.city,
      addressRegion: "Maharashtra",
      postalCode: "431601",
      addressCountry: "IN",
    },
    sameAs: [content.business.instagram, content.business.facebook],
    url: "https://orioncomputers.in",
    areaServed: "Nanded",
    openingHours: "Mo-Sa 10:00-20:30",
  };

  return (
    <main className="pb-28 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <Header phoneHref={phoneHref} whatsappHref={whatsappHref} visitHref={visitHref} since={content.business.since} />

      <section id="home" className="relative overflow-hidden pt-6 md:pt-10">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(200,235,209,0.65),_transparent_52%),radial-gradient(circle_at_top_right,_rgba(223,241,228,0.9),_transparent_38%)]" />
        <div className="section-shell relative">
          <div className="hero-grid relative items-center rounded-[2rem] border border-[var(--line)] bg-white px-5 py-5 shadow-[var(--shadow-soft)] md:px-8 md:py-8">
            <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 md:left-auto md:right-7 md:translate-x-0">
              <div className="trust-badge-float inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--primary-dark)] shadow-[var(--shadow-soft)] md:text-sm">
                <span aria-hidden="true">⭐</span>
                <span>25+ Years Trusted in Nanded</span>
              </div>
            </div>
            <div className="py-4 md:py-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--primary-dark)]">
                <ShieldCheck className="h-4 w-4" />
                ORION - A Mark of Trust
              </div>
              <h1 className="section-title max-w-2xl">{content.business.tagline}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
                {content.business.subheadline}
              </p>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                {content.business.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappHref} className="button-primary inline-flex items-center justify-center gap-2">
                  WhatsApp Now
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href={phoneHref} className="button-secondary inline-flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Store
                </a>
                <a href={visitHref} className="button-ghost inline-flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Visit Store
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-2">Laptop sales</span>
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-2">Repairs & upgrades</span>
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-2">Business tech support</span>
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-2">
                  Authorized Dealer
                </span>
              </div>
            </div>

            <div className="hero-collage">
              {content.heroImages.map((image, index) => (
                <div key={image.alt} className="hero-collage-card">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    style={{
                      objectPosition:
                        index === 0 ? "center 20%" : index === 1 ? "14% 26%" : "center 35%",
                    }}
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-6 md:mt-8">
        <div className="rounded-[1.6rem] border border-[var(--line)] bg-white p-3 shadow-[var(--shadow-card)] md:p-4">
          <div className="group relative">
            <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 md:mx-0 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0">
              {[
                "25+ Years Experience",
                "10,000+ Customers",
                "Genuine Products",
                "Fast Repairs",
                "Same Day Support",
              ].map((item) => (
                <div
                  key={item}
                  className="min-w-[158px] rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-2.5 text-center text-xs font-bold text-[var(--primary-dark)] md:min-w-0 md:py-3 md:text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white via-white to-transparent md:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white via-white to-transparent md:hidden" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-60 md:hidden">
              <ChevronLeft className="h-5 w-5 text-[var(--primary-dark)]" />
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-60 md:hidden">
              <ChevronRight className="h-5 w-5 text-[var(--primary-dark)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-8 md:mt-12">
        <div className="trust-grid">
          {content.trustCards.map((item, index) => {
            const Icon = trustIcons[index % trustIcons.length];
            return (
              <article key={item.title} className="card-surface rounded-[1.5rem] p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary-dark)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="products" className="section-shell mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Product Categories</p>
            <h2 className="section-title mt-3">Everything customers usually ask for, in one trusted showroom.</h2>
          </div>
          <a href={whatsappHref} className="button-ghost hidden md:inline-flex md:items-center md:gap-2">
            Enquire on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="category-grid mt-8">
          {content.categories.map((category, index) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <article key={category.title} className="card-surface overflow-hidden rounded-[1.75rem]">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--primary-dark)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{category.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{category.description}</p>
                  <a
                    href={whatsappLink(
                      content.business.whatsapp,
                      `Hello Orion Computers, I want to enquire about ${category.title}.`
                    )}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-dark)]"
                  >
                    WhatsApp enquiry
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="services" className="section-shell mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Services</p>
            <h2 className="section-title mt-3">Repair, installation, upgrades, and ongoing support.</h2>
          </div>
        </div>
        <div className="service-grid mt-8">
          {content.services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <article key={service} className="card-surface flex items-center gap-3 rounded-[1.35rem] px-4 py-4 md:block md:px-5 md:py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary-dark)] md:mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold">{service}</h3>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="grid gap-5 rounded-[2rem] border border-[var(--line)] bg-white px-6 py-8 shadow-[var(--shadow-soft)] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Why Choose Us</p>
            <h2 className="section-title mt-3">The kind of business customers return to and recommend.</h2>
          </div>
          <div className="why-grid">
            {content.whyChooseUs.map((point) => (
              <article key={point} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                <ShieldCheck className="h-5 w-5 text-[var(--primary-dark)]" />
                <p className="mt-3 text-sm leading-7 text-slate-700">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="section-shell mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Google Reviews</p>
            <h2 className="section-title mt-3">Customer feedback that strengthens trust before the first call.</h2>
          </div>
        </div>
        <div className="group relative mt-8">
          <div className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:gap-4">
            {content.reviews.slice(0, 4).map((review) => (
            <article
              key={review.name}
              className="card-surface min-w-[90%] snap-start rounded-[1.45rem] p-4 md:min-w-[48%] md:rounded-[1.6rem] md:p-5 lg:min-w-[31%]"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <h3 className="font-bold">{review.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{review.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={`${review.name}-${index}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{review.text}</p>
            </article>
          ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--surface-soft)] via-[var(--surface-soft)] to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--surface-soft)] via-[var(--surface-soft)] to-transparent md:hidden" />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60 md:hidden">
            <ChevronLeft className="h-5 w-5 text-[var(--primary-dark)]" />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 md:hidden">
            <ChevronRight className="h-5 w-5 text-[var(--primary-dark)]" />
          </div>
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="rounded-[1.8rem] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#f4faf5_100%)] px-6 py-8 text-center shadow-[var(--shadow-soft)]">
          <p className="mx-auto max-w-4xl text-lg leading-9 text-slate-700 md:text-xl">
            "For more than 25 years, Orion Computers has served students, businesses, and families in Nanded with genuine products and dependable support."
          </p>
          <p className="mt-4 text-sm font-bold tracking-[0.08em] text-[var(--primary-dark)] uppercase">
            Founder, Orion Computers
          </p>
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white px-6 py-8 shadow-[var(--shadow-soft)] lg:px-8 lg:py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Brands</p>
          <h2 className="section-title mt-3">Brands customers already know and trust.</h2>
          <div className="brand-grid mt-8">
            {brandLogos.map((brand) => (
              <div
                key={brand.name}
                className="flex min-h-[118px] flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 py-4"
              >
                {brand.icon ? (
                  <div className="relative h-16 w-16 md:h-20 md:w-20">
                    <Image
                      src={brand.src}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="relative h-12 w-full md:h-14">
                    <Image
                      src={brand.src}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell mt-20 mb-16">
        <div className="grid gap-6 rounded-[2rem] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
          <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,#f3faf4_0%,#ffffff_100%)] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Visit Orion Computers</p>
            <h2 className="section-title mt-3">Easy to contact, easy to visit, quick to respond.</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
              <div>
                <div className="font-bold text-slate-900">Store Address</div>
                <div>{content.business.address}</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">Timings</div>
                <div>{content.business.timings}</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">Phone Numbers</div>
                <div>{content.business.phonePrimary}</div>
                <div>{content.business.phoneSecondary}</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">WhatsApp</div>
                <div>{content.business.whatsapp}</div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={visitHref} className="button-primary inline-flex items-center justify-center gap-2">
                Get Directions
                <MapPin className="h-4 w-4" />
              </a>
              <a href={whatsappHref} className="button-secondary inline-flex items-center justify-center gap-2">
                WhatsApp Location
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface-soft)]">
            <iframe
              src={content.business.mapEmbedUrl}
              title="Orion Computers Location"
              className="h-[360px] w-full border-0 md:h-full md:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white pb-24 pt-10 md:pb-12 md:pt-12">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4 md:p-6">
            <div className="text-center">
              <div className="text-lg font-extrabold tracking-[0.16em] text-[var(--primary-dark)] uppercase">Orion Computers</div>
              <p className="mt-2 text-sm text-[var(--muted)]">Trusted in Nanded since 1999</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-slate-700">
              <a href={visitHref} className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 transition-colors hover:text-[var(--primary-dark)]">
                <MapPin className="h-4 w-4" />
                Address
              </a>
              <a href={phoneHref} className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 transition-colors hover:text-[var(--primary-dark)]">
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a href={whatsappHref} className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 transition-colors hover:text-[var(--primary-dark)]">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a href={phoneHref} className="inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 font-semibold text-[var(--primary-dark)] transition-colors hover:bg-[var(--accent)]">
                Quick Call
              </a>
              <div className="col-span-2 inline-flex items-start gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-left leading-6">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{content.business.timings}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-[var(--line)] pt-4">
            <div className="flex items-center justify-center gap-8 text-xs text-[var(--muted)]">
              <Link href="#" className="transition-colors hover:text-[var(--primary-dark)]">Privacy Policy</Link>
              <Link href="#" className="transition-colors hover:text-[var(--primary-dark)]">Terms</Link>
            </div>
            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} Orion Computers. All rights reserved. | Serving Nanded since 1999
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-white/96 p-3 shadow-[0_-8px_30px_rgba(18,37,27,0.08)] backdrop-blur md:hidden">
        <div className="section-shell flex gap-3">
          <a href={phoneHref} className="button-secondary flex-1 text-center">
            Call Now
          </a>
          <a href={whatsappHref} className="button-primary flex-1 text-center">
            WhatsApp Chat
          </a>
        </div>
      </div>
    </main>
  );
}
