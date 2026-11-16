import type { ErrKind, NumStep } from './types.ts'

/** Formato numérico: 1.234,56 */
export function f(n: number, d = 2): string {
  if (!isFinite(n)) return '—'
  const s = Math.abs(n).toFixed(d)
  const [i, dec] = s.split('.')
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const neg = n < 0 && Number(s) !== 0 ? '−' : ''
  return neg + int + (dec ? ',' + dec : '')
}
/** Formato sin ceros sobrantes (hasta d decimales). */
export function g(n: number, d = 4): string {
  const s = f(n, d)
  return s.includes(',') ? s.replace(/0+$/, '').replace(/,$/, '') : s
}
export const r = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d

/**
 * Interpreta lo que escribió la persona. Devuelve todas las lecturas razonables:
 * "1.400" puede ser mil cuatrocientos (formato español) o 1,4 (punto decimal).
 */
export function parseNum(raw: string): number[] {
  let s = raw.trim().replace(/\s|€|\$|%|[a-zA-Z/]/g, '').replace('−', '-')
  if (!s || !/^-?[\d.,]+$/.test(s)) return []
  const hasDot = s.includes('.'), hasComma = s.includes(',')
  const out: number[] = []
  if (hasDot && hasComma) {
    const dec = s.lastIndexOf(',') > s.lastIndexOf('.') ? ',' : '.'
    const th = dec === ',' ? '.' : ','
    out.push(Number(s.split(th).join('').replace(dec, '.')))
  } else if (hasComma) {
    if ((s.match(/,/g) || []).length > 1) out.push(Number(s.split(',').join('')))
    else out.push(Number(s.replace(',', '.')))
  } else if (hasDot) {
    const thousands = /^-?\d{1,3}(\.\d{3})+$/.test(s)
    if (thousands) out.push(Number(s.split('.').join('')))
    if ((s.match(/\./g) || []).length === 1) out.push(Number(s))
  } else out.push(Number(s))
  return out.filter((x) => isFinite(x))
}

const near = (x: number, y: number, tol: number) =>
  y === 0 ? Math.abs(x) < 1e-9 : Math.abs(x - y) <= Math.abs(y) * tol + 1e-9

export interface Verdict { ok: boolean; kind?: ErrKind; msg?: string; close?: boolean }

/** Comprueba la respuesta y diagnostica el tipo de error. */
export function check(step: NumStep, raw: string): Verdict {
  const cands = parseNum(raw)
  if (!cands.length) return { ok: false, msg: 'No pude leer un número. Escribí solo la cifra, por ejemplo 12,5.' }
  const tol = step.tol ?? 0.005
  if (cands.some((c) => near(c, step.a, tol))) return { ok: true }
  const v = cands[0]
  for (const t of step.traps ?? []) if (near(v, t.v, Math.max(tol, 0.006))) return { ok: false, kind: t.kind, msg: t.msg }
  if (step.a !== 0 && v !== 0) {
    if (near(v, -step.a, tol)) return { ok: false, kind: 'interpretacion', msg: 'La cifra es correcta pero el signo no: revisá si se trata de una subida o una bajada, de un coste o de un ingreso.' }
    const ratio = v / step.a
    if (near(ratio, 100, 0.01) || near(ratio, 0.01, 0.01))
      return { ok: false, kind: 'unidades', msg: 'Tu resultado es exactamente 100 veces mayor o menor. Suele pasar al confundir un porcentaje con su decimal (25 % = 0,25) o céntimos con unidades enteras.' }
    if (near(ratio, 1000, 0.01) || near(ratio, 0.001, 0.01))
      return { ok: false, kind: 'unidades', msg: 'Tu resultado difiere en un factor 1.000: revisá gramos ↔ kilos o kilos ↔ toneladas.' }
    if (near(ratio, 10, 0.01) || near(ratio, 0.1, 0.01))
      return { ok: false, kind: 'unidades', msg: 'Tu resultado difiere en un factor 10: probablemente se corrió una coma decimal.' }
    if (near(v, step.a, 0.03))
      return { ok: false, kind: 'calculo', close: true, msg: 'Estás muy cerca: el planteamiento parece correcto. Revisá el redondeo (no redondees los pasos intermedios) o la última operación.' }
  }
  return { ok: false, kind: 'calculo', msg: 'No coincide. Antes de recalcular, comprobá el planteamiento: ¿qué divide a qué, y en qué unidad debe quedar el resultado?' }
}

/** Evaluador seguro de expresiones para la calculadora: + − × ÷ ( ) y % como "÷100". */
export function evalExpr(src: string): number {
  const s = src.replace(/\s/g, '').replace(/×|x|X/g, '*').replace(/÷|:/g, '/').replace(/−/g, '-')
    .replace(/(\d)\.(?=\d{3}(\D|$))/g, '$1').replace(/,/g, '.')
  let i = 0
  const peek = () => s[i]
  function expr(): number { let v = term(); while (peek() === '+' || peek() === '-') { const o = s[i++]; const t = term(); v = o === '+' ? v + t : v - t } return v }
  function term(): number { let v = fact(); while (peek() === '*' || peek() === '/') { const o = s[i++]; const t = fact(); v = o === '*' ? v * t : v / t } return v }
  function fact(): number {
    if (peek() === '-') { i++; return -fact() }
    let v: number
    if (peek() === '(') { i++; v = expr(); if (peek() !== ')') throw new Error('Falta cerrar paréntesis'); i++ }
    else { const m = /^\d*\.?\d+/.exec(s.slice(i)); if (!m) throw new Error('Expresión incompleta'); i += m[0].length; v = Number(m[0]) }
    while (peek() === '%') { i++; v = v / 100 }
    return v
  }
  const v = expr()
  if (i < s.length) throw new Error('No entiendo «' + s[i] + '»')
  if (!isFinite(v)) throw new Error('División por cero')
  return v
}

export const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
export const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)]
