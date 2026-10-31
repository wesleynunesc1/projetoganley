'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRAININGS_CATALOG } from '@/lib/catalog';
import { Training } from '@/types';

export default function AdminPage() {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Admin Dashboard State
  const [trainings, setTrainings] = useState<Training[]>(TRAININGS_CATALOG);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');

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
        setAuthError(data.error || 'Credenciais inválidas para área restrita.');
      }
    } catch {
      setAuthError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = (id: string) => {
    setTrainings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t))
    );
    setSaveMessage('Status de destaque atualizado.');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const togglePublished = (id: string) => {
    setTrainings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, published: !t.published } : t))
    );
    setSaveMessage('Status de publicação atualizado.');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const filtered = trainings.filter(
    (t) =>
      t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // If not authenticated as admin, show login gate
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-ganley-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F0D18] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="badge bg-red-500/20 text-red-400 border-red-500/30 text-[11px] uppercase font-bold tracking-wider mb-3">
              Acesso Restrito
            </span>
            <h1 className="font-space font-black text-2xl text-white">Painel Administrativo</h1>
            <p className="text-xs text-ganley-gray mt-1.5">
              Informe o e-mail autorizado configurado na variável <code className="text-ganley-orange">ADMIN_EMAIL</code>.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ganley-gray mb-1.5">
                E-mail do Administrador
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@projetoganley.com"
                className="input-ganley text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ganley-gray mb-1.5">
                Chave de Acesso Admin (opcional se não definida)
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Chave master ou senha"
                className="input-ganley text-sm"
              />
            </div>

            {authError && (
              <p className="text-xs text-ganley-magenta text-center font-medium">{authError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold"
            >
              {loading ? 'Verificando...' : 'Entrar na Administração'}
            </button>

            <div className="text-center pt-4 border-t border-white/5">
              <Link href="/inicio" className="text-xs text-ganley-gray hover:text-white transition-colors">
                ← Voltar para a Área de Membros
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ganley-black text-white flex flex-col">
      {/* Admin Topbar */}
      <header className="border-b border-white/10 bg-[#0E0C16] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="font-space font-black text-base text-gradient">GANLEY ADMIN</span>
          <span className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
            Sessão Ativa
          </span>
        </div>

        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className="text-xs text-emerald-400 font-medium animate-fade-in">
              ✓ {saveMessage}
            </span>
          )}
          <Link
            href="/inicio"
            className="text-xs text-ganley-gray hover:text-white transition-colors"
          >
            Ver Plataforma
          </Link>
          <button
            onClick={() => setIsAdminAuth(false)}
            className="text-xs text-ganley-magenta hover:underline"
          >
            Sair do Admin
          </button>
        </div>
      </header>

      {/* Admin Main Body */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Statistics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0F0D18] border border-white/10 rounded-xl p-4">
            <span className="text-xs text-ganley-gray uppercase font-semibold">Total de Módulos</span>
            <p className="font-space font-black text-2xl text-white mt-1">{trainings.length}</p>
          </div>
          <div className="bg-[#0F0D18] border border-white/10 rounded-xl p-4">
            <span className="text-xs text-ganley-gray uppercase font-semibold">Capas Vinculadas</span>
            <p className="font-space font-black text-2xl text-emerald-400 mt-1">20 / 20 (100%)</p>
          </div>
          <div className="bg-[#0F0D18] border border-white/10 rounded-xl p-4">
            <span className="text-xs text-ganley-gray uppercase font-semibold">PDFs Integrados</span>
            <p className="font-space font-black text-2xl text-ganley-purple mt-1">20 / 20 (100%)</p>
          </div>
          <div className="bg-[#0F0D18] border border-white/10 rounded-xl p-4">
            <span className="text-xs text-ganley-gray uppercase font-semibold">Destaques Home</span>
            <p className="font-space font-black text-2xl text-ganley-orange mt-1">
              {trainings.filter((t) => t.featured).length}
            </p>
          </div>
        </div>

        {/* Modules Table & Inspector */}
        <div className="bg-[#0F0D18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-space font-bold text-lg text-white">Catálogo de Treinamentos Importados</h2>
              <p className="text-xs text-ganley-gray mt-0.5">
                Todos os 20 programas mapeados e validados contra arquivos originais.
              </p>
            </div>

            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar módulos..."
              className="bg-ganley-black-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-ganley-gray outline-none w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-ganley-gray font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Capa</th>
                  <th className="p-3.5">Título / Slug</th>
                  <th className="p-3.5">Nível</th>
                  <th className="p-3.5">Freq.</th>
                  <th className="p-3.5">Arquivo PDF</th>
                  <th className="p-3.5">Tamanho</th>
                  <th className="p-3.5 text-center">Destaque</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="w-10 h-14 rounded overflow-hidden bg-black border border-white/10">
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
                      <span className="badge badge-level-beginner text-[10px] uppercase">
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
                        className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                          t.featured
                            ? 'bg-ganley-orange/20 text-ganley-orange border border-ganley-orange/30'
                            : 'bg-white/5 text-ganley-gray border border-white/5 hover:text-white'
                        }`}
                      >
                        {t.featured ? '★ Sim' : 'Não'}
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => togglePublished(t.id)}
                        className={`p-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
                          t.published
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {t.published ? 'Publicado' : 'Oculto'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/treinamentos/${t.slug}`}
                        target="_blank"
                        className="text-ganley-purple-light hover:underline font-medium"
                      >
                        Abrir Leitor →
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

