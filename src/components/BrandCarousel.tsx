'use client';

import { useRef, useState, useEffect } from 'react';

type Brand = {
  id: string;
  name: string;
  logo: React.ReactNode;
};

const brands: Brand[] = [
  {
    id: 'hp',
    name: 'HP',
    logo: (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="32" fontWeight="bold" fill="currentColor">
            HP
          </text>
        </svg>
      </div>
    ),
  },
  {
    id: 'dell',
    name: 'Dell',
    logo: (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">
            Dell
          </text>
        </svg>
      </div>
    ),
  },
  {
    id: 'lenovo',
    name: 'Lenovo',
    logo: (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="20" fontWeight="bold" fill="currentColor">
            Lenovo
          </text>
        </svg>
      </div>
    ),
  },
  {
    id: 'asus',
    name: 'ASUS',
    logo: (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">
            ASUS
          </text>
        </svg>
      </div>
    ),
  },
  {
    id: 'acer',
    name: 'Acer',
    logo: (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">
            Acer
          </text>
        </svg>
      </div>
    ),
  },
  {
    id: 'msi',
    name: 'MSI',
    logo: (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">
            MSI
          </text>
        </svg>
      </div>
    ),
  },
];

export function BrandCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 md:-ml-6 p-2 rounded-full transition-all duration-200 ${
          canScrollLeft
            ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
        }`}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-6 px-4 md:px-6 py-6 md:py-8 overflow-x-auto hide-scrollbar scroll-smooth"
        >
          {/* Animated carousel items + duplicates for infinite feel */}
          {[...brands, ...brands].map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="flex-shrink-0 w-24 md:w-32 h-28 md:h-36 bg-gradient-to-br from-[var(--surface-soft)] to-white rounded-xl border border-[var(--line)] flex items-center justify-center transition-transform hover:scale-105 hover:shadow-lg group-hover:animate-pulse cursor-pointer"
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              <div className="text-[var(--primary-dark)]">{brand.logo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 md:-mr-6 p-2 rounded-full transition-all duration-200 ${
          canScrollRight
            ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
        }`}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
