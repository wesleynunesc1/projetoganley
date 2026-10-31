import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  verifyAccessPassword,
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  getSession,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.remainingMs || 0) / 60000);
      return NextResponse.json(
        { error: `Muitas tentativas. Aguarde ${minutes} minuto(s).` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Senha inválida.' }, { status: 400 });
    }

    // Verificar senha no servidor
    const isValid = await verifyAccessPassword(password.trim());

    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Senha incorreta. Verifique e tente novamente.' },
        { status: 401 }
      );
    }

    // Senha correta — autenticar sessão
    clearAttempts(ip);

    const session = await getSession();
    session.isAuthenticated = true;
    session.sessionId = uuidv4();
    session.loginAt = new Date().toISOString();
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 });
  }
}
