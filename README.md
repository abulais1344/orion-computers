# Orion Computers, Nanded

Premium local business website for Orion Computers, a trusted computer showroom and service business in Nanded established in 1999.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Local JSON content source for easy updates
- Simple password-protected admin panel

## Key Features

- Mobile-first premium storefront design
- Sticky WhatsApp and call actions for mobile visitors
- Product categories, services, featured offers, reviews, and brand grid
- Google Maps embed and click-to-call actions
- SEO metadata and local business schema
- Lightweight admin panel at `/admin`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin Panel

- URL: `/admin`
- Default password: `orion123`

For production, set these environment variables:

```bash
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=your-long-random-secret
```

The admin currently updates content stored in `data/content.json`.

## Content Updates

Most website content is managed from `data/content.json`, including:

- business details
- hero images
- trust cards
- categories
- services
- featured products
- reviews
- brands
- SEO text

## Production Notes

- Replace the placeholder Unsplash images with real showroom and product photos.
- Replace the placeholder phone numbers, email, address, and map URL with live business details.
- Configure HTTPS and secure environment variables before deployment.
- Consider replacing the JSON-based admin storage with a CMS or database if multiple admins will manage content.

## Validation

The project has been verified with:

- `npm run lint`
- `npm run build`
