import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrainingCarousel from '@/components/TrainingCarousel';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  TRAININGS_CATALOG,
  getFeaturedTrainings,
  getTrainingsByCategory,
} from '@/lib/catalog';

export default function HomePage() {
  const featured = getFeaturedTrainings();

  // Categorized collections
  const beginners = TRAININGS_CATALOG.filter(
    (t) => t.category.includes('iniciantes') || t.category.includes('recomendacoes')
  );

  const intermediates = TRAININGS_CATALOG.filter(
    (t) => t.level === 'intermediate'
  );

  const advanced = TRAININGS_CATALOG.filter(
    (t) => t.level === 'advanced'
  );

  const proOlympia = TRAININGS_CATALOG.filter(
    (t) => t.category.includes('especiais') || t.slug.includes('olympia') || t.slug.includes('zanca')
  );

  const splitsClassic = TRAININGS_CATALOG.filter(
    (t) => t.category.includes('abcd') || t.category.includes('abcde') || t.category.includes('abcdef')
  );

  const ppl = getTrainingsByCategory('ppl');
  const female = getTrainingsByCategory('feminino');
  const upperLower = getTrainingsByCategory('upper-lower');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-ganley-purple selection:text-white">
      <Header />

      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero featuredTrainings={featured} />

        {/* Streaming Sections */}
        <div className="space-y-4 sm:space-y-6 pb-20">
          {/* Comece por Aqui */}
          <TrainingCarousel
            title="Comece por aqui"
            subtitle="Diretrizes fundamentais, adaptação neuromuscular e rotinas iniciais"
            trainings={beginners}
            viewAllHref="/treinamentos?category=iniciantes"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Destaques Principais */}
          <TrainingCarousel
            title="Destaques da Plataforma"
            subtitle="Os protocolos de treinamento mais requisitados da biblioteca"
            trainings={featured}
            viewAllHref="/treinamentos"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Protocolos Especiais & Nível Olympia */}
          <TrainingCarousel
            title="Protocolos Especiais & Nível Olympia"
            subtitle="Metodologias de elite inspiradas nos maiores palcos do fisiculturismo mundial"
            trainings={proOlympia}
            viewAllHref="/treinamentos?category=especiais"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Metodologia PPL (Push / Pull / Legs) */}
          <TrainingCarousel
            title="Metodologia PPL (Push / Pull / Legs)"
            subtitle="Divisões eficientes de empurrar, puxar e pernas para máxima recuperação"
            trainings={ppl}
            viewAllHref="/treinamentos?category=ppl"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Treinamentos Femininos */}
          <TrainingCarousel
            title="Treinamentos Femininos"
            subtitle="Periodizações específicas com ênfase em inferiores, glúteos e definição"
            trainings={female}
            viewAllHref="/treinamentos?category=feminino"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Divisões Upper / Lower */}
          <TrainingCarousel
            title="Divisões Upper / Lower"
            subtitle="Equilíbrio estruturado entre membros superiores e inferiores"
            trainings={upperLower}
            viewAllHref="/treinamentos?category=upper-lower"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Divisões ABCD e ABCDE */}
          <TrainingCarousel
            title="Divisões ABCD, ABCDE & ABCDEF"
            subtitle="Isolamento de grupos musculares, ênfases estratégicas e alto volume"
            trainings={splitsClassic}
            viewAllHref="/treinamentos"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Treinamentos Intermediários */}
          <TrainingCarousel
            title="Treinamentos Intermediários"
            subtitle="Para praticantes com experiência prévia buscando quebra de platô"
            trainings={intermediates}
            viewAllHref="/treinamentos?level=intermediate"
          />

          <div className="divider-subtle max-w-7xl mx-auto px-4 sm:px-6" />

          {/* Treinamentos Avançados */}
          <TrainingCarousel
            title="Treinamentos Avançados"
            subtitle="Volume elevado e técnicas de intensidade para atletas experientes"
            trainings={advanced}
            viewAllHref="/treinamentos?level=advanced"
          />

          {/* CTA Banner to Full Library */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-white/[0.08] bg-gradient-to-r from-ganley-surface-2 via-ganley-surface-1 to-black text-center shadow-2xl">
              <div
                className="ambient-glow -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px]"
                style={{ background: '#9747FF', opacity: 0.2 }}
              />
              <span className="badge-pill bg-white/[0.06] text-white/90 border-white/[0.1] text-xs uppercase font-semibold mb-4">
                Catálogo Completo
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                Explore todos os 20 programas disponíveis
              </h2>
              <p className="text-ganley-gray text-sm sm:text-base max-w-xl mx-auto mt-3">
                Utilize nossa busca global e filtros avançados para selecionar o treinamento ideal para sua rotina.
              </p>
              <div className="mt-8">
                <Link href="/treinamentos" className="btn-accent px-8 py-4 text-sm font-bold">
                  Acessar Biblioteca Completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
