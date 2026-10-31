'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrainingCard from '@/components/TrainingCard';
import { TRAININGS_CATALOG } from '@/lib/catalog';

function TreinamentosContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLevel = searchParams.get('level') || '';

  const [search, setSearch] = useState(initialQ);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);

  useEffect(() => {
    if (initialQ) setSearch(initialQ);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialLevel) setSelectedLevel(initialLevel);
  }, [initialQ, initialCategory, initialLevel]);

  const filteredTrainings = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TRAININGS_CATALOG.filter((t) => {
      if (!t.published) return false;

      if (selectedLevel && t.level !== selectedLevel) return false;
      if (selectedCategory && !t.category.includes(selectedCategory as any)) return false;
      if (selectedFrequency && t.weeklyFrequency !== selectedFrequency) return false;

      if (q) {
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchCat = t.category.some((c) => c.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchTags || matchCat;
      }

      return true;
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [search, selectedLevel, selectedCategory, selectedFrequency]);

  const clearFilters = () => {
    setSearch('');
    setSelectedLevel('');
    setSelectedCategory('');
    setSelectedFrequency(null);
  };

  const hasActiveFilters = Boolean(search || selectedLevel || selectedCategory || selectedFrequency);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-md">
            <span className="text-[10px] font-sans font-semibold tracking-wider text-ganley-purple-light uppercase">
              Biblioteca Exclusiva
            </span>
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Programas de Treinamento
          </h1>
          <p className="text-ganley-gray text-sm sm:text-base mt-3 max-w-2xl font-normal leading-relaxed">
            Selecione seu programa por divisão, nível de experiência ou frequência semanal. Todos os módulos possuem visualização imediata do PDF original.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.08] p-5 sm:p-6 mb-10 shadow-2xl space-y-5">
          {/* Search Field */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ganley-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, divisão ou atleta (ex: Ramon Dino, PPL, Upper/Lower, Feminino)..."
              className="w-full bg-[#15101E]/70 border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-ganley-gray/60 outline-none focus:border-ganley-purple/80 transition-all font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ganley-gray hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Chips Filter Rows */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            {/* Level Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ganley-gray-dark uppercase font-semibold mr-1 font-sans">
                Nível:
              </span>
              {[
                { id: '', label: 'Todos' },
                { id: 'beginner', label: 'Iniciante' },
                { id: 'intermediate', label: 'Intermediário' },
                { id: 'advanced', label: 'Avançado' },
                { id: 'special', label: 'Pro / Olympia' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-tight transition-all ${
                    selectedLevel === lvl.id
                      ? 'bg-ganley-purple text-white font-semibold shadow-lg shadow-ganley-purple/30'
                      : 'bg-white/[0.04] text-ganley-gray hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Split / Division Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ganley-gray-dark uppercase font-semibold mr-1 font-sans">
                Divisão:
              </span>
              {[
                { id: '', label: 'Todas' },
                { id: 'ppl', label: 'PPL' },
                { id: 'upper-lower', label: 'Upper / Lower' },
                { id: 'abcd', label: 'ABCD' },
                { id: 'abcde', label: 'ABCDE' },
                { id: 'abcdef', label: 'ABCDEF' },
                { id: 'feminino', label: 'Feminino' },
                { id: 'iniciantes', label: 'Iniciantes' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-tight transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-ganley-magenta text-white font-semibold shadow-lg shadow-ganley-magenta/30'
                      : 'bg-white/[0.04] text-ganley-gray hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              {/* Clear button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs font-sans text-ganley-gray-light hover:text-white underline underline-offset-4"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-ganley-gray font-sans">
            Exibindo <span className="text-white font-bold">{filteredTrainings.length}</span> programas
            {hasActiveFilters && ' encontrados'}
          </p>
        </div>

        {/* Streaming Grid */}
        {filteredTrainings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredTrainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0C0A12] rounded-3xl border border-white/[0.06] p-8 max-w-lg mx-auto shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-ganley-gray">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="font-sans font-bold text-white text-base">Nenhum programa encontrado</h3>
            <p className="text-ganley-gray text-xs mt-1.5 leading-relaxed">
              Tente redefinir os filtros aplicados ou pesquisar por outro termo.
            </p>
            <button
              onClick={clearFilters}
              className="btn-glass text-xs px-5 py-2.5 mt-5"
            >
              Ver todos os programas
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TreinamentosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <TreinamentosContent />
    </Suspense>
  );
}
