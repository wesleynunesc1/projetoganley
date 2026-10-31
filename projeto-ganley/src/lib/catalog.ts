// Catálogo de treinamentos do Projeto Ganley
// PDFs são identificados pelo caminho original — NUNCA modificados
// Correspondência capa ↔ módulo verificada visualmente

import path from 'path';
import { Training } from '@/types';

// Caminho base dos arquivos originais de treinamento
// Configurado via variável de ambiente TRAINING_FILES_BASE_PATH
const BASE_PATH = process.env.TRAINING_FILES_BASE_PATH || 
  path.join(process.cwd(), '..'); // fallback: pasta pai do projeto

export function getTrainingFilesBasePath(): string {
  return BASE_PATH;
}

// Catálogo completo — dados verificados por análise dos arquivos originais
export const TRAININGS_CATALOG: Training[] = [
  {
    id: '01',
    slug: 'recomendacoes-gerais',
    title: 'Recomendações Gerais',
    description: 'Fundamentos e recomendações essenciais para iniciar sua jornada de evolução física com segurança e eficiência.',
    category: ['recomendacoes'],
    level: 'beginner',
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53.jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53.jpeg'),
    pdfFiles: [
      {
        id: '01-pdf-01',
        label: 'Recomendações Gerais',
        filename: '14 RECOMENDAÇÕES.pdf',
        originalPath: path.join(BASE_PATH, 'RECOMENDAÇÕES GERAIS', '14 RECOMENDAÇÕES.pdf'),
        sizeBytes: 3759923,
        isPrimary: true,
      }
    ],
    featured: true,
    sortOrder: 1,
    published: true,
    tags: ['recomendações', 'fundamentos', 'iniciantes'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '02',
    slug: 'treino-iniciantes-2x-semana',
    title: 'Treino Iniciantes — 2x na Semana',
    description: 'Protocolo ideal para quem está começando. Duas sessões semanais para adaptação inicial ao treinamento de força.',
    category: ['iniciantes'],
    level: 'beginner',
    weeklyFrequency: 2,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (6).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (6).jpeg'),
    pdfFiles: [
      {
        id: '02-pdf-01',
        label: 'Treino Iniciantes 2x',
        filename: 'TREINO INICIANTES 2 VEZES NA SEMANA.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO INICIANTES 2 VEZES NA SEMANA', 'TREINO INICIANTES 2 VEZES NA SEMANA.pdf'),
        sizeBytes: 9865421,
        isPrimary: true,
      }
    ],
    featured: true,
    sortOrder: 2,
    published: true,
    tags: ['iniciantes', '2x', 'semana'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '03',
    slug: 'treino-iniciantes-4x-semana',
    title: 'Treino Iniciantes — 4x na Semana',
    description: 'Protocolo de quatro sessões semanais para iniciantes que buscam uma progressão mais acelerada.',
    category: ['iniciantes'],
    level: 'beginner',
    weeklyFrequency: 4,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (7).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (7).jpeg'),
    pdfFiles: [
      {
        id: '03-pdf-01',
        label: 'Treino Iniciantes 4x',
        filename: 'TREINO INICIANTES 4 VEZES NA SEMANA.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO INICIANTES 4 VEZES NA SEMANA', 'TREINO INICIANTES 4 VEZES NA SEMANA.pdf'),
        sizeBytes: 8411546,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 3,
    published: true,
    tags: ['iniciantes', '4x', 'semana'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '04',
    slug: 'treino-adaptacao-muscular',
    title: 'Treino Adaptação Muscular',
    description: 'Fase de adaptação neuromuscular. Prepara o corpo para os protocolos mais intensos com movimentos fundamentais.',
    category: ['iniciantes'],
    level: 'beginner',
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (5).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (5).jpeg'),
    pdfFiles: [
      {
        id: '04-pdf-01',
        label: 'Adaptação Muscular',
        filename: 'TREINO ADAPTAÇÃO MUSCULAR_.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO ADAPTAÇÃO MUSCULAR', 'TREINO ADAPTAÇÃO MUSCULAR_.pdf'),
        sizeBytes: 9147392,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 4,
    published: true,
    tags: ['adaptação', 'muscular', 'iniciantes'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '05',
    slug: 'treino-4x-upper-lower',
    title: 'Treino 4x na Semana — Upper / Lower',
    description: 'Divisão superior e inferior em 4 sessões semanais. Equilíbrio ideal entre volume e recuperação.',
    category: ['upper-lower'],
    level: 'intermediate',
    weeklyFrequency: 4,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (4).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (4).jpeg'),
    pdfFiles: [
      {
        id: '05-pdf-01',
        label: 'Upper / Lower 4x',
        filename: 'TREINO 4X NA SEMANA- UPPER- LOWER (SUPERIOR- INFERIOR).pdf',
        originalPath: path.join(BASE_PATH, 'TREINO 4X NA SEMANA- UPPER- LOWER (SUPERIOR- INFERIOR)', 'TREINO 4X NA SEMANA- UPPER- LOWER (SUPERIOR- INFERIOR).pdf'),
        sizeBytes: 7341363,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 5,
    published: true,
    tags: ['upper', 'lower', '4x', 'semana', 'divisão'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '06',
    slug: 'treino-upper-and-lower',
    title: 'Treino Upper and Lower',
    description: 'Protocolo Upper & Lower de alto volume para desenvolvimento muscular equilibrado.',
    category: ['upper-lower'],
    level: 'intermediate',
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (16).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (16).jpeg'),
    pdfFiles: [
      {
        id: '06-pdf-01',
        label: 'Upper and Lower',
        filename: 'TREINO UPPER AND LOWER.pdf',
        originalPath: path.join(BASE_PATH, 'Treino UPPER AND LOWER', 'TREINO UPPER AND LOWER.pdf'),
        sizeBytes: 22587290,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 6,
    published: true,
    tags: ['upper', 'lower', 'divisão'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '07',
    slug: 'treino-abcd-intermediarios',
    title: 'Treino ABCD — Intermediários',
    description: 'Divisão ABCD para praticantes intermediários. Quatro treinos distintos com foco em grupos musculares específicos.',
    category: ['abcd', 'intermediarios'],
    level: 'intermediate',
    weeklyFrequency: 4,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (8).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (8).jpeg'),
    pdfFiles: [
      {
        id: '07-pdf-01',
        label: 'ABCD Intermediários',
        filename: 'TREINO ABCD intermediarios.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO ABCD (intermediarios)', 'TREINO ABCD intermediarios.pdf'),
        sizeBytes: 17231770,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 7,
    published: true,
    tags: ['abcd', 'intermediários', 'divisão', '4x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '08',
    slug: 'treino-abcd-avancados',
    title: 'Treino ABCD — Avançados',
    description: 'Divisão ABCD de alto volume e intensidade para atletas avançados em busca de máximo desenvolvimento muscular.',
    category: ['abcd', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 4,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (12).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (12).jpeg'),
    pdfFiles: [
      {
        id: '08-pdf-01',
        label: 'ABCD Avançados',
        filename: 'TREINO ABCD AVANÇADOS.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO ABCD (avançados)', 'TREINO ABCD AVANÇADOS.pdf'),
        sizeBytes: 21693747,
        isPrimary: true,
      }
    ],
    featured: true,
    sortOrder: 8,
    published: true,
    tags: ['abcd', 'avançados', 'divisão', '4x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '09',
    slug: 'treino-abcde-inferiores',
    title: 'Treino ABCDE — Ênfase em Membros Inferiores',
    description: 'Cinco divisões musculares com foco especial no desenvolvimento de membros inferiores: glúteos, quadríceps, posterior e panturrilha.',
    category: ['abcde', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 5,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (10).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (10).jpeg'),
    pdfFiles: [
      {
        id: '09-pdf-01',
        label: 'ABCDE Ênfase Inferiores',
        filename: 'TREINO ABCDE ENFASE EM MEMBROS INFERIORES.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO ABCDE (ENFASE EM MEMBROS INFERIORES)', 'TREINO ABCDE ENFASE EM MEMBROS INFERIORES.pdf'),
        sizeBytes: 22698291,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 9,
    published: true,
    tags: ['abcde', 'membros inferiores', 'ênfase', '5x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '10',
    slug: 'treino-abcde-superiores',
    title: 'Treino ABCDE — Ênfase em Membros Superiores',
    description: 'Cinco divisões com foco em membros superiores: peito, costas, ombros, bíceps e tríceps em alta frequência.',
    category: ['abcde', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 5,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (11).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (11).jpeg'),
    pdfFiles: [
      {
        id: '10-pdf-01',
        label: 'ABCDE Ênfase Superiores',
        filename: 'TREINO ABCDE ENFASE EM MEMBROS SUPERIORES.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO ABCDE (ENFASE EM MEMBROS SUPERIORES)', 'TREINO ABCDE ENFASE EM MEMBROS SUPERIORES.pdf'),
        sizeBytes: 22821478,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 10,
    published: true,
    tags: ['abcde', 'membros superiores', 'ênfase', '5x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '11',
    slug: 'treino-abcdef-derek-open-olympia',
    title: 'Treino ABCDEF — Super Avançado (Derek — Open Olympia)',
    description: 'Protocolo de seis divisões inspirado nos atletas de Open Olympia. Volume e intensidade extremos para praticantes super avançados.',
    category: ['abcdef', 'avancados', 'especiais'],
    level: 'advanced',
    weeklyFrequency: 6,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (13).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (13).jpeg'),
    pdfFiles: [
      {
        id: '11-pdf-01',
        label: 'ABCDEF Super Avançado — Derek',
        filename: 'teste hot.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO ABCDEF (SUPER AVANÇADO)  DEREK - OPEN OLYMPIA', 'teste hot.pdf'),
        sizeBytes: 26450432,
        isPrimary: true,
      }
    ],
    featured: true,
    sortOrder: 11,
    published: true,
    tags: ['abcdef', 'super avançado', 'derek', 'open olympia', '6x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '12',
    slug: 'treino-abcdef-classic-olympia-ramon',
    title: 'Treino ABCDEF — Classic Olympia (Ramon Dino e Menegate)',
    description: 'Seis divisões no estilo Classic Olympia. Protocolo inspirado em Ramon Dino e Menegate, focado em proporção e estética clássica.',
    category: ['abcdef', 'avancados', 'especiais'],
    level: 'advanced',
    weeklyFrequency: 6,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (19).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (19).jpeg'),
    pdfFiles: [
      {
        id: '12-pdf-01',
        label: 'ABCDEF Classic Olympia — Ramon Dino & Menegate',
        filename: 'Treino ABCDEF Classic Olympia - Ramon Dino e Menegate.pdf',
        originalPath: path.join(BASE_PATH, 'Treino ABCDEF Classic Olympia - Ramon Dino e Menegate', 'Treino ABCDEF Classic Olympia - Ramon Dino e Menegate.pdf'),
        sizeBytes: 20748902,
        isPrimary: true,
      }
    ],
    featured: true,
    sortOrder: 12,
    published: true,
    tags: ['abcdef', 'classic olympia', 'ramon dino', 'menegate', '6x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '13',
    slug: 'treino-ppl-abc',
    title: 'Treino PPL — ABC (3x na Semana)',
    description: 'Push, Pull, Legs em três sessões semanais. Divisão eficiente que trabalha cada grupo muscular com alta frequência.',
    category: ['ppl', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 3,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (9).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (9).jpeg'),
    pdfFiles: [
      {
        id: '13-pdf-01',
        label: 'PPL — ABC',
        filename: 'TREINO PPL (ABC).pdf',
        originalPath: path.join(BASE_PATH, 'TREINO PPL (ABC)', 'TREINO PPL (ABC).pdf'),
        sizeBytes: 15355802,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 13,
    published: true,
    tags: ['ppl', 'push pull legs', 'abc', '3x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '14',
    slug: 'treino-ppl-abc-intermediarios',
    title: 'Treino PPL — ABC Intermediários',
    description: 'Protocolo PPL estruturado para praticantes intermediários. Progressão de cargas e volume adequados ao nível.',
    category: ['ppl', 'intermediarios'],
    level: 'intermediate',
    weeklyFrequency: 3,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (15).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (15).jpeg'),
    pdfFiles: [
      {
        id: '14-pdf-01',
        label: 'PPL — ABC Intermediários',
        filename: 'TREINO PPL (ABC) INTERMEDIÁRIOS.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO PPL (ABC) intermediários', 'TREINO PPL (ABC) INTERMEDIÁRIOS.pdf'),
        sizeBytes: 18233549,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 14,
    published: true,
    tags: ['ppl', 'push pull legs', 'abc', 'intermediários', '3x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '15',
    slug: 'treino-ppl-abc-descanso-def',
    title: 'Treino PPL — ABC Descanso DEF (6x na Semana)',
    description: 'PPL de seis dias: A-B-C treino, descanso, D-E-F treino. Alto volume para maximizar hipertrofia.',
    category: ['ppl', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 6,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (14).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (14).jpeg'),
    pdfFiles: [
      {
        id: '15-pdf-01',
        label: 'PPL — ABC Descanso DEF',
        filename: 'TREINO PPL (ABC DESCANSO DEF).pdf',
        originalPath: path.join(BASE_PATH, 'TREINO PPL (ABC DESCANSO DEF)', 'TREINO PPL (ABC DESCANSO DEF).pdf'),
        sizeBytes: 18699162,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 15,
    published: true,
    tags: ['ppl', 'push pull legs', 'abcdef', 'descanso', '6x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '16',
    slug: 'treino-push-pull-leg-upper-lower-zanca',
    title: 'Treino Push-Pull-Leg-Upper-Lower — Zanca (5x na Semana)',
    description: 'Protocolo híbrido de cinco dias combinando Push, Pull, Leg, Upper e Lower. Inspirado no atleta Zanca.',
    category: ['ppl', 'upper-lower', 'avancados', 'especiais'],
    level: 'advanced',
    weeklyFrequency: 5,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (17).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (17).jpeg'),
    pdfFiles: [
      {
        id: '16-pdf-01',
        label: 'Push-Pull-Leg-Upper-Lower — Zanca',
        filename: 'TREINO PUSH-PULL-LEG-UPPER-LOWER-.pdf',
        originalPath: path.join(BASE_PATH, 'Treino PUSH-PULL-LEG-UPPER-LOWER  ZANCA', 'TREINO PUSH-PULL-LEG-UPPER-LOWER-.pdf'),
        sizeBytes: 25134233,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 16,
    published: true,
    tags: ['push pull leg', 'upper lower', 'zanca', '5x', 'híbrido'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '17',
    slug: 'treino-mens-physique-ali-bilal',
    title: 'Treino Mens Physique — Nível Olympia (Ali Bilal)',
    description: 'Protocolo de cinco sessões no estilo Mens Physique nível Olympia, inspirado em Ali Bilal. Foco em proporção, cintura e apresentação.',
    category: ['especiais', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 5,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (18).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (18).jpeg'),
    pdfFiles: [
      {
        id: '17-pdf-01',
        label: 'Mens Physique — Ali Bilal',
        filename: 'TREINO MENS PHYSIQUE NIVEL OLYMPIA Ali Bilau.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO MENS PHYSIQUE NIVEL OLYMPIA  Ali Bilau', 'TREINO MENS PHYSIQUE NIVEL OLYMPIA Ali Bilau.pdf'),
        sizeBytes: 7903078,
        isPrimary: true,
      }
    ],
    featured: true,
    sortOrder: 17,
    published: true,
    tags: ['mens physique', 'olympia', 'ali bilal', '5x'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '18',
    slug: 'treino-mulheres-2x-semana-ab',
    title: 'Treino para Mulheres — 2x na Semana (AB)',
    description: 'Divisão AB para mulheres com duas sessões semanais. Protocolo equilibrado e eficiente para evolução feminina.',
    category: ['feminino'],
    level: 'beginner',
    weeklyFrequency: 2,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (1).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (1).jpeg'),
    pdfFiles: [
      {
        id: '18-pdf-01',
        label: 'Treino Feminino 2x — AB',
        filename: 'TREINO PARA MULHERES 2 X NA SEMANA AB.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO PARA MULHERES 2 X NA SEMANA AB', 'TREINO PARA MULHERES 2 X NA SEMANA AB.pdf'),
        sizeBytes: 2556928,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 18,
    published: true,
    tags: ['feminino', 'mulheres', '2x', 'ab'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '19',
    slug: 'treino-mulheres-4x-semana-ab',
    title: 'Treino para Mulheres — 4x na Semana (AB)',
    description: 'Quatro sessões semanais na divisão AB para mulheres. Volume e frequência otimizados para hipertrofia feminina.',
    category: ['feminino'],
    level: 'intermediate',
    weeklyFrequency: 4,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (2).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (2).jpeg'),
    pdfFiles: [
      {
        id: '19-pdf-01',
        label: 'Treino Feminino 4x — AB',
        filename: 'TREINO PARA MULHERES 4X NA SEMANA AB.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO PARA MULHERES 4X NA SEMANA AB', 'TREINO PARA MULHERES 4X NA SEMANA AB.pdf'),
        sizeBytes: 2524877,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 19,
    published: true,
    tags: ['feminino', 'mulheres', '4x', 'ab'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: '20',
    slug: 'treino-mulher-3x-semana-avancado',
    title: 'Treino para Mulher — 3x na Semana (Avançado)',
    description: 'Protocolo avançado de três sessões para mulheres que buscam alta performance e definição muscular.',
    category: ['feminino', 'avancados'],
    level: 'advanced',
    weeklyFrequency: 3,
    coverImageFilename: 'WhatsApp Image 2026-10-30 at 23.39.53 (3).jpeg',
    coverImageOriginalPath: path.join(BASE_PATH, 'WhatsApp Image 2026-10-30 at 23.39.53 (3).jpeg'),
    pdfFiles: [
      {
        id: '20-pdf-01',
        label: 'Treino Feminino Avançado 3x',
        filename: '3X NA SEMANA TREINO PARA MULHERES AVANÇADAS.pdf',
        originalPath: path.join(BASE_PATH, 'TREINO PARA MULHER 3X NA SEMANA AVANÇADO', '3X NA SEMANA TREINO PARA MULHERES AVANÇADAS.pdf'),
        sizeBytes: 4179353,
        isPrimary: true,
      }
    ],
    featured: false,
    sortOrder: 20,
    published: true,
    tags: ['feminino', 'mulheres', '3x', 'avançado'],
    createdAt: '2026-10-30T00:00:00Z',
    updatedAt: '2026-10-30T00:00:00Z',
  },
];

export function getTrainingBySlug(slug: string): Training | undefined {
  return TRAININGS_CATALOG.find(t => t.slug === slug && t.published);
}

export function getTrainingById(id: string): Training | undefined {
  return TRAININGS_CATALOG.find(t => t.id === id && t.published);
}

export function getTrainingsByCategory(category: string): Training[] {
  return TRAININGS_CATALOG.filter(t => 
    t.published && t.category.includes(category as any)
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedTrainings(): Training[] {
  return TRAININGS_CATALOG.filter(t => t.published && t.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function searchTrainings(query: string, filters?: {
  level?: string;
  category?: string;
  weeklyFrequency?: number;
}): Training[] {
  const q = query.toLowerCase().trim();
  return TRAININGS_CATALOG.filter(t => {
    if (!t.published) return false;
    
    // Filtros
    if (filters?.level && t.level !== filters.level) return false;
    if (filters?.category && !t.category.includes(filters.category as any)) return false;
    if (filters?.weeklyFrequency && t.weeklyFrequency !== filters.weeklyFrequency) return false;
    
    // Busca textual
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      t.category.some(cat => cat.toLowerCase().includes(q))
    );
  }).sort((a, b) => a.sortOrder - b.sortOrder);
}

