"use client";

type Review = {
  name: string;
  role: string;
  rating: number;
  text: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const doubled = [...reviews, ...reviews];

  return (
    <div className="marquee-container py-2">
      <div className="marquee-track">
        {doubled.map((r, i) => (
          <article key={i} className="review-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0faf4] text-sm font-black text-[#1b6b3a]">
                {getInitials(r.name)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f2e1c]">{r.name}</p>
                <p className="text-xs text-[#5c7466]">{r.role}</p>
              </div>
            </div>
            <p className="mt-2.5 text-amber-400 leading-none" aria-label={`${r.rating} stars`}>
              {"★".repeat(r.rating)}
            </p>
            <p className="review-text mt-2 text-sm leading-relaxed text-[#5c7466]">{r.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
