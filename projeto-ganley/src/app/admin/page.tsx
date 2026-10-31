'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TRAININGS_CATALOG } from '@/lib/catalog';
import { Training } from '@/types';

export default function AdminPage() {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [trainings, setTrainings] = useState<Training[]>(TRAININGS_CATALOG);
  const [activeTab, setActiveTab] = useState<'modules' | 'metrics' | 'settings'>('modules');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, adminKey: keyInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuth(true);
      } else {
        setAuthError(data.error || 'Credenciais não autorizadas para este ambiente.');
      }
    } catch {
      setAuthError('Erro ao conectar ao servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = (id: string) => {
    setTrainings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t))
    );
    notify('Destaque atualizado com sucesso.');
  };

  const togglePublished = (id: string) => {
    setTrainings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, published: !t.published } : t))
    );
    notify('Status de visibilidade atualizado.');
  };

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const filtered = trainings.filter(
    (t) =>
      t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Unauthenticated Admin Gate
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-[#0C0A12] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-7">
            <span className="badge-pill bg-ganley-magenta/15 text-ganley-magenta border-ganley-magenta/30 text-[10px] uppercase font-bold tracking-wider mb-4">
              Restrito — Admin
            </span>
            <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight">
              Gestão da Plataforma
            </h1>
            <p className="text-xs text-ganley-gray mt-1.5 font-normal">
              Acesso exclusivo para o e-mail autorizado em <code className="text-ganley-orange">ADMIN_EMAIL</code>.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ganley-gray mb-1.5 font-sans">
                E-mail do Administrador
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@projetoganley.com"
                className="w-full bg-[#15101E] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-ganley-gray/50 outline-none focus:border-ganley-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ganley-gray mb-1.5 font-sans">
                Chave de Acesso Admin
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Chave master ou senha"
                className="w-full bg-[#15101E] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-ganley-gray/50 outline-none focus:border-ganley-purple"
              />
            </div>

            {authError && (
              <p className="text-xs text-ganley-magenta text-center font-medium">{authError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              {loading ? 'Validando...' : 'Entrar no Painel'}
            </button>

            <div className="text-center pt-4 border-t border-white/[0.06]">
              <Link href="/inicio" className="text-xs text-ganley-gray hover:text-white transition-colors">
                ← Voltar para a Área do Membro
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0C0A12] border-r border-white/[0.08] p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="mb-8">
            <span className="font-sans font-black text-lg tracking-tight text-white flex items-center gap-1.5">
              <span className="text-gradient-accent">GANLEY</span>
              <span>ADMIN</span>
            </span>
            <span className="text-[10px] text-ganley-gray-dark uppercase tracking-widest block mt-0.5">
              Controle Editorial
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 font-sans text-xs">
            <button
              onClick={() => setActiveTab('modules')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'modules'
                  ? 'bg-white/[0.08] text-white font-semibold'
                  : 'text-ganley-gray hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <svg className="w-4 h-4 text-ganley-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Módulos de Treino ({trainings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'metrics'
                  ? 'bg-white/[0.08] text-white font-semibold'
                  : 'text-ganley-gray hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <svg className="w-4 h-4 text-ganley-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Relatório de Arquivos</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/[0.06] space-y-3">
          <Link
            href="/inicio"
            className="flex items-center gap-2 text-xs text-ganley-gray hover:text-white transition-colors"
          >
            <span>← Ir para a Plataforma</span>
          </Link>
          <button
            onClick={() => setIsAdminAuth(false)}
            className="text-xs text-ganley-magenta hover:underline"
          >
            Encerrar sessão admin
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Gerenciamento dos 20 Programas
            </h1>
            <p className="text-xs sm:text-sm text-ganley-gray mt-1">
              Capas, documentos binários originais e controles de publicação.
            </p>
          </div>

          {feedbackMsg && (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-sans font-medium">
              ✓ {feedbackMsg}
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-[#0C0A12] border border-white/[0.08] p-5">
            <span className="text-[11px] font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Programas Ativos
            </span>
            <p className="font-space font-black text-2xl text-white mt-1">{trainings.length}</p>
          </div>
          <div className="rounded-2xl bg-[#0C0A12] border border-white/[0.08] p-5">
            <span className="text-[11px] font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Capas Confirmadas
            </span>
            <p className="font-space font-black text-2xl text-emerald-400 mt-1">20 / 20</p>
          </div>
          <div className="rounded-2xl bg-[#0C0A12] border border-white/[0.08] p-5">
            <span className="text-[11px] font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              PDFs Integrados
            </span>
            <p className="font-space font-black text-2xl text-ganley-purple mt-1">20 / 20</p>
          </div>
          <div className="rounded-2xl bg-[#0C0A12] border border-white/[0.08] p-5">
            <span className="text-[11px] font-sans font-semibold text-ganley-gray uppercase tracking-wider">
              Destaques na Home
            </span>
            <p className="font-space font-black text-2xl text-ganley-orange mt-1">
              {trainings.filter((t) => t.featured).length}
            </p>
          </div>
        </div>

        {/* Modules Table */}
        <div className="rounded-3xl bg-[#0C0A12] border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="font-sans font-bold text-base text-white">Catálogo Mapeado</h2>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar por nome ou slug..."
              className="bg-[#15101E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-ganley-gray outline-none w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-white/[0.03] border-b border-white/[0.06] text-ganley-gray font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Capa</th>
                  <th className="p-3.5">Título & Identificador</th>
                  <th className="p-3.5">Nível</th>
                  <th className="p-3.5">Freq.</th>
                  <th className="p-3.5">Arquivo PDF</th>
                  <th className="p-3.5">Tamanho</th>
                  <th className="p-3.5 text-center">Destaque</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Leitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-black border border-white/[0.08]">
                        <img
                          src={`/api/cover/${t.slug}`}
                          alt={t.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="font-bold text-white line-clamp-1">{t.title}</p>
                      <p className="text-ganley-gray text-[10px] font-mono mt-0.5">{t.slug}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="badge-pill bg-white/[0.04] text-white border-white/[0.08] text-[10px] uppercase">
                        {t.level}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-ganley-orange">
                      {t.weeklyFrequency ? `${t.weeklyFrequency}x` : '—'}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="text-ganley-gray font-mono text-[11px] truncate">
                        {t.pdfFiles[0]?.filename}
                      </p>
                    </td>
                    <td className="p-3.5 text-ganley-gray font-mono text-[11px]">
                      {t.pdfFiles[0]?.sizeBytes
                        ? `${(t.pdfFiles[0].sizeBytes / (1024 * 1024)).toFixed(1)} MB`
                        : '—'}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleFeatured(t.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          t.featured
                            ? 'bg-ganley-orange/20 text-ganley-orange border border-ganley-orange/30'
                            : 'bg-white/[0.04] text-ganley-gray border border-white/[0.06] hover:text-white'
                        }`}
                      >
                        {t.featured ? '★ Sim' : 'Não'}
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => togglePublished(t.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                          t.published
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {t.published ? 'Ativo' : 'Oculto'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/treinamentos/${t.slug}`}
                        target="_blank"
                        className="text-ganley-purple-light hover:text-white transition-colors font-medium text-xs"
                      >
                        Visualizar →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
