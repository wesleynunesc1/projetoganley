import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ganley-black-secondary/60 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-space font-black text-lg tracking-tight">
            <span className="text-gradient">PROJETO</span>
            <span className="text-white ml-1">GANLEY</span>
          </span>
          <p className="text-xs text-ganley-gray mt-1">
            Plataforma exclusiva de treinamentos e evolução física.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-ganley-gray">
          <Link href="/inicio" className="hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/treinamentos" className="hover:text-white transition-colors">
            Biblioteca
          </Link>
          <Link href="/categorias" className="hover:text-white transition-colors">
            Categorias
          </Link>
          <Link href="/minha-evolucao" className="hover:text-white transition-colors">
            Minha Evolução
          </Link>
        </div>

        <div className="text-xs text-ganley-gray-dark">
          © {new Date().getFullYear()} Projeto Ganley. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
