'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/inicio', label: 'Início' },
  { href: '/treinamentos', label: 'Treinamentos' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/minha-evolucao', label: 'Minha Evolução' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/acesso');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/treinamentos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/75 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-2xl'
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/inicio" className="group flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg sm:text-xl tracking-tight leading-none text-white flex items-center gap-1.5">
                <span className="text-gradient-accent">PROJETO</span>
                <span className="text-white group-hover:text-white/90 transition-colors">GANLEY</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-ganley-gray-dark font-medium mt-1">
                High Performance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/inicio' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-sans tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-ganley-gray hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.1] -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-ganley-gray hover:text-white hover:bg-white/[0.05] transition-all"
              aria-label="Abrir pesquisa"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Member Area Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <Link
                href="/minha-evolucao"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] transition-all text-xs font-sans text-white/90"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Membro</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-ganley-gray hover:text-ganley-magenta hover:bg-white/[0.05] transition-all"
                title="Sair da plataforma"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-ganley-gray hover:text-white hover:bg-white/[0.05] transition-all"
              aria-label="Abrir menu mobile"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Global Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-t border-white/[0.06] bg-[#0C0A12]/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="max-w-3xl mx-auto px-4 py-4 sm:py-5">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ganley-gray"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar treinamento, divisão, atleta (ex: Ramon Dino, PPL, Upper/Lower)..."
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-full pl-12 pr-28 py-3.5 text-sm text-white placeholder-ganley-gray outline-none focus:border-ganley-purple transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:opacity-90 transition-opacity"
                  >
                    Buscar
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed top-18 left-4 right-4 z-50 md:hidden bg-[#0F0D18]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl"
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-3 rounded-2xl text-base font-sans tracking-tight transition-all ${
                        isActive
                          ? 'bg-white/[0.08] text-white font-semibold'
                          : 'text-ganley-gray hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="h-[1px] bg-white/[0.06] my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-base text-ganley-magenta font-sans tracking-tight hover:bg-white/[0.03] transition-all"
                >
                  <span>Sair da Plataforma</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
