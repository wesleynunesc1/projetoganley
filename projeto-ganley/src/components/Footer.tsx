import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07050A] py-14 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="font-sans font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
            <span className="text-gradient-accent">PROJETO</span>
            <span>GANLEY</span>
          </span>
          <p className="text-xs text-ganley-gray mt-1.5 max-w-sm leading-relaxed font-sans font-normal">
            Plataforma exclusiva de programas de treinamento físico de alto rendimento.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-sans text-ganley-gray">
          <Link href="/inicio" className="hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/treinamentos" className="hover:text-white transition-colors">
            Treinamentos
          </Link>
          <Link href="/categorias" className="hover:text-white transition-colors">
            Categorias
          </Link>
          <Link href="/minha-evolucao" className="hover:text-white transition-colors">
            Minha Evolução
          </Link>
        </nav>

        <div className="text-[11px] font-sans text-ganley-gray-dark border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
          © {new Date().getFullYear()} PROJETO GANLEY. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
