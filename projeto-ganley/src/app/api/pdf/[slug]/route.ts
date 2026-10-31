// API Route: Servir PDFs de forma protegida e autenticada
// GET /api/pdf/[slug]?file=0
// ⚠️ PDFs são arquivos BINÁRIOS — transmitidos via stream sem qualquer processamento

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getTrainingBySlug } from '@/lib/catalog';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 1. Verificar autenticação
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { slug } = await params;
  const fileIndex = parseInt(request.nextUrl.searchParams.get('file') || '0');

  // 2. Localizar o treinamento no catálogo
  const training = getTrainingBySlug(slug);
  if (!training) {
    return NextResponse.json({ error: 'Treinamento não encontrado' }, { status: 404 });
  }

  // 3. Localizar o arquivo PDF pelo índice
  const pdfFile = training.pdfFiles[fileIndex];
  if (!pdfFile) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
  }

  // 4. Validar que o caminho é seguro (prevenir path traversal)
  const resolvedPath = path.resolve(pdfFile.originalPath);
  const basePath = path.resolve(process.env.TRAINING_FILES_BASE_PATH || path.join(process.cwd(), '..'));

  if (!resolvedPath.startsWith(basePath)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  // 5. Verificar se o arquivo existe
  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: 'Arquivo PDF não encontrado no servidor' }, { status: 404 });
  }

  // 6. Transmitir o PDF como stream binário — SEM MODIFICAR NENHUM BYTE
  const fileStats = fs.statSync(resolvedPath);
  const fileSize = fileStats.size;

  // Suporte a Range requests (para PDF.js carregar páginas sob demanda)
  const rangeHeader = request.headers.get('range');

  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const fileStream = fs.createReadStream(resolvedPath, { start, end });
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(readableStream, {
      status: 206,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename="${encodeURIComponent(pdfFile.filename)}"`,
      },
    });
  }

  const fileStream = fs.createReadStream(resolvedPath);
  const readableStream = new ReadableStream({
    start(controller) {
      fileStream.on('data', (chunk) => controller.enqueue(chunk));
      fileStream.on('end', () => controller.close());
      fileStream.on('error', (err) => controller.error(err));
    },
  });

  return new NextResponse(readableStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': fileSize.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, max-age=3600',
      'Content-Disposition': `inline; filename="${encodeURIComponent(pdfFile.filename)}"`,
    },
  });
}
