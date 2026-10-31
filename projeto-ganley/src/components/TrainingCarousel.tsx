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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">
              {title}
            </h2>
            <span className="text-[11px] font-sans font-semibold text-ganley-gray px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              {trainings.length}
            </span>
          </div>
          {subtitle && (
            <p className="text-ganley-gray text-xs sm:text-sm mt-1 font-sans font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm font-sans font-medium text-ganley-purple-light hover:text-white transition-colors mr-2 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <span>→</span>
            </Link>
          )}

          {/* Desktop Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Rolar para esquerda"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-white/[0.08] bg-black/60 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/[0.1] hover:border-white/[0.2] transition-all backdrop-blur-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Rolar para direita"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-white/[0.08] bg-black/60 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/[0.1] hover:border-white/[0.2] transition-all backdrop-blur-md"
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
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-5 pt-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto carousel-scroll"
      >
        {trainings.map((training) => (
          <div
            key={training.id}
            className="w-[210px] sm:w-[240px] md:w-[260px] flex-shrink-0 carousel-item"
          >
            <TrainingCard training={training} />
          </div>
        ))}
      </div>
    </section>
  );
}
