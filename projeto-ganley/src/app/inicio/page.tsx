import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrainingCarousel from '@/components/TrainingCarousel';
import Footer from '@/components/Footer';
import {
  TRAININGS_CATALOG,
  getFeaturedTrainings,
  getTrainingsByCategory,
} from '@/lib/catalog';

export default function HomePage() {
  const featured = getFeaturedTrainings();
  const beginners = TRAININGS_CATALOG.filter(
    (t) => t.category.includes('iniciantes') || t.category.includes('recomendacoes')
  );
  const proOlympia = TRAININGS_CATALOG.filter(
    (t) => t.category.includes('especiais') || t.level === 'special' || t.slug.includes('olympia')
  );
  const splits = TRAININGS_CATALOG.filter(
    (t) => t.category.includes('abcd') || t.category.includes('abcde')
  );
  const ppl = getTrainingsByCategory('ppl');
  const female = getTrainingsByCategory('feminino');
  const upperLower = getTrainingsByCategory('upper-lower');

  return (
    <div className="min-h-screen bg-ganley-black text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero featuredTrainings={featured} />

        {/* Dynamic Categorized Carousels */}
        <div className="space-y-6 sm:space-y-8 pb-16">
          <TrainingCarousel
            title="Destaques Principais"
            subtitle="Programas de alta performance mais acessados"
            trainings={featured}
            viewAllHref="/treinamentos"
          />

          <TrainingCarousel
            title="Comece Por Aqui"
            subtitle="Fundamentos, adaptação muscular e rotinas para iniciantes"
            trainings={beginners}
            viewAllHref="/treinamentos?category=iniciantes"
          />

          <TrainingCarousel
            title="Protocolos Pro & Nível Olympia"
            subtitle="Metodologias inspiradas nos maiores atletas do mundo"
            trainings={proOlympia}
            viewAllHref="/treinamentos?level=special"
          />

          <TrainingCarousel
            title="Divisões Clássicas — ABCD & ABCDE"
            subtitle="Foco cirúrgico em cada grupamento muscular com volume controlado"
            trainings={splits}
            viewAllHref="/treinamentos"
          />

          <TrainingCarousel
            title="Metodologia PPL — Push / Pull / Legs"
            subtitle="Divisão eficiente de empurrar, puxar e pernas com alta frequência"
            trainings={ppl}
            viewAllHref="/treinamentos?category=ppl"
          />

          <TrainingCarousel
            title="Treinamentos Femininos"
            subtitle="Protocolos específicos com foco em membros inferiores, glúteos e proporção"
            trainings={female}
            viewAllHref="/treinamentos?category=feminino"
          />

          <TrainingCarousel
            title="Divisões Upper / Lower"
            subtitle="Superior e inferior com recuperação ideal para evolução constante"
            trainings={upperLower}
            viewAllHref="/treinamentos?category=upper-lower"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
