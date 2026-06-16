// ─── Enums ───────────────────────────────────────────────────────────────────

export type Area = 'comercial' | 'logistica';

export type Topic =
  // Comercial
  | 'margenes-markup'
  | 'descuentos'
  | 'iva-impuestos'
  | 'break-even'
  | 'comisiones'
  | 'prevision-ventas'
  | 'kpis-comerciales'
  // Logística
  | 'rotacion-inventario'
  | 'stock-seguridad'
  | 'eoq'
  | 'costes-almacenamiento'
  | 'costes-transporte'
  | 'contenedores-pales'
  | 'incoterms'
  | 'kpis-logisticos';

export type PracticeMode = 'quiz' | 'ejercicio' | 'flashcard' | 'mixto';

export type Difficulty = 'facil' | 'medio' | 'dificil';

// ─── Quiz (opción múltiple) ───────────────────────────────────────────────────

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: 'quiz';
  area: Area;
  topic: Topic;
  difficulty: Difficulty;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

// ─── Ejercicio numérico ───────────────────────────────────────────────────────

export interface ExerciseStep {
  description: string;
  formula?: string;
  result?: string;
}

export interface NumericalExercise {
  id: string;
  type: 'ejercicio';
  area: Area;
  topic: Topic;
  difficulty: Difficulty;
  title: string;
  statement: string;
  data: Record<string, string>;
  formula: string;
  steps: ExerciseStep[];
  answer: number;
  tolerance: number; // percentage tolerance e.g. 0.01 = 1%
  unit: string;
  hint: string;
}

// ─── Flashcard ────────────────────────────────────────────────────────────────

export interface Flashcard {
  id: string;
  type: 'flashcard';
  area: Area;
  topic: Topic;
  difficulty: Difficulty;
  front: string;
  back: string;
  formula?: string;
  example?: string;
}

// ─── Union content type ───────────────────────────────────────────────────────

export type ContentItem = QuizQuestion | NumericalExercise | Flashcard;

// ─── Topic metadata ───────────────────────────────────────────────────────────

export interface TopicMeta {
  id: Topic;
  area: Area;
  label: string;
  description: string;
  icon: string;
}

// ─── Progress & Stats ─────────────────────────────────────────────────────────

export interface ItemProgress {
  itemId: string;
  correct: number;
  incorrect: number;
  lastSeen: number; // timestamp
}

export interface FlashcardProgress {
  itemId: string;
  box: number; // Leitner box 1-5
  nextReview: number; // timestamp
  lastSeen: number;
}

export interface UserProgress {
  // Quiz & exercise results by item
  items: Record<string, ItemProgress>;
  // Flashcard Leitner state
  flashcards: Record<string, FlashcardProgress>;
  // Daily streak
  lastActiveDate: string; // ISO date YYYY-MM-DD
  streakDays: number;
  // Session history
  sessions: SessionResult[];
}

export interface SessionResult {
  id: string;
  date: number; // timestamp
  area: Area | 'all';
  topic: Topic | 'all';
  mode: PracticeMode;
  totalItems: number;
  correct: number;
  durationSeconds: number;
}

// ─── Session state ────────────────────────────────────────────────────────────

export interface SessionItem {
  item: ContentItem;
  answered: boolean;
  correct: boolean | null;
  userAnswer?: string | number;
}
