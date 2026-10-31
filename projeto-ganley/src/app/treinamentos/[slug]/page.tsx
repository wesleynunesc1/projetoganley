'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PDFViewer from '@/components/PDFViewer';
import { Training, UserProgress } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TrainingViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPdfIndex, setSelectedPdfIndex] = useState<number>(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [allTrainings, setAllTrainings] = useState<Training[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/trainings?slug=${resolvedParams.slug}`);
        if (!res.ok) {
          router.push('/treinamentos');
          return;
        }
        const data = await res.json();
        setTraining(data.training);

        const catRes = await fetch('/api/trainings');
        if (catRes.ok) {
          const catData = await catRes.json();
          setAllTrainings(catData.trainings || []);
        }

        if (data.training?.id) {
          const progRes = await fetch(`/api/progress?trainingId=${data.training.id}`);
          if (progRes.ok) {
            const progData = await progRes.json();
            if (progData.progress) {
              setProgress(progData.progress);
              setIsFavorited(Boolean(progData.progress.favorited));
              setIsCompleted(Boolean(progData.progress.completed));
            }
          }
        }
      } catch (err) {
        console.error('Error loading training page:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.slug, router]);

  const handlePageChange = async (currentPage: number, totalPages: number) => {
    if (!training) return;
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingId: training.id,
          currentPage,
          totalPages,
          completed: isCompleted,
          favorited: isFavorited,
        }),
      });
    } catch {
      // ignore sync issues
    }
  };

  const toggleFavorite = async () => {
    if (!training) return;
    const newState = !isFavorited;
    setIsFavorited(newState);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingId: training.id,
          favorited: newState,
        }),
      });
    } catch {
      setIsFavorited(!newState);
    }
  };

  const toggleCompleted = async () => {
    if (!training) return;
    const newState = !isCompleted;
    setIsCompleted(newState);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingId: training.id,
          completed: newState,
        }),
      });
    } catch {
      setIsCompleted(!newState);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-2 border-ganley-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-ganley-gray text-sm font-sans">Carregando programa...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!training) return null;

  const currentIndex = allTrainings.findIndex((t) => t.slug === training.slug);
  const nextTraining = currentIndex >= 0 && currentIndex < allTrainings.length - 1
    ? allTrainings[currentIndex + 1]
    : allTrainings[0] || null;

  const currentPdfUrl = `/api/pdf/${training.slug}?file=${selectedPdfIndex}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs font-sans text-ganley-gray mb-6 flex-wrap">
          <Link href="/inicio" className="hover:text-white transition-colors">
            Início
          </Link>
          <span className="text-white/20">/</span>
          <Link href="/treinamentos" className="hover:text-white transition-colors">
            Treinamentos
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-medium line-clamp-1">{training.title}</span>
        </div>

        {/* Training Header Card */}
        <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.08] p-5 sm:p-7 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Left Info with Original Cover Thumbnail */}
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-2xl overflow-hidden border border-white/[0.08] flex-shrink-0 bg-black shadow-xl">
                <img
                  src={`/api/cover/${training.slug}`}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="badge-pill badge-pill-special text-[11px] font-sans uppercase">
                    {training.level}
                  </span>
                  {training.weeklyFrequency && (
                    <span className="badge-pill bg-white/[0.04] text-white/80 border-white/[0.08] text-[11px]">
                      {training.weeklyFrequency}x na semana
                    </span>
                  )}
                  {isCompleted && (
                    <span className="badge-pill bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] flex items-center gap-1 font-semibold">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Concluído
                    </span>
                  )}
                </div>

                <h1 className="font-sans font-extrabold text-xl sm:text-3xl text-white tracking-tight">
                  {training.title}
                </h1>

                <p className="text-ganley-gray text-xs sm:text-sm mt-2 max-w-2xl font-normal leading-relaxed">
                  {training.description}
                </p>
              </div>
            </div>

            {/* Right Interactive Actions */}
            <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Favorite */}
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all border ${
                    isFavorited
                      ? 'bg-ganley-magenta/20 text-ganley-magenta border-ganley-magenta/40'
                      : 'bg-white/[0.04] text-ganley-gray hover:text-white border-white/[0.08]'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}
                    fill={isFavorited ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorited ? 'Salvo nos Favoritos' : 'Favoritar'}
                </button>

                {/* Mark as Completed */}
                <button
                  onClick={toggleCompleted}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-white/[0.04] text-ganley-gray hover:text-white border-white/[0.08]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isCompleted ? 'Módulo Concluído' : 'Concluir'}
                </button>
              </div>

              {nextTraining && (
                <Link
                  href={`/treinamentos/${nextTraining.slug}`}
                  className="text-xs font-sans text-ganley-gray hover:text-ganley-purple-light transition-colors flex items-center gap-1 mt-1"
                >
                  Próximo: {nextTraining.title.split('—')[0]} →
                </Link>
              )}
            </div>
          </div>

          {/* Multiple Files Selector (Tabs) */}
          {training.pdfFiles.length > 1 && (
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-sans font-semibold text-ganley-gray uppercase tracking-wider mr-2">
                Documentos:
              </span>
              {training.pdfFiles.map((file, idx) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedPdfIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedPdfIndex === idx
                      ? 'bg-ganley-purple text-white shadow-lg shadow-ganley-purple/30'
                      : 'bg-white/[0.04] text-ganley-gray hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {file.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Integrated Auto-Loading PDF Viewer (Full Width Focus) */}
        <section aria-label="Visualizador Integrado">
          <PDFViewer
            key={currentPdfUrl}
            pdfUrl={currentPdfUrl}
            trainingSlug={training.slug}
            trainingId={training.id}
            initialPage={progress?.currentPage || 1}
            onPageChange={handlePageChange}
          />
        </section>

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/treinamentos"
            className="btn-glass text-xs px-6 py-3 w-full sm:w-auto text-center"
          >
            ← Voltar para a Biblioteca
          </Link>

          {nextTraining && (
            <Link
              href={`/treinamentos/${nextTraining.slug}`}
              className="btn-accent text-xs px-7 py-3 w-full sm:w-auto text-center"
            >
              Avançar para o Próximo Treinamento →
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
