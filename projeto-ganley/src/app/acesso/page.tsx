'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUnlocked(true);
        setTimeout(() => {
          router.push('/inicio');
        }, 900);
      } else {
        setError(data.error || 'Senha incorreta. Verifique e tente novamente.');
        setIsLoading(false);
        inputRef.current?.select();
      }
    } catch {
      setError('Falha de conexão com o servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden px-4">
      {/* Deep Atmospheric Lighting (Ticto inspired ambient glow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft purple aura top center */}
        <div
          className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full opacity-20 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #9747FF 0%, transparent 70%)' }}
        />
        {/* Soft magenta aura bottom right */}
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[550px] h-[550px] rounded-full opacity-15 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #FF2689 0%, transparent 70%)' }}
        />
        {/* Soft warm orange aura bottom left */}
        <div
          className="absolute -bottom-[20%] -left-[10%] w-[450px] h-[450px] rounded-full opacity-10 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #FF9C2B 0%, transparent 70%)' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="unlock-box"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[440px]"
          >
            {/* Minimalist Glass Card */}
            <div className="relative rounded-3xl bg-[#0C0A12]/80 backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 shadow-2xl">
              {/* Subtle top inner glow line */}
              <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

              {/* Header Title Section */}
              <div className="text-center mb-8">
                {/* Badge Identifier */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-ganley-purple animate-pulse" />
                  <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-ganley-gray">
                    Acesso Exclusivo
                  </span>
                </div>

                {/* Brand Name */}
                <h1 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  <span className="text-gradient-accent">PROJETO</span> GANLEY
                </h1>

                <h2 className="text-white text-base sm:text-lg font-medium mt-3 tracking-tight">
                  Sua evolução começa aqui.
                </h2>

                <p className="text-ganley-gray text-xs sm:text-sm mt-2 leading-relaxed max-w-xs mx-auto">
                  Uma biblioteca completa de treinamentos para cada etapa da sua evolução física.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha de acesso"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="w-full bg-[#15101E]/80 border border-white/[0.1] rounded-2xl px-5 py-4 text-center text-white placeholder-ganley-gray/60 tracking-widest text-base outline-none focus:border-ganley-purple/80 focus:ring-2 focus:ring-ganley-purple/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-ganley-gray hover:text-white transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-ganley-magenta/10 border border-ganley-magenta/20 text-ganley-magenta text-xs text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !password.trim()}
                  className="btn-accent w-full py-4 text-sm font-bold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Validando acesso...
                    </span>
                  ) : (
                    'Desbloquear acesso'
                  )}
                </button>
              </form>

              {/* Discrete Security Footer */}
              <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
                <span className="text-[11px] font-sans text-ganley-gray-dark uppercase tracking-widest">
                  Ambiente Protegido & Criptografado
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#FF9C2B] via-[#FF2689] to-[#9747FF] flex items-center justify-center shadow-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-sans font-bold text-2xl text-white">Acesso Desbloqueado</h2>
            <p className="text-ganley-gray text-xs mt-1">Entrando na plataforma...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
