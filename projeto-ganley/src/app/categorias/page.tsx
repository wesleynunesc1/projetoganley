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
  gradient: string;
  count: number;
}

export default function CategoriasPage() {
  const categories: CategoryItem[] = [
    {
      id: 'recomendacoes',
      title: 'Recomendações Gerais',
      subtitle: 'Fundamentos e Diretrizes',
      description: 'Princípios essenciais de treinamento, execução, aquecimento e segurança.',
      tag: 'Base',
      gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('recomendacoes')).length,
    },
    {
      id: 'iniciantes',
      title: 'Iniciantes',
      subtitle: 'Adaptação e Frequência Inicial',
      description: 'Programas de 2x e 4x na semana com progressão segura para quem está começando.',
      tag: 'Nível 1',
      gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('iniciantes')).length,
    },
    {
      id: 'upper-lower',
      title: 'Upper / Lower',
      subtitle: 'Divisão Superior e Inferior',
      description: 'Excelente equilíbrio entre estímulo muscular e descanso semanal.',
      tag: 'Divisão',
      gradient: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('upper-lower')).length,
    },
    {
      id: 'ppl',
      title: 'Metodologia PPL',
      subtitle: 'Push / Pull / Legs',
      description: 'Divisão em empurrar, puxar e membros inferiores em 3x ou 6x semanais.',
      tag: 'Divisão',
      gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('ppl')).length,
    },
    {
      id: 'abcd',
      title: 'Divisões ABCD',
      subtitle: 'Intermediários e Avançados',
      description: 'Quatro sessões de treino com isolamento de grupos e volume específico.',
      tag: 'Volume',
      gradient: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('abcd')).length,
    },
    {
      id: 'abcde',
      title: 'Divisões ABCDE',
      subtitle: 'Ênfase em Superiores ou Inferiores',
      description: 'Cinco dias de treino direcionados para pontos fracos e máxima hipertrofia.',
      tag: 'Ênfase',
      gradient: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('abcde')).length,
    },
    {
      id: 'abcdef',
      title: 'Divisões ABCDEF',
      subtitle: 'Super Avançados & Pro',
      description: 'Volume extremo e máxima dedicação em seis sessões semanais intensas.',
      tag: 'Avançado',
      gradient: 'from-purple-600/20 to-indigo-600/20 border-purple-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('abcdef')).length,
    },
    {
      id: 'feminino',
      title: 'Treinamentos Femininos',
      subtitle: 'Proporção, Glúteos e Coxas',
      description: 'Divisões estruturadas especialmente para objetivos femininos de 2x a 4x na semana.',
      tag: 'Feminino',
      gradient: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('feminino')).length,
    },
    {
      id: 'especiais',
      title: 'Protocolos Olympia',
      subtitle: 'Ramon Dino, Derek, Ali Bilal, Zanca',
      description: 'Rotinas inspiradas em atletas de elite do fisiculturismo mundial.',
      tag: 'Elite',
      gradient: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
      count: TRAININGS_CATALOG.filter((t) => t.category.includes('especiais')).length,
    },
  ];

  return (
    <div className="min-h-screen bg-ganley-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="text-xs uppercase font-semibold text-ganley-purple-light tracking-wider">
              Navegação Estruturada
            </span>
          </div>
          <h1 className="font-space font-black text-3xl sm:text-4xl text-white">
            Categorias de Treinamento
          </h1>
          <p className="text-ganley-gray text-sm sm:text-base mt-2 max-w-xl">
            Escolha sua linha de evolução física de acordo com sua frequência semanal, nível e metodologia preferida.
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
              <div
                className={`relative rounded-2xl overflow-hidden p-6 border bg-gradient-to-br ${cat.gradient} bg-[#0F0D18] hover:scale-[1.02] transition-all duration-300 shadow-xl flex flex-col justify-between h-full min-h-[200px]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge bg-white/10 text-white border-white/10 text-[11px] font-semibold">
                      {cat.tag}
                    </span>
                    <span className="text-xs text-ganley-gray font-medium">
                      {cat.count} {cat.count === 1 ? 'treinamento' : 'treinamentos'}
                    </span>
                  </div>

                  <h2 className="font-space font-bold text-xl text-white group-hover:text-ganley-purple-light transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-xs text-ganley-orange-light font-medium mt-0.5">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-ganley-gray mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/70 group-hover:text-white transition-colors">
                  <span>Acessar categoria</span>
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
