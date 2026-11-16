import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Dim, ErrKind } from './types.ts'

export interface SkillSt { box: number; due: string; level: number; streak: number; seen: number; ok: number }
export interface StepRes { ok: boolean; tries: number; hints: number; revealed: boolean; ans?: string }
export interface RunSt { idx: number; res: Record<string, StepRes>; done?: boolean }
export type FieldStatus = 'aportado' | 'supuesto' | 'pendiente'
export interface MyField { key: string; label: string; unit: string; value: string; status: FieldStatus }
export interface MyCase { id: string; title: string; sector: string; tipo: string; template: string; fields: MyField[]; notes: string; updated: string }

export interface State {
  v: 1
  diag?: { date: string; res: Record<string, boolean> }
  skills: Record<string, SkillSt>
  runs: Record<string, RunSt>
  read: Record<string, boolean>
  errs: Record<ErrKind, number>
  dims: Record<Dim, { ok: number; total: number }>
  myCases: MyCase[]
  drafts: Record<string, string>
  days: Record<string, number>
  /** Momento de la última modificación (ms), para sincronizar entre dispositivos. */
  ts?: number
}

const KEY = 'comerciallog.v1'
export const today = (offset = 0) => {
  const d = new Date(Date.now() + offset * 864e5)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const empty = (): State => ({
  v: 1, skills: {}, runs: {}, read: {},
  errs: { calculo: 0, unidades: 0, interpretacion: 0, supuesto: 0 },
  dims: { calculo: { ok: 0, total: 0 }, unidades: { ok: 0, total: 0 }, razonamiento: { ok: 0, total: 0 }, supuestos: { ok: 0, total: 0 }, interpretacion: { ok: 0, total: 0 } },
  myCases: [], drafts: {}, days: {},
})

/** Devuelve el estado guardado y si el almacenamiento del navegador está disponible. */
function load(): { state: State; storageOk: boolean } {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { state: empty(), storageOk: true }
    const p = JSON.parse(raw)
    return { state: { ...empty(), ...p }, storageOk: true }
  } catch { return { state: empty(), storageOk: false } }
}

export type Sync = 'local' | 'conectando' | 'activa' | 'error'
interface Ctx { s: State; set: (fn: (s: State) => State) => void; storageOk: boolean; sync: Sync }
const C = createContext<Ctx>(null as unknown as Ctx)

/* ---------- Sincronización opcional (solo cuando la página se abre dentro de claude.ai) ---------- */
interface DocRef { get(): Promise<{ exists: boolean; data(): Record<string, unknown> | undefined }>; set(d: Record<string, unknown>): Promise<void> }
async function cloudDoc(): Promise<DocRef | null> {
  const c = (window as unknown as { claude?: { use(n: string): Promise<unknown> } }).claude
  if (!c?.use) return null
  const [db, user] = await Promise.all([c.use('db'), c.use('user')]) as [{ collection(p: string): { doc(k: string): DocRef } } | null, { id(): Promise<string | null> } | null]
  const id = await user?.id()
  return db && id ? db.collection('data/users/' + id).doc('progreso') : null
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const init = useRef(load())
  const [s, setS] = useState(init.current.state)
  const [storageOk, setOk] = useState(init.current.storageOk)
  const [sync, setSync] = useState<Sync>('local')
  const doc = useRef<DocRef | null>(null)
  const latest = useRef(s); latest.current = s
  const pushed = useRef(0)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); setOk(true) } catch { setOk(false) }
  }, [s])
  // Al abrir y al volver a la pestaña: quedarse con la versión más reciente (la última modificación gana).
  useEffect(() => {
    let alive = true
    const pull = async () => {
      try {
        if (!doc.current) { setSync('conectando'); doc.current = await cloudDoc(); if (!doc.current) { if (alive) setSync('local'); return } }
        const snap = await doc.current.get(), d = snap.exists ? snap.data() : undefined
        const remoteTs = Number(d?.ts ?? 0), localTs = latest.current.ts ?? 0
        if (!alive) return
        if (d && typeof d.json === 'string' && remoteTs > localTs) { pushed.current = remoteTs; setS({ ...empty(), ...JSON.parse(d.json) }) }
        setSync('activa')
      } catch { if (alive) setSync(doc.current ? 'error' : 'local') }
    }
    void pull()
    const vis = () => { if (document.visibilityState === 'visible') void pull() }
    document.addEventListener('visibilitychange', vis)
    return () => { alive = false; document.removeEventListener('visibilitychange', vis) }
  }, [])
  // Subir los cambios con una pausa, de a una escritura por vez.
  useEffect(() => {
    if (sync !== 'activa' || !s.ts || s.ts <= pushed.current) return
    const t = setTimeout(() => {
      const cur = latest.current, json = JSON.stringify(cur)
      if (!doc.current || !cur.ts || json.length > 200_000) return
      const ts = cur.ts
      doc.current.set({ ts, json }).then(() => { pushed.current = Math.max(pushed.current, ts) }).catch(() => setSync('error'))
    }, 2500)
    return () => clearTimeout(t)
  }, [s, sync])
  return <C.Provider value={{ s, set: (fn) => setS((p) => ({ ...fn(p), ts: Date.now() })), storageOk, sync }}>{children}</C.Provider>
}
export const useStore = () => useContext(C)

/* ---------- Repetición espaciada (cajas de Leitner) ---------- */
export const INTERVALS = [0, 1, 3, 7, 14, 30]
export const skillSt = (s: State, id: string): SkillSt => s.skills[id] ?? { box: 0, due: today(), level: 1, streak: 0, seen: 0, ok: 0 }

/** Actualiza una habilidad tras un ejercicio. clean = correcto al primer intento y sin pistas. */
export function rateSkill(s: State, id: string, res: StepRes): State {
  const k = { ...skillSt(s, id) }
  const clean = res.ok && res.tries === 1 && res.hints === 0
  k.seen++
  if (res.ok) k.ok++
  if (clean) { k.box = Math.min(5, k.box + 1); k.streak++; if (k.streak >= 2 && k.level < 3) { k.level++; k.streak = 0 } }
  else if (res.ok) { k.box = Math.max(1, k.box); k.streak = 0 }
  else { k.box = 1; k.streak = 0; k.level = Math.max(1, k.level - 1) }
  k.due = today(INTERVALS[k.box])
  return { ...s, skills: { ...s.skills, [id]: k } }
}
export const dueSkills = (s: State) => Object.entries(s.skills).filter(([, k]) => k.due <= today()).sort((a, b) => a[1].box - b[1].box).map(([id]) => id)

export function logErr(s: State, kind: ErrKind): State { return { ...s, errs: { ...s.errs, [kind]: s.errs[kind] + 1 } } }
export function logDim(s: State, dim: Dim, ok: boolean): State {
  const d = s.dims[dim]
  return { ...s, dims: { ...s.dims, [dim]: { ok: d.ok + (ok ? 1 : 0), total: d.total + 1 } }, days: { ...s.days, [today()]: (s.days[today()] ?? 0) + 1 } }
}
