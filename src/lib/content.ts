import { promises as fs } from "node:fs";
import path from "node:path";

export type SiteContent = {
  business: {
    name: string;
    city: string;
    tagline: string;
    subheadline: string;
    description: string;
    since: string;
    phonePrimary: string;
    phoneSecondary: string;
    whatsapp: string;
    email: string;
    address: string;
    timings: string;
    mapEmbedUrl: string;
    directionsUrl: string;
    instagram: string;
    facebook: string;
  };
  heroImages: Array<{ src: string; alt: string }>;
  trustCards: Array<{ title: string; description: string }>;
  categories: Array<{ title: string; description: string; image: string }>;
  services: string[];
  featuredProducts: Array<{
    title: string;
    specs: string;
    image: string;
    price: string;
    oldPrice: string;
    badge: string;
  }>;
  inStoreOffers: Array<{
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
  }>;
  whyChooseUs: string[];
  reviews: Array<{
    name: string;
    role: string;
    rating: number;
    text: string;
    avatar: string;
  }>;
  brands: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const file = await fs.readFile(contentPath, "utf8");
  return JSON.parse(file) as SiteContent;
}

export async function saveSiteContent(content: SiteContent) {
  await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}