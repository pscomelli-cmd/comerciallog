import { useState } from 'react'
import { DIM_LABEL, PHASES, type Datum, type Dim, type Phase, type Step } from '../lib/types.ts'
import { logDim, logErr, rateSkill, skillSt, useStore, type RunSt, type StepRes } from '../lib/store.tsx'
import { skillById } from '../content/skills.ts'
import { StepCard } from './StepCard.tsx'
import { inline } from './Rich.tsx'

const clean = (r?: StepRes) => !!r && r.ok && r.tries === 1 && r.hints === 0

/** Recorre una lista fija de pasos, uno por vez, guardando el avance. */
export function Runner({ runId, steps, showPhases, onDone, extraData }: { runId: string; steps: Step[]; showPhases?: boolean; onDone?: () => void; extraData?: Datum[] }) {
  const { s, set } = useStore()
  const run: RunSt = s.runs[runId] ?? { idx: 0, res: {} }
  const [showPrev, setShowPrev] = useState(false)
  const idx = Math.min(run.idx, steps.length)
  const step = steps[idx]
  const upd = (fn: (r: RunSt) => RunSt) => set((st) => ({ ...st, runs: { ...st.runs, [runId]: fn(st.runs[runId] ?? { idx: 0, res: {} }) } }))
  const data = [...(extraData ?? []), ...steps.slice(0, idx + 1).flatMap((x) => x.data ?? [])]

  if (!step) return <Summary steps={steps} run={run} onRestart={() => upd(() => ({ idx: 0, res: {} }))} />
  return <div className="runner">
    {showPhases && step.phase && <ol className="phases">{([1, 2, 3, 4, 5, 6, 7] as Phase[]).map((p) =>
      <li key={p} className={p === step.phase ? 'on' : ''} title={PHASES[p]}><span>{p}</span><em>{PHASES[p]}</em></li>)}</ol>}
    <div className="runhead"><span>Pregunta {idx + 1} de {steps.length}</span>
      <progress max={steps.length} value={idx} />
      {idx > 0 && <button className="link" onClick={() => setShowPrev(!showPrev)}>{showPrev ? 'Ocultar anteriores' : 'Ver respuestas anteriores'}</button>}</div>
    {showPrev && <ol className="prev">{steps.slice(0, idx).map((x) => { const r = run.res[x.id]; return <li key={x.id}>
      <span className={'dot ' + (clean(r) ? 'ok' : r?.ok ? 'mid' : 'bad')} />{inline(x.q.split('\n')[0].slice(0, 140))}
      {x.kind === 'num' && <b> → {x.a.toLocaleString('es-ES', { maximumFractionDigits: 3 })} {x.unit}</b>}</li> })}</ol>}
    <div className="runbody">
      <div className="card"><StepCard key={step.id} step={step} saved={run.res[step.id]}
        onErr={(k) => set((st) => logErr(st, k))}
        onResult={(r) => { upd((ru) => ({ ...ru, res: { ...ru.res, [step.id]: r } })); if (step.dim) set((st) => logDim(st, step.dim as Dim, r.ok)) }}
        onNext={() => { const last = idx + 1 >= steps.length; upd((ru) => ({ ...ru, idx: idx + 1, done: last || ru.done })); if (last) onDone?.(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        nextLabel={idx + 1 >= steps.length ? 'Terminar y ver evaluación →' : undefined} /></div>
      {data.length > 0 && <aside className="datapanel"><b>Ficha de datos del caso</b>
        <p className="small"><span className="tag sim">Simulados</span> salvo indicación. Aparecen a medida que avanzás.</p>
        <dl>{data.map((d, i) => <div key={i}><dt>{d.label}</dt><dd>{d.value}</dd></div>)}</dl></aside>}
    </div>
  </div>
}

function Summary({ steps, run, onRestart }: { steps: Step[]; run: RunSt; onRestart: () => void }) {
  const dims: Partial<Record<Dim, { ok: number; total: number }>> = {}
  let ok = 0, cl = 0
  for (const st of steps) {
    const r = run.res[st.id]; if (r?.ok) ok++; if (clean(r)) cl++
    if (st.dim) { const d = (dims[st.dim] ??= { ok: 0, total: 0 }); d.total++; if (r?.ok) d.ok++ }
  }
  const weak = (Object.entries(dims) as [Dim, { ok: number; total: number }][]).filter(([, d]) => d.ok < d.total).sort((a, b) => a[1].ok / a[1].total - b[1].ok / b[1].total)[0]
  return <div className="card">
    <h3>Evaluación</h3>
    <p>Resolviste <b>{ok} de {steps.length}</b> preguntas sin mirar la solución; <b>{cl}</b> a la primera y sin pistas.</p>
    <div className="bars">{(Object.entries(dims) as [Dim, { ok: number; total: number }][]).map(([d, v]) => <div key={d} className="bar"><span>{DIM_LABEL[d]}</span><progress max={v.total} value={v.ok} /><b>{v.ok}/{v.total}</b></div>)}</div>
    {weak ? <p>Punto a reforzar: <b>{DIM_LABEL[weak[0]]}</b>. {ADVICE[weak[0]]}</p> : <p>Sin puntos débiles en este recorrido. Podés subir de nivel.</p>}
    <p className="muted small">Pedir pistas no penaliza: forman parte del método. Lo que cuenta es entender por qué.</p>
    <button className="btn" onClick={onRestart}>Repetir desde el principio</button>
  </div>
}
const ADVICE: Record<Dim, string> = {
  calculo: 'Escribí cada operación con su resultado intermedio y no redondees hasta el final.',
  unidades: 'Anotá la unidad junto a cada número y comprobá que el resultado queda en la unidad pedida.',
  razonamiento: 'Antes de calcular, formulá en una frase qué se está preguntando y qué orden de pasos lleva hasta ahí.',
  supuestos: 'Para cada dato, preguntate de dónde sale y qué estás dando por hecho (merma, redondeos, costes fijos o variables).',
  interpretacion: 'Después de cada resultado, decí en voz alta qué significa para el negocio y sobre qué base está calculado.',
}

/** Práctica generativa con repetición espaciada: una pregunta por vez, dificultad adaptativa. */
export function Drill({ skills, review }: { skills: string[]; review?: boolean }) {
  const { s, set } = useStore()
  const [n, setN] = useState(0)
  const [queue] = useState(() => [...skills])
  const id = queue[n % queue.length]
  const sk = skillById(id)
  const st = skillSt(s, id)
  const [step, setStep] = useState(() => sk.gen(st.level))
  const [count, setCount] = useState(0)
  if (review && n >= queue.length) return <div className="card"><h3>Repaso de hoy completado</h3><p>Resolviste {count} ejercicios. Las habilidades acertadas a la primera volverán a aparecer dentro de más días; las que costaron, mañana.</p></div>
  return <div>
    <div className="runhead"><span><b>{sk.title}</b></span><span className="muted small">Nivel {st.level} de 3 · caja de repaso {st.box} de 5{review ? ` · ${n + 1} de ${queue.length}` : ''}</span></div>
    <div className="card"><StepCard key={n} step={step}
      onErr={(k) => set((x) => logErr(x, k))}
      onResult={(r) => { setCount(count + 1); set((x) => logDim(rateSkill(x, id, r), step.dim ?? 'calculo', r.ok)) }}
      onNext={() => { const nn = n + 1; setN(nn); if (!review || nn < queue.length) { const nid = queue[nn % queue.length]; setStep(skillById(nid).gen(skillSt(s, nid).level)) } }}
      nextLabel={review ? 'Siguiente →' : 'Otro ejercicio →'} /></div>
    <p className="muted small">Los números cambian cada vez. La dificultad sube tras dos aciertos seguidos a la primera y baja si necesitás ver la solución. Sin límite de tiempo.</p>
  </div>
}
