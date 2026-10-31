'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrainingCard from '@/components/TrainingCard';
import { TRAININGS_CATALOG } from '@/lib/catalog';
import { Training, UserProgress } from '@/types';

export default function MinhaEvolucaoPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [progressList, setProgressList] = useState<UserProgress[]>([]);
  const [lastAccessed, setLastAccessed] = useState<UserProgress | null>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        // Fetch all progress records for current session
        const res = await fetch('/api/progress');
        if (res.ok) {
          const data = await res.json();
          setProgressList(data.progress || []);
        }

        // Fetch last accessed
        const lastRes = await fetch('/api/progress?type=last');
        if (lastRes.ok) {
          const lastData = await lastRes.json();
          setLastAccessed(lastData.last || null);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  // Map progress to trainings
  const progressMap = new Map<string, UserProgress>();
  progressList.forEach((p) => {
    progressMap.set(p.trainingId, p);
  });

  // Filter trainings
  const startedTrainings: { training: Training; progress: UserProgress }[] = [];
  const completedTrainings: { training: Training; progress: UserProgress }[] = [];
  const favoritedTrainings: { training: Training; progress: UserProgress }[] = [];

  TRAININGS_CATALOG.forEach((training) => {
    const prog = progressMap.get(training.id);
    if (prog) {
      if (prog.completed) {
        completedTrainings.push({ training, progress: prog });
      } else if (prog.currentPage > 1) {
        startedTrainings.push({ training, progress: prog });
      }

      if (prog.favorited) {
        favoritedTrainings.push({ training, progress: prog });
      }
    }
  });

  const totalModules = TRAININGS_CATALOG.length;
  const completedCount = completedTrainings.length;
  const percentCompleted = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Last training detail
  const lastTraining = lastAccessed
    ? TRAININGS_CATALOG.find((t) => t.id === lastAccessed.trainingId)
    : null;

  return (
    <div className="min-h-screen bg-ganley-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="text-xs uppercase font-semibold text-ganley-purple-light tracking-wider">
              Painel do Membro
            </span>
          </div>
          <h1 className="font-space font-black text-3xl sm:text-4xl text-white">
            Minha Evolução
          </h1>
          <p className="text-ganley-gray text-sm sm:text-base mt-2 max-w-xl">
            Acompanhe seu progresso de leitura, continue exatamente de onde parou e organize seus treinamentos favoritos.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0F0D18] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-xs text-ganley-gray font-medium uppercase tracking-wider">
              Progresso Geral
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-space font-black text-3xl text-gradient">{percentCompleted}%</span>
              <span className="text-xs text-ganley-gray-dark">concluído</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ganley-orange via-ganley-magenta to-ganley-purple rounded-full transition-all duration-500"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0F0D18] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-xs text-ganley-gray font-medium uppercase tracking-wider">
              Em Andamento
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-space font-black text-3xl text-white">
                {startedTrainings.length}
              </span>
              <span className="text-xs text-ganley-gray-dark">módulos</span>
            </div>
            <p className="text-[11px] text-ganley-gray mt-2">Treinos iniciados</p>
          </div>

          <div className="bg-[#0F0D18] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-xs text-ganley-gray font-medium uppercase tracking-wider">
              Concluídos
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-space font-black text-3xl text-emerald-400">
                {completedCount}
              </span>
              <span className="text-xs text-ganley-gray-dark">de {totalModules}</span>
            </div>
            <p className="text-[11px] text-ganley-gray mt-2">Programas finalizados</p>
          </div>

          <div className="bg-[#0F0D18] border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-xs text-ganley-gray font-medium uppercase tracking-wider">
              Favoritos
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-space font-black text-3xl text-ganley-magenta">
                {favoritedTrainings.length}
              </span>
              <span className="text-xs text-ganley-gray-dark">salvos</span>
            </div>
            <p className="text-[11px] text-ganley-gray mt-2">Para acesso rápido</p>
          </div>
        </div>

        {/* Continue Reading Featured Card */}
        {lastTraining && (
          <div className="relative rounded-2xl overflow-hidden border border-ganley-purple/30 bg-gradient-to-r from-ganley-purple/10 via-[#0F0D18] to-transparent p-6 mb-12 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black">
                  <img
                    src={`/api/cover/${lastTraining.slug}`}
                    alt={lastTraining.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-ganley-orange tracking-wider">
                    Continuar leitura
                  </span>
                  <h3 className="font-space font-bold text-white text-lg sm:text-xl mt-0.5">
                    {lastTraining.title}
                  </h3>
                  <p className="text-xs text-ganley-gray mt-1">
                    Parou na página {lastAccessed?.currentPage || 1}
                  </p>
                </div>
              </div>

              <Link
                href={`/treinamentos/${lastTraining.slug}`}
                className="btn-primary text-xs px-6 py-3 w-full sm:w-auto text-center"
              >
                Continuar agora →
              </Link>
            </div>
          </div>
        )}

        {/* Favorited Trainings Section */}
        {favoritedTrainings.length > 0 && (
          <section className="mb-12">
            <h2 className="section-heading mb-4 flex items-center gap-2">
              <span>Favoritos</span>
              <span className="text-xs font-normal text-ganley-magenta px-2 py-0.5 rounded-full bg-ganley-magenta/10 border border-ganley-magenta/20">
                {favoritedTrainings.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {favoritedTrainings.map(({ training, progress }) => (
                <TrainingCard key={training.id} training={training} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* In Progress Section */}
        {startedTrainings.length > 0 && (
          <section className="mb-12">
            <h2 className="section-heading mb-4 flex items-center gap-2">
              <span>Em Andamento</span>
              <span className="text-xs font-normal text-ganley-orange px-2 py-0.5 rounded-full bg-ganley-orange/10 border border-ganley-orange/20">
                {startedTrainings.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {startedTrainings.map(({ training, progress }) => (
                <TrainingCard key={training.id} training={training} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Section */}
        {completedTrainings.length > 0 && (
          <section className="mb-12">
            <h2 className="section-heading mb-4 flex items-center gap-2">
              <span>Treinamentos Concluídos</span>
              <span className="text-xs font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {completedTrainings.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {completedTrainings.map(({ training, progress }) => (
                <TrainingCard key={training.id} training={training} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State if user hasn't opened anything yet */}
        {startedTrainings.length === 0 && completedTrainings.length === 0 && favoritedTrainings.length === 0 && !loading && (
          <div className="text-center py-20 bg-[#0F0D18] rounded-2xl border border-white/5 p-8 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-ganley-purple/10 border border-ganley-purple/20 flex items-center justify-center mx-auto mb-4 text-ganley-purple-light">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-space font-bold text-white text-lg">
              Sua jornada de evolução está começando
            </h3>
            <p className="text-ganley-gray text-xs sm:text-sm mt-2 leading-relaxed">
              Ao abrir os treinamentos na biblioteca, seu progresso de leitura e páginas serão salvos automaticamente aqui.
            </p>
            <Link href="/treinamentos" className="btn-primary text-xs px-6 py-3 mt-6 inline-block">
              Explorar Treinamentos
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

