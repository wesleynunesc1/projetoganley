'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Training } from '@/types';

interface HeroProps {
  featuredTrainings: Training[];
}

export default function Hero({ featuredTrainings }: HeroProps) {
  // Use first 3-4 featured trainings for dynamic background showcase
  const primaryFeatured = featuredTrainings[0] || null;

  return (
    <div className="relative min-h-[82vh] flex items-center pt-24 pb-16 overflow-hidden bg-ganley-black">
      {/* Deep atmospheric glow layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle 800px at 70% 30%, rgba(151,71,255,0.18), transparent 70%),
              radial-gradient(circle 600px at 20% 70%, rgba(255,38,137,0.12), transparent 70%),
              radial-gradient(circle 500px at 50% 90%, rgba(255,156,43,0.08), transparent 60%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ganley-black via-ganley-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ganley-black via-ganley-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines and CTAs */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-ganley-magenta animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-ganley-gray uppercase">
              Biblioteca Exclusiva de Treinamentos
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-space text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
            TREINE COM <span className="text-gradient">PROPÓSITO.</span>
            <br />
            EVOLUA COM <span className="text-gradient">MÉTODO.</span>
          </h1>

          {/* Description */}
          <p className="text-ganley-gray text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-sans">
            Encontre o treinamento ideal para seu nível, explore diferentes divisões musculares e tenha acesso a uma biblioteca completa de evolução física.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Link
              href="/treinamentos"
              className="btn-primary w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg hover:shadow-ganley-purple/30"
            >
              EXPLORAR TREINAMENTOS
            </Link>

            <Link
              href="/treinamentos/recomendacoes-gerais"
              className="btn-ghost w-full sm:w-auto px-6 py-4 text-sm font-semibold"
            >
              Comece por aqui
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-10 mt-10 border-t border-white/5 w-full max-w-lg">
            <div>
              <p className="font-space font-black text-2xl sm:text-3xl text-white">20</p>
              <p className="text-xs text-ganley-gray mt-0.5">Programas completos</p>
            </div>
            <div>
              <p className="font-space font-black text-2xl sm:text-3xl text-gradient">100%</p>
              <p className="text-xs text-ganley-gray mt-0.5">PDF integrado</p>
            </div>
            <div>
              <p className="font-space font-black text-2xl sm:text-3xl text-white">4</p>
              <p className="text-xs text-ganley-gray mt-0.5">Níveis de evolução</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visual Showcase using Real Original Project Covers */}
        <motion.div
          className="lg:col-span-5 relative hidden lg:block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
            {/* Background glowing card (Derek / Ramon Dino) */}
            <div className="absolute -top-4 -right-4 w-3/4 aspect-[2/3] rounded-2xl overflow-hidden opacity-40 border border-white/10 blur-[1px] rotate-6 scale-90">
              <img
                src="/api/cover/treino-abcdef-classic-olympia-ramon"
                alt="Classic Olympia"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle glowing card */}
            <div className="absolute -bottom-4 -left-4 w-3/4 aspect-[2/3] rounded-2xl overflow-hidden opacity-40 border border-white/10 blur-[1px] -rotate-6 scale-90">
              <img
                src="/api/cover/treino-mens-physique-ali-bilal"
                alt="Ali Bilal"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Front Featured Card */}
            <div className="relative z-10 w-4/5 mx-auto aspect-[2/3] rounded-2xl overflow-hidden border border-ganley-purple/40 shadow-2xl shadow-ganley-purple/20 bg-ganley-black-card group">
              <img
                src="/api/cover/treino-abcdef-derek-open-olympia"
                alt="Treino ABCDEF Derek Open Olympia"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ganley-black via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="badge badge-level-special text-[10px] mb-1.5">
                  DESTAQUE SUPREMO
                </span>
                <p className="font-space font-bold text-white text-sm line-clamp-1">
                  Treino ABCDEF — Derek Open Olympia
                </p>
                <Link
                  href="/treinamentos/treino-abcdef-derek-open-olympia"
                  className="inline-flex items-center gap-1 text-xs text-ganley-orange-light font-medium mt-1 hover:underline"
                >
                  Abrir programa →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
