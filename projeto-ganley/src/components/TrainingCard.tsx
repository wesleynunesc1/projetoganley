'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Training } from '@/types';
import { motion } from 'framer-motion';

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
  beginner: { label: 'Iniciante', className: 'badge-level-beginner' },
  intermediate: { label: 'Intermediário', className: 'badge-level-intermediate' },
  advanced: { label: 'Avançado', className: 'badge-level-advanced' },
  special: { label: 'Pro / Olympia', className: 'badge-level-special' },
};

export default function TrainingCard({ training, progress, priority = false }: TrainingCardProps) {
  const levelInfo = levelLabels[training.level] || { label: training.level, className: 'badge' };
  const percentComplete = progress && progress.totalPages > 0
    ? Math.round((progress.currentPage / progress.totalPages) * 100)
    : 0;

  return (
    <Link href={`/treinamentos/${training.slug}`} className="block group">
      <motion.div
        className="card-training flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 bg-[#0F0D18] hover:border-ganley-purple/50 transition-all duration-300"
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Cover Aspect Ratio container (standard vertical poster 3:4 or 2:3) */}
        <div className="relative w-full aspect-[2/3] bg-ganley-black-surface overflow-hidden">
          {/* Cover image via authenticated API */}
          <img
            src={`/api/cover/${training.slug}`}
            alt={training.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Atmospheric gradient overlay at bottom of cover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D18] via-transparent to-transparent opacity-90" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className={`badge ${levelInfo.className} shadow-lg backdrop-blur-md`}>
              {levelInfo.label}
            </span>
            {training.weeklyFrequency && (
              <span className="badge bg-black/70 text-white/90 border border-white/10 shadow-lg backdrop-blur-md">
                {training.weeklyFrequency}x / sem
              </span>
            )}
          </div>

          {/* Progress Bar (if in progress) */}
          {progress && progress.totalPages > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-ganley-orange via-ganley-magenta to-ganley-purple transition-all duration-300"
                style={{ width: `${progress.completed ? 100 : percentComplete}%` }}
              />
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <h3 className="font-space font-bold text-white text-base line-clamp-2 group-hover:text-ganley-purple-light transition-colors duration-200">
              {training.title}
            </h3>
            <p className="text-ganley-gray text-xs line-clamp-2 mt-1.5 leading-relaxed font-sans">
              {training.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-ganley-gray">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-ganley-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {training.pdfFiles.length} {training.pdfFiles.length === 1 ? 'PDF de Treino' : 'Documentos'}
            </span>

            {progress?.completed ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
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
              <span className="text-white/60 group-hover:text-white transition-colors flex items-center gap-1">
                Acessar
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

