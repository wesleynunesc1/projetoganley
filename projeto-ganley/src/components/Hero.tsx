'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Training } from '@/types';

interface HeroProps {
  featuredTrainings: Training[];
  lastTraining?: Training | null;
}

export default function Hero({ featuredTrainings, lastTraining }: HeroProps) {
  return (
    <div className="relative min-h-[86vh] lg:min-h-[92vh] flex items-center bg-[#050505] overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Real hero photo in background with deep vignette and lighting */}
        <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full opacity-35 lg:opacity-50 overflow-hidden">
          <img
            src="/api/cover/treino-abcdef-classic-olympia-ramon"
            alt="Classic Olympia Background"
            className="w-full h-full object-cover object-top scale-105 filter brightness-[0.75] contrast-[1.15]"
          />
          {/* Gradients blending photo into the deep dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]" />
        </div>

        {/* Ambient atmospheric lighting orbs */}
        <div
          className="ambient-glow -top-32 left-1/4 w-[600px] h-[600px]"
          style={{ background: '#9747FF' }}
        />
        <div
          className="ambient-glow bottom-0 right-1/4 w-[500px] h-[500px]"
          style={{ background: '#FF2689', opacity: 0.12 }}
        />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 sm:py-32">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-ganley-orange to-ganley-magenta" />
            <span className="text-[11px] font-sans font-semibold tracking-wider text-ganley-gray-light uppercase">
              Metodologia de Alta Performance
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]"
          >
            A EVOLUÇÃO NÃO <br />
            ACONTECE POR <span className="text-gradient-accent">ACASO.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-ganley-gray text-base sm:text-xl font-sans font-normal mt-6 leading-relaxed max-w-xl"
          >
            Treinamentos estruturados para diferentes níveis, objetivos e etapas da sua evolução.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10"
          >
            <Link href="/treinamentos" className="btn-accent text-sm sm:text-base px-8 py-4">
              Explorar treinamentos
            </Link>

            {lastTraining ? (
              <Link
                href={`/treinamentos/${lastTraining.slug}`}
                className="btn-glass text-sm sm:text-base px-7 py-4 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-ganley-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continuar de onde parei
              </Link>
            ) : (
              <Link
                href="/treinamentos/recomendacoes-gerais"
                className="btn-glass text-sm sm:text-base px-7 py-4"
              >
                Comece por aqui
              </Link>
            )}
          </motion.div>

          {/* Quick Pillars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="grid grid-cols-3 gap-6 sm:gap-10 pt-10 mt-12 border-t border-white/[0.08] max-w-lg"
          >
            <div>
              <p className="font-space font-bold text-2xl sm:text-3xl text-white tracking-tight">20</p>
              <p className="text-xs text-ganley-gray font-sans mt-0.5">Programas Oficiais</p>
            </div>
            <div>
              <p className="font-space font-bold text-2xl sm:text-3xl text-gradient-accent tracking-tight">100%</p>
              <p className="text-xs text-ganley-gray font-sans mt-0.5">PDF Integrado</p>
            </div>
            <div>
              <p className="font-space font-bold text-2xl sm:text-3xl text-white tracking-tight">Pro</p>
              <p className="text-xs text-ganley-gray font-sans mt-0.5">Nível Olympia</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
