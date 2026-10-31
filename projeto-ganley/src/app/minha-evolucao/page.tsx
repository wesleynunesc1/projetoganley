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
        const res = await fetch('/api/progress');
        if (res.ok) {
          const data = await res.json();
          setProgressList(data.progress || []);
        }

        const lastRes = await fetch('/api/progress?type=last');
        if (lastRes.ok) {
          const lastData = await lastRes.json();
          setLastAccessed(lastData.last || null);
        }
      } catch (err) {
        console.error('Error fetching user evolution:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  const progressMap = new Map<string, UserProgress>();
  progressList.forEach((p) => {
    progressMap.set(p.trainingId, p);
  });

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

  const lastTraining = lastAccessed
    ? TRAININGS_CATALOG.find((t) => t.id === lastAccessed.trainingId)
    : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Editorial Greeting Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-sans font-semibold tracking-wider text-ganley-gray-light uppercase">
              Painel do Atleta
            </span>
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Minha Evolução
          </h1>
          <p className="text-ganley-gray text-sm sm:text-base mt-2.5 max-w-2xl font-normal leading-relaxed">
            Acompanhe o andamento dos seus treinamentos, continue sua leitura e organize suas rotinas preferidas em um só lugar.
          </p>
        </div>

        {/* Minimalist Overview Metrics Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
          {/* Overall Progress */}
          <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.07] p-6 shadow-xl flex flex-col justify-between">
            <span className="text-xs font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Biblioteca
            </span>
            <div className="mt-4">
              <span className="font-space font-black text-3xl sm:text-4xl text-gradient-accent">
                {percentCompleted}%
              </span>
              <p className="text-xs text-ganley-gray-dark font-sans mt-1">Conclusão geral</p>
            </div>
            <div className="w-full h-1 bg-white/[0.08] rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ganley-orange via-ganley-magenta to-ganley-purple transition-all duration-500 rounded-full"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          </div>

          {/* In progress */}
          <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.07] p-6 shadow-xl flex flex-col justify-between">
            <span className="text-xs font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Em Andamento
            </span>
            <div className="mt-4">
              <span className="font-space font-black text-3xl sm:text-4xl text-white">
                {startedTrainings.length}
              </span>
              <p className="text-xs text-ganley-gray-dark font-sans mt-1">Treinos iniciados</p>
            </div>
            <p className="text-[11px] text-ganley-orange mt-4 font-medium">Progresso salvo</p>
          </div>

          {/* Completed */}
          <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.07] p-6 shadow-xl flex flex-col justify-between">
            <span className="text-xs font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Finalizados
            </span>
            <div className="mt-4">
              <span className="font-space font-black text-3xl sm:text-4xl text-emerald-400">
                {completedCount}
              </span>
              <p className="text-xs text-ganley-gray-dark font-sans mt-1">de {totalModules} programas</p>
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-4 font-medium">Metas atingidas</p>
          </div>

          {/* Favorites */}
          <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.07] p-6 shadow-xl flex flex-col justify-between">
            <span className="text-xs font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Favoritos
            </span>
            <div className="mt-4">
              <span className="font-space font-black text-3xl sm:text-4xl text-ganley-magenta">
                {favoritedTrainings.length}
              </span>
              <p className="text-xs text-ganley-gray-dark font-sans mt-1">Programas salvos</p>
            </div>
            <p className="text-[11px] text-ganley-magenta/80 mt-4 font-medium">Acesso imediato</p>
          </div>
        </div>

        {/* Featured "Continue Reading" Block */}
        {lastTraining && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-ganley-surface-2 via-[#0C0A12] to-black border border-ganley-purple/30 p-6 sm:p-8 mb-14 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 sm:w-20 aspect-[2/3] rounded-2xl overflow-hidden border border-white/[0.1] bg-black flex-shrink-0 shadow-xl">
                  <img
                    src={`/api/cover/${lastTraining.slug}`}
                    alt={lastTraining.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-sans font-semibold text-ganley-orange uppercase tracking-wider">
                    Continuar leitura
                  </span>
                  <h3 className="font-sans font-bold text-white text-lg sm:text-2xl mt-1 tracking-tight">
                    {lastTraining.title}
                  </h3>
                  <p className="text-xs text-ganley-gray mt-1 font-sans">
                    Última página acessada: <strong className="text-white">Página {lastAccessed?.currentPage || 1}</strong>
                  </p>
                </div>
              </div>

              <Link
                href={`/treinamentos/${lastTraining.slug}`}
                className="btn-accent text-xs sm:text-sm px-7 py-3.5 w-full sm:w-auto text-center"
              >
                Abrir agora →
              </Link>
            </div>
          </div>
        )}

        {/* Favorited Trainings Grid */}
        {favoritedTrainings.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2.5 mb-5">
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">
                Favoritos
              </h2>
              <span className="text-xs font-sans font-semibold text-ganley-magenta px-2.5 py-0.5 rounded-full bg-ganley-magenta/10 border border-ganley-magenta/20">
                {favoritedTrainings.length}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {favoritedTrainings.map(({ training, progress }) => (
                <TrainingCard key={training.id} training={training} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* In Progress Grid */}
        {startedTrainings.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2.5 mb-5">
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">
                Em Andamento
              </h2>
              <span className="text-xs font-sans font-semibold text-ganley-orange px-2.5 py-0.5 rounded-full bg-ganley-orange/10 border border-ganley-orange/20">
                {startedTrainings.length}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {startedTrainings.map(({ training, progress }) => (
                <TrainingCard key={training.id} training={training} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Grid */}
        {completedTrainings.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2.5 mb-5">
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">
                Concluídos
              </h2>
              <span className="text-xs font-sans font-semibold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {completedTrainings.length}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {completedTrainings.map(({ training, progress }) => (
                <TrainingCard key={training.id} training={training} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {startedTrainings.length === 0 && completedTrainings.length === 0 && favoritedTrainings.length === 0 && !loading && (
          <div className="text-center py-24 bg-[#0C0A12] rounded-3xl border border-white/[0.06] p-8 max-w-lg mx-auto shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-ganley-purple-light">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-sans font-bold text-white text-lg tracking-tight">
              Sua jornada de evolução está começando
            </h3>
            <p className="text-ganley-gray text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Explore os treinamentos da biblioteca. Seu progresso de leitura e favoritos serão salvos automaticamente aqui.
            </p>
            <Link href="/treinamentos" className="btn-accent text-xs px-7 py-3.5 mt-6 inline-block">
              Explorar Treinamentos
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
