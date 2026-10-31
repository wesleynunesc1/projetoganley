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

  // Fetch training metadata and progress
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch specific training
        const res = await fetch(`/api/trainings?slug=${resolvedParams.slug}`);
        if (!res.ok) {
          router.push('/treinamentos');
          return;
        }
        const data = await res.json();
        setTraining(data.training);

        // Fetch catalog to find next training
        const catRes = await fetch('/api/trainings');
        if (catRes.ok) {
          const catData = await catRes.json();
          setAllTrainings(catData.trainings || []);
        }

        // Fetch user progress for this training
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

  // Handle saving page change
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
    } catch (e) {
      // ignore network errors on sync
    }
  };

  // Toggle Favorite
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
    } catch (e) {
      setIsFavorited(!newState);
    }
  };

  // Toggle Completed
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
    } catch (e) {
      setIsCompleted(!newState);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ganley-black text-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-ganley-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-ganley-gray text-sm">Carregando módulo de treinamento...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!training) return null;

  // Next training in sequence
  const currentIndex = allTrainings.findIndex((t) => t.slug === training.slug);
  const nextTraining = currentIndex >= 0 && currentIndex < allTrainings.length - 1
    ? allTrainings[currentIndex + 1]
    : allTrainings[0] || null;

  const currentPdfUrl = `/api/pdf/${training.slug}?file=${selectedPdfIndex}`;

  return (
    <div className="min-h-screen bg-ganley-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-ganley-gray mb-6 flex-wrap">
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

        {/* Module Header Card */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0E0C17] p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Left: Thumbnail & Info */}
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="relative w-20 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black">
                <img
                  src={`/api/cover/${training.slug}`}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="badge badge-level-beginner text-xs uppercase font-semibold">
                    {training.level}
                  </span>
                  {training.weeklyFrequency && (
                    <span className="badge bg-white/5 text-white/80 border-white/10 text-xs">
                      {training.weeklyFrequency}x na semana
                    </span>
                  )}
                  {isCompleted && (
                    <span className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Concluído
                    </span>
                  )}
                </div>

                <h1 className="font-space font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight">
                  {training.title}
                </h1>

                <p className="text-ganley-gray text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                  {training.description}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap md:flex-col items-center sm:items-end gap-2.5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                    isFavorited
                      ? 'bg-ganley-magenta/20 text-ganley-magenta border-ganley-magenta/40'
                      : 'bg-white/5 text-ganley-gray hover:text-white border-white/10'
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
                  {isFavorited ? 'Favoritado' : 'Favoritar'}
                </button>

                {/* Mark Completed Button */}
                <button
                  onClick={toggleCompleted}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-white/5 text-ganley-gray hover:text-white border-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isCompleted ? 'Concluído' : 'Marcar Concluído'}
                </button>
              </div>

              {/* Next Training shortcut */}
              {nextTraining && (
                <Link
                  href={`/treinamentos/${nextTraining.slug}`}
                  className="text-xs text-ganley-gray hover:text-ganley-purple-light transition-colors flex items-center gap-1 mt-1"
                >
                  Próximo: {nextTraining.title.split('—')[0]} →
                </Link>
              )}
            </div>
          </div>

          {/* Multiple PDFs Switcher (if module has complementary files) */}
          {training.pdfFiles.length > 1 && (
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-ganley-gray uppercase tracking-wider mr-2">
                Arquivos:
              </span>
              {training.pdfFiles.map((file, idx) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedPdfIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedPdfIndex === idx
                      ? 'bg-ganley-purple text-white shadow-lg shadow-ganley-purple/30'
                      : 'bg-white/5 text-ganley-gray hover:text-white hover:bg-white/10'
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

        {/* ============================================================== */}
        {/* MAIN INTEGRATED PDF VIEWER (Auto-loads immediately)             */}
        {/* ============================================================== */}
        <section aria-label="Visualizador Integrado de Treinamento">
          <PDFViewer
            key={currentPdfUrl}
            pdfUrl={currentPdfUrl}
            trainingSlug={training.slug}
            trainingId={training.id}
            initialPage={progress?.currentPage || 1}
            onPageChange={handlePageChange}
          />
        </section>

        {/* Bottom Back Button */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/treinamentos"
            className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2"
          >
            ← Voltar para a Biblioteca
          </Link>

          {nextTraining && (
            <Link
              href={`/treinamentos/${nextTraining.slug}`}
              className="btn-primary text-xs px-6 py-2.5"
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
