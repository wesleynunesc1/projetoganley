'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Training } from '@/types';

interface TrainingCardProps {
  training: Training;
  progress?: {
    currentPage: number;
    totalPages: number;
    completed: boolean;
    favorited: boolean;
  };
  priority?: boolean;
}

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: 'Iniciante', className: 'badge-pill-beginner' },
  intermediate: { label: 'Intermediário', className: 'badge-pill-intermediate' },
  advanced: { label: 'Avançado', className: 'badge-pill-advanced' },
  special: { label: 'Pro / Olympia', className: 'badge-pill-special' },
};

export default function TrainingCard({ training, progress, priority = false }: TrainingCardProps) {
  const levelBadge = levelLabels[training.level] || {
    label: training.level,
    className: 'badge-pill-special',
  };

  const percentComplete = progress && progress.totalPages > 0
    ? Math.round((progress.currentPage / progress.totalPages) * 100)
    : 0;

  return (
    <Link href={`/treinamentos/${training.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl bg-[#0C0A12] border border-white/[0.07] group-hover:border-ganley-purple/50 shadow-xl group-hover:shadow-ambient-purple flex flex-col h-full transition-colors duration-300"
      >
        {/* Cover Aspect Ratio Container (Cinema Poster format 2:3) */}
        <div className="relative w-full aspect-[2/3] bg-[#120F1C] overflow-hidden">
          <img
            src={`/api/cover/${training.slug}`}
            alt={training.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Cinematic Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A12] via-[#0C0A12]/30 to-transparent opacity-95" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className={`badge-pill ${levelBadge.className} shadow-lg backdrop-blur-md text-[11px]`}>
              {levelBadge.label}
            </span>

            {training.weeklyFrequency && (
              <span className="badge-pill bg-black/60 text-white/90 border-white/10 shadow-lg backdrop-blur-md text-[11px]">
                {training.weeklyFrequency}x / sem
              </span>
            )}
          </div>

          {/* Progress Bar (if training is in progress) */}
          {progress && progress.totalPages > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-ganley-orange via-ganley-magenta to-ganley-purple transition-all duration-300"
                style={{ width: `${progress.completed ? 100 : percentComplete}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Info Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-[#0C0A12]">
          <div>
            <h3 className="font-sans font-bold text-white text-sm sm:text-base tracking-tight line-clamp-2 group-hover:text-ganley-purple-light transition-colors duration-200">
              {training.title}
            </h3>
            <p className="text-ganley-gray text-xs line-clamp-2 mt-1.5 leading-relaxed font-sans font-normal">
              {training.description}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-ganley-gray">
            <span className="flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-ganley-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{training.pdfFiles.length === 1 ? 'Guia Principal' : `${training.pdfFiles.length} Arquivos`}</span>
            </span>

            {progress?.completed ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Concluído
              </span>
            ) : progress && progress.currentPage > 1 ? (
              <span className="text-ganley-orange font-medium">
                Pág. {progress.currentPage}/{progress.totalPages}
              </span>
            ) : (
              <span className="text-white/60 group-hover:text-white flex items-center gap-1 transition-colors">
                <span>Acessar</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
