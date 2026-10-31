import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  TRAININGS_CATALOG,
  getTrainingBySlug,
  getTrainingsByCategory,
  searchTrainings,
  getFeaturedTrainings,
} from '@/lib/catalog';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const q = searchParams.get('q');
  const level = searchParams.get('level');
  const featured = searchParams.get('featured');
  const weeklyFrequency = searchParams.get('weeklyFrequency');

  if (slug) {
    const training = getTrainingBySlug(slug);
    if (!training) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json({ training: sanitizeTraining(training) });
  }

  if (featured === 'true') {
    const trainings = getFeaturedTrainings().map(sanitizeTraining);
    return NextResponse.json({ trainings });
  }

  if (category) {
    const trainings = getTrainingsByCategory(category).map(sanitizeTraining);
    return NextResponse.json({ trainings });
  }

  if (q || level || weeklyFrequency) {
    const trainings = searchTrainings(q || '', {
      level: level || undefined,
      weeklyFrequency: weeklyFrequency ? parseInt(weeklyFrequency) : undefined,
    }).map(sanitizeTraining);
    return NextResponse.json({ trainings });
  }

  const trainings = TRAININGS_CATALOG.filter((t) => t.published).map(sanitizeTraining);
  return NextResponse.json({ trainings });
}

function sanitizeTraining(training: any) {
  return {
    ...training,
    coverImageOriginalPath: undefined,
    pdfFiles: training.pdfFiles.map((f: any) => ({
      id: f.id,
      label: f.label,
      filename: f.filename,
      sizeBytes: f.sizeBytes,
      isPrimary: f.isPrimary,
    })),
  };
}
