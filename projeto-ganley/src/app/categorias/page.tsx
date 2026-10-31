import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TRAININGS_CATALOG } from '@/lib/catalog';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  count: number;
}

export default function CategoriasPage() {
  const categories: CategoryItem[] = [
    {
      id: 'recomendacoes',
      title: 'Recomendações Gerais',
      subtitle: 'Fundamentos e Diretrizes',
      description: 'Princípios essenciais de treinamento, execução, aquecimento e segurança articular.',
      tag: 'Fundamento',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('recomendacoes')).length,
    },
    {
      id: 'iniciantes',
      title: 'Iniciantes & Adaptação',
      subtitle: 'Frequência de 2x a 4x Semanais',
      description: 'Programas progressivos focados em construir coordenação motora e base estrutural.',
      tag: 'Base',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('iniciantes')).length,
    },
    {
      id: 'upper-lower',
      title: 'Divisões Upper / Lower',
      subtitle: 'Membros Superiores e Inferiores',
      description: 'Estímulo equilibrado duas vezes por semana com excelente recuperação neuromuscular.',
      tag: 'Divisão',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('upper-lower')).length,
    },
    {
      id: 'ppl',
      title: 'Metodologia PPL',
      subtitle: 'Push / Pull / Legs (3x e 6x)',
      description: 'Divisão científica em empurrar, puxar e pernas com alto controle de fadiga.',
      tag: 'Metodologia',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('ppl')).length,
    },
    {
      id: 'abcd',
      title: 'Divisões ABCD',
      subtitle: 'Intermediários e Avançados',
      description: 'Quatro sessões semanais permitindo maior volume concentrado por grupo muscular.',
      tag: 'Volume',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('abcd')).length,
    },
    {
      id: 'abcde',
      title: 'Divisões ABCDE',
      subtitle: 'Ênfase em Superiores ou Inferiores',
      description: 'Cinco dias de treino direcionados para lapidação de pontos fracos e máxima hipertrofia.',
      tag: 'Ênfase',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('abcde')).length,
    },
    {
      id: 'abcdef',
      title: 'Divisões ABCDEF',
      subtitle: 'Super Avançados & Elite',
      description: 'Seis sessões de alto volume e intensidade para atletas em estágio avançado.',
      tag: 'Alta Intensidade',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('abcdef')).length,
    },
    {
      id: 'feminino',
      title: 'Treinamentos Femininos',
      subtitle: 'Periodizações Específicas',
      description: 'Rotinas estruturadas com foco em membros inferiores, glúteos e harmonia estética.',
      tag: 'Feminino',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('feminino')).length,
    },
    {
      id: 'especiais',
      title: 'Protocolos Nível Olympia',
      subtitle: 'Ramon Dino, Derek, Ali Bilal, Zanca',
      description: 'Rotinas inspiradas nos maiores atletas profissionais do fisiculturismo mundial.',
      tag: 'Pro / Elite',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('especiais')).length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-md">
            <span className="text-[10px] font-sans font-semibold tracking-wider text-ganley-purple-light uppercase">
              Organização Estruturada
            </span>
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Categorias de Treinamento
          </h1>
          <p className="text-ganley-gray text-sm sm:text-base mt-2.5 max-w-2xl font-normal leading-relaxed">
            Selecione uma das divisões metodológicas para acessar os programas correspondentes com abertura integrada.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/treinamentos?category=${cat.id}`}
              className="group block"
            >
              <div className="relative rounded-3xl overflow-hidden p-6 sm:p-7 bg-[#0C0A12] border border-white/[0.07] group-hover:border-ganley-purple/50 group-hover:shadow-ambient-purple transition-all duration-300 flex flex-col justify-between h-full min-h-[220px]">
                {/* Top Details */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="badge-pill bg-white/[0.04] text-white/80 border-white/[0.08] text-[11px] font-sans font-semibold">
                      {cat.tag}
                    </span>
                    <span className="text-xs font-sans text-ganley-gray">
                      {cat.count} {cat.count === 1 ? 'programa' : 'programas'}
                    </span>
                  </div>

                  <h2 className="font-sans font-bold text-xl text-white group-hover:text-ganley-purple-light transition-colors tracking-tight">
                    {cat.title}
                  </h2>
                  <p className="text-xs font-sans text-ganley-orange-light font-medium mt-1">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-ganley-gray mt-2.5 leading-relaxed font-sans font-normal">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Action Indicator */}
                <div className="pt-5 mt-4 border-t border-white/[0.05] flex items-center justify-between text-xs font-sans text-white/60 group-hover:text-white transition-colors">
                  <span>Explorar programas</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
