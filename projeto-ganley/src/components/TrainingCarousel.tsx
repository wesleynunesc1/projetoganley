'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Training } from '@/types';
import TrainingCard from './TrainingCard';

interface TrainingCarouselProps {
  title: string;
  subtitle?: string;
  trainings: Training[];
  viewAllHref?: string;
}

export default function TrainingCarousel({
  title,
  subtitle,
  trainings,
  viewAllHref,
}: TrainingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [trainings]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    const scrollAmount = clientWidth * 0.75;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!trainings || trainings.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-end justify-between">
        <div>
          <h2 className="section-heading flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-normal text-ganley-gray-dark px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
              {trainings.length}
            </span>
          </h2>
          {subtitle && (
            <p className="text-ganley-gray text-xs sm:text-sm mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm text-ganley-purple-light hover:text-white transition-colors font-medium mr-2"
            >
              Ver todos →
            </Link>
          )}

          {/* Desktop Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Rolar para esquerda"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-white/10 bg-black/40 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Rolar para direita"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-white/10 bg-black/40 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-4 sm:px-6 max-w-7xl mx-auto carousel-scroll"
      >
        {trainings.map((training) => (
          <div
            key={training.id}
            className="w-[200px] sm:w-[240px] md:w-[260px] flex-shrink-0 carousel-item"
          >
            <TrainingCard training={training} />
          </div>
        ))}
      </div>
    </section>
  );
}

