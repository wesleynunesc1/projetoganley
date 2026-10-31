// Tipos centrais da plataforma Projeto Ganley
// Os PDFs são tratados como arquivos binários — nunca lidos como texto

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced' | 'special';

export type TrainingCategory =
  | 'recomendacoes'
  | 'iniciantes'
  | 'intermediarios'
  | 'avancados'
  | 'upper-lower'
  | 'abcd'
  | 'abcde'
  | 'abcdef'
  | 'ppl'
  | 'feminino'
  | 'especiais';

export interface PdfFile {
  id: string;
  label: string;         // "Treino Principal", "Material Complementar 1"
  filename: string;      // Nome original do arquivo, preservado integralmente
  originalPath: string;  // Caminho absoluto do arquivo binário original
  sizeBytes: number;
  isPrimary: boolean;
}

export interface Training {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TrainingCategory[];
  level: TrainingLevel;
  coverImageFilename: string;   // Arquivo de capa original
  coverImageOriginalPath: string;
  pdfFiles: PdfFile[];
  featured: boolean;
  sortOrder: number;
  published: boolean;
  weeklyFrequency?: number;     // Frequência semanal (ex: 2, 3, 4, 5, 6)
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  sessionId: string;
  trainingId: string;
  currentPage: number;
  totalPages: number;
  completed: boolean;
  favorited: boolean;
  lastAccessedAt: string;
}

export interface SessionData {
  isAuthenticated: boolean;
  sessionId: string;   // UUID único por sessão (para progresso individual)
  isAdmin?: boolean;
  loginAt?: string;
}

export interface AuthAttempt {
  ip: string;
  attempts: number;
  lastAttemptAt: number;
  lockedUntil?: number;
}

export interface Category {
  id: TrainingCategory;
  label: string;
  description: string;
  icon: string;
  sortOrder: number;
}

