export type Sector = 'comun' | 'cafe' | 'arroz' | 'pasta' | 'atun' | 'salmon'
export type ErrKind = 'calculo' | 'unidades' | 'interpretacion' | 'supuesto'
export type Dim = 'calculo' | 'unidades' | 'razonamiento' | 'supuestos' | 'interpretacion'
/** Las 7 fases de un caso. */
export type Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const PHASES: Record<Phase, string> = {
  1: 'Comprender', 2: 'Qué sabemos y qué falta', 3: 'A quién consultar', 4: 'Calcular',
  5: 'Comparar escenarios', 6: 'Decidir', 7: 'Comunicar',
}
export const SECTORS: Record<Sector, string> = {
  comun: 'Común', cafe: 'Café', arroz: 'Arroz', pasta: 'Pasta', atun: 'Atún', salmon: 'Salmón',
}
export const ERR_LABEL: Record<ErrKind, string> = {
  calculo: 'Error de cálculo', unidades: 'Error de unidades',
  interpretacion: 'Error de interpretación', supuesto: 'Supuesto equivocado',
}
export const DIM_LABEL: Record<Dim, string> = {
  calculo: 'Cálculo', unidades: 'Unidades', razonamiento: 'Razonamiento',
  supuestos: 'Supuestos', interpretacion: 'Interpretación comercial',
}

/** Dato que se añade a la ficha del caso al llegar a un paso. */
export interface Datum { label: string; value: string; kind?: 'sim' | 'calc' | 'pend' }

interface StepBase {
  id: string
  phase?: Phase
  dim?: Dim
  /** Texto de contexto / datos nuevos que se muestran antes de la pregunta. */
  intro?: string
  data?: Datum[]
  q: string
  /** Qué significa el resultado y qué decisión permite tomar. */
  means?: string
}
export interface Trap { v: number; kind: ErrKind; msg: string }
export interface NumStep extends StepBase {
  kind: 'num'
  a: number
  unit?: string
  /** Tolerancia relativa (por defecto 0,5 %). */
  tol?: number
  hints: string[]
  sol: string[]
  /** Secuencia para teclear en la calculadora. */
  keys?: string
  mental?: string
  excel?: string
  traps?: Trap[]
}
export type Grade = 'ok' | 'alt' | 'no'
export interface Opt { t: string; g: Grade; fb: string }
export interface ChoiceStep extends StepBase {
  kind: 'choice'
  multi?: boolean
  opts: Opt[]
  hints?: string[]
}
export interface WriteStep extends StepBase {
  kind: 'write'
  checklist: string[]
  model: string
}
export type Step = NumStep | ChoiceStep | WriteStep

export interface Skill {
  id: string
  title: string
  sector: Sector
  topic: 'bases' | 'cafe' | 'sectores' | 'logistica' | 'internacional' | 'mental'
  gen: (level: number) => NumStep
}

export interface Lesson {
  id: string
  track: 'bases' | 'cafe' | 'sectores' | 'logistica' | 'comercial' | 'internacional'
  unit: string
  title: string
  sector: Sector
  body: string
  skills?: string[]
  quiz?: Step[]
}

export interface Case {
  id: string
  title: string
  sector: Sector
  tipo: string
  level: 1 | 2 | 3
  summary: string
  brief: string
  steps: Step[]
}
