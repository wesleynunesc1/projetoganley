'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrainingCard from '@/components/TrainingCard';
import { TRAININGS_CATALOG } from '@/lib/catalog';
import { Training } from '@/types';

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

  // Filtered trainings calculation
  const filteredTrainings = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TRAININGS_CATALOG.filter((t) => {
      if (!t.published) return false;

      // Filter by Level
      if (selectedLevel && t.level !== selectedLevel) return false;

      // Filter by Category
      if (selectedCategory && !t.category.includes(selectedCategory as any)) return false;

      // Filter by Frequency
      if (selectedFrequency && t.weeklyFrequency !== selectedFrequency) return false;

      // Filter by Search Query
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
    <div className="min-h-screen bg-ganley-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="text-xs uppercase font-semibold text-ganley-purple-light tracking-wider">
              Catálogo Completo
            </span>
          </div>
          <h1 className="font-space font-black text-3xl sm:text-4xl text-white">
            Biblioteca de Treinamentos
          </h1>
          <p className="text-ganley-gray text-sm sm:text-base mt-2 max-w-xl">
            Explore todos os programas, filtre por nível ou divisão e acesse instantaneamente cada protocolo de treino.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#0F0D18] border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 space-y-4 shadow-xl">
          {/* Search Input */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ganley-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, atleta, divisão (ex: Ramon Dino, PPL, Feminino, Upper)..."
              className="w-full bg-ganley-black-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-ganley-gray focus:border-ganley-purple outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            {/* Level selector */}
            <span className="text-xs text-ganley-gray-dark uppercase font-semibold mr-1">
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedLevel === lvl.id
                    ? 'bg-ganley-purple text-white shadow-md shadow-ganley-purple/30'
                    : 'bg-white/5 text-ganley-gray hover:text-white hover:bg-white/10'
                }`}
              >
                {lvl.label}
              </button>
            ))}

            <div className="hidden sm:block h-4 w-[1px] bg-white/10 mx-2" />

            {/* Split / Category */}
            <span className="text-xs text-ganley-gray-dark uppercase font-semibold mr-1">
              Divisão:
            </span>
            {[
              { id: '', label: 'Todas' },
              { id: 'ppl', label: 'PPL' },
              { id: 'upper-lower', label: 'Upper/Lower' },
              { id: 'abcd', label: 'ABCD' },
              { id: 'abcde', label: 'ABCDE' },
              { id: 'abcdef', label: 'ABCDEF' },
              { id: 'feminino', label: 'Feminino' },
              { id: 'iniciantes', label: 'Iniciantes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-ganley-magenta text-white shadow-md shadow-ganley-magenta/30'
                    : 'bg-white/5 text-ganley-gray hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* Clear button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-ganley-gray hover:text-white underline underline-offset-4"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-ganley-gray">
            Exibindo <span className="text-white font-bold">{filteredTrainings.length}</span> treinamentos
            {hasActiveFilters && ' com os filtros selecionados'}
          </p>
        </div>

        {/* Training Cards Grid */}
        {filteredTrainings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredTrainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-ganley-black-card rounded-2xl border border-white/5 p-8">
            <svg
              className="w-12 h-12 text-ganley-gray-dark mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-semibold text-base">Nenhum treinamento encontrado</p>
            <p className="text-ganley-gray text-xs mt-1">
              Tente ajustar os filtros ou pesquisar por outro termo.
            </p>
            <button
              onClick={clearFilters}
              className="btn-ghost text-xs px-4 py-2 mt-4"
            >
              Limpar busca
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
    <Suspense fallback={<div className="min-h-screen bg-ganley-black" />}>
      <TreinamentosContent />
    </Suspense>
  );
}
