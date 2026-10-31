import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { upsertProgress, getProgress, getAllProgress, getFavorites, getLastAccessed } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const sessionId = session.sessionId || 'default-session';
  const { searchParams } = request.nextUrl;
  const trainingId = searchParams.get('trainingId');
  const type = searchParams.get('type');

  if (trainingId) {
    const progress = getProgress(sessionId, trainingId);
    return NextResponse.json({ progress });
  }

  if (type === 'favorites') {
    const favorites = getFavorites(sessionId);
    return NextResponse.json({ favorites });
  }

  if (type === 'last') {
    const last = getLastAccessed(sessionId);
    return NextResponse.json({ last });
  }

  const all = getAllProgress(sessionId);
  return NextResponse.json({ progress: all });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const sessionId = session.sessionId || 'default-session';

  try {
    const body = await request.json();
    const { trainingId, currentPage, totalPages, completed, favorited } = body;

    if (!trainingId) {
      return NextResponse.json({ error: 'trainingId obrigatório' }, { status: 400 });
    }

    upsertProgress({ sessionId, trainingId, currentPage, totalPages, completed, favorited });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar progresso' }, { status: 500 });
  }
}
