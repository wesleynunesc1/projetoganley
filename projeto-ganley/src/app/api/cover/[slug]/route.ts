import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getTrainingBySlug } from '@/lib/catalog';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Verificar autenticação
  const session = await getSession();
  if (!session.isAuthenticated) {
    return new NextResponse(null, { status: 401 });
  }

  const { slug } = await params;
  const training = getTrainingBySlug(slug);

  if (!training) {
    return new NextResponse(null, { status: 404 });
  }

  const resolvedPath = path.resolve(training.coverImageOriginalPath);
  const basePath = path.resolve(process.env.TRAINING_FILES_BASE_PATH || path.join(process.cwd(), '..'));

  if (!resolvedPath.startsWith(basePath)) {
    return new NextResponse(null, { status: 403 });
  }

  if (!fs.existsSync(resolvedPath)) {
    return new NextResponse(null, { status: 404 });
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };

  const contentType = mimeTypes[ext] || 'image/jpeg';
  const fileStats = fs.statSync(resolvedPath);
  const fileStream = fs.createReadStream(resolvedPath);

  const readableStream = new ReadableStream({
    start(controller) {
      fileStream.on('data', (chunk) => controller.enqueue(chunk));
      fileStream.on('end', () => controller.close());
      fileStream.on('error', (err) => controller.error(err));
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileStats.size.toString(),
      'Cache-Control': 'private, max-age=86400',
    },
  });
}
