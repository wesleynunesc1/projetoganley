// Autenticação e sessão — Projeto Ganley
// Senha protegida no servidor com validação e rate-limiting

import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SessionData, AuthAttempt } from '@/types';

// Configuração da sessão com cookie HttpOnly + Secure + SameSite
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'ganley_super_secure_session_secret_key_2026_at_least_32_chars!',
  cookieName: 'ganley_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
};

// Rate limiting em memória (para produção: Upstash / Redis)
const authAttempts = new Map<string, AuthAttempt>();

const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '10');
const LOCKOUT_SECONDS = parseInt(process.env.LOCKOUT_DURATION || '300');

export function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  const entry = authAttempts.get(ip);

  if (!entry) return { allowed: true };

  // Verificar se está bloqueado
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { allowed: false, remainingMs: entry.lockedUntil - now };
  }

  // Reset se passou do período de lockout
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    authAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: entry.attempts < MAX_ATTEMPTS };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = authAttempts.get(ip);

  if (!entry) {
    authAttempts.set(ip, { ip, attempts: 1, lastAttemptAt: now });
    return;
  }

  const newAttempts = entry.attempts + 1;

  if (newAttempts >= MAX_ATTEMPTS) {
    authAttempts.set(ip, {
      ...entry,
      attempts: newAttempts,
      lastAttemptAt: now,
      lockedUntil: now + LOCKOUT_SECONDS * 1000,
    });
  } else {
    authAttempts.set(ip, { ...entry, attempts: newAttempts, lastAttemptAt: now });
  }
}

export function clearAttempts(ip: string): void {
  authAttempts.delete(ip);
}

// Verificação da senha de acesso
export async function verifyAccessPassword(input: string): Promise<boolean> {
  const storedHash = process.env.ACCESS_PASSWORD_HASH;

  if (storedHash) {
    return bcrypt.compare(input, storedHash);
  }

  const rawPassword = process.env.ACCESS_PASSWORD || '2027';
  return input === rawPassword;
}

// Verificação do admin por email
export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

// Obter sessão atual usando cookies() de next/headers
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
