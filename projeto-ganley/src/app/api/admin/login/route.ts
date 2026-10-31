import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdminEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, adminKey } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 });
    }

    if (!isAdminEmail(email.trim())) {
      return NextResponse.json(
        { error: 'Acesso negado. Este e-mail não possui privilégios administrativos.' },
        { status: 403 }
      );
    }

    const configuredAdminKey = process.env.ADMIN_KEY || process.env.ACCESS_PASSWORD || '2027';
    if (adminKey && adminKey !== configuredAdminKey) {
      return NextResponse.json({ error: 'Chave de segurança incorreta.' }, { status: 401 });
    }

    const session = await getSession();
    session.isAuthenticated = true;
    session.isAdmin = true;
    session.sessionId = session.sessionId || 'admin-session';
    session.loginAt = new Date().toISOString();
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao autenticar admin.' }, { status: 500 });
  }
}
