import { useState } from 'react'
import { ERR_LABEL, type ChoiceStep, type ErrKind, type NumStep, type Step, type WriteStep } from '../lib/types.ts'
import { check, f, type Verdict } from '../lib/num.ts'
import type { StepRes } from '../lib/store.tsx'
import { useStore } from '../lib/store.tsx'
import { Rich, inline } from './Rich.tsx'

interface Props {
  step: Step
  saved?: StepRes
  onResult: (r: StepRes) => void
  onErr?: (k: ErrKind) => void
  onNext?: () => void
  nextLabel?: string
}

export function StepCard(p: Props) {
  const { step } = p
  return <div className="step">
    {step.intro && <Rich text={step.intro} />}
    {step.data && <div className="newdata"><span className="tag sim">Datos nuevos · simulados</span>
      <ul>{step.data.map((d, i) => <li key={i}><span>{d.label}</span><b>{d.value}</b></li>)}</ul></div>}
    <div className="question"><Rich text={step.q} /></div>
    {step.kind === 'num' ? <NumBody {...p} step={step} /> : step.kind === 'choice' ? <ChoiceBody {...p} step={step} /> : <WriteBody {...p} step={step} />}
  </div>
}

function Next({ p }: { p: Props }) {
  return p.onNext ? <button className="btn primary" autoFocus onClick={p.onNext}>{p.nextLabel ?? 'Siguiente pregunta →'}</button> : null
}
function Means({ step }: { step: Step }) {
  return step.means ? <div className="means"><b>Qué significa y para qué sirve</b><Rich text={step.means} /></div> : null
}

function NumBody(p: Props & { step: NumStep }) {
  const { step, saved } = p
  const [val, setVal] = useState(saved?.ans ?? '')
  const [tries, setTries] = useState(saved?.tries ?? 0)
  const [hints, setHints] = useState(saved?.hints ?? 0)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [done, setDone] = useState<null | 'ok' | 'rev'>(saved ? (saved.revealed ? 'rev' : 'ok') : null)

  const submit = () => {
    if (done || !val.trim()) return
    const v = check(step, val)
    setVerdict(v)
    if (!v.ok && !v.kind) return // no se pudo leer: no cuenta como intento
    const t = tries + 1
    setTries(t)
    if (v.ok) { setDone('ok'); p.onResult({ ok: true, tries: t, hints, revealed: false, ans: val }) }
    else if (v.kind) p.onErr?.(v.kind)
  }
  const reveal = () => { setDone('rev'); p.onResult({ ok: false, tries, hints, revealed: true, ans: val }) }

  return <>
    <div className="answer">
      <input inputMode="decimal" value={val} disabled={!!done} placeholder="Tu respuesta" aria-label="Tu respuesta"
        onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      {step.unit && <span className="unit">{step.unit}</span>}
      {!done && <button className="btn primary" onClick={submit}>Comprobar</button>}
    </div>
    {!done && verdict && !verdict.ok && <div className="fb bad">
      {verdict.kind && <span className={'tag err ' + verdict.kind}>{ERR_LABEL[verdict.kind]}</span>}
      <p>{verdict.msg}</p></div>}
    {!done && <div className="row">
      {hints < step.hints.length && <button className="btn" onClick={() => setHints(hints + 1)}>Pedir pista ({hints + 1} de {step.hints.length})</button>}
      <button className="btn ghost" disabled={tries === 0} title={tries === 0 ? 'Primero intentá una respuesta' : ''} onClick={reveal}>
        {tries === 0 ? 'Ver solución (después de un intento)' : 'Ver solución'}</button>
    </div>}
    {hints > 0 && !done && <ol className="hints">{step.hints.slice(0, hints).map((h, i) => <li key={i}>{inline(h)}</li>)}</ol>}
    {done && <div className={'fb ' + (done === 'ok' ? 'good' : 'neutral')}>
      <p><b>{done === 'ok' ? (tries === 1 && hints === 0 ? 'Correcto, a la primera.' : 'Correcto.') : 'Solución'}</b>{' '}
        Resultado: <b>{f(step.a, Number.isInteger(step.a) ? 0 : Math.abs(step.a) < 10 ? 4 : 2)} {step.unit}</b></p>
      <div className="solution"><b>Resolución escrita</b><ol>{step.sol.map((x, i) => <li key={i}>{inline(x)}</li>)}</ol></div>
      {step.keys && <p className="keys"><b>En la calculadora:</b> <code>{step.keys}</code></p>}
      {step.mental && <p><b>Cálculo mental:</b> {inline(step.mental)}</p>}
      {step.excel && <p className="keys"><b>En Excel (italiano):</b> <code>{step.excel}</code></p>}
      <Means step={step} />
      <Next p={p} />
    </div>}
  </>
}

function ChoiceBody(p: Props & { step: ChoiceStep }) {
  const { step, saved } = p
  const [sel, setSel] = useState<number[]>([])
  const [tries, setTries] = useState(saved?.tries ?? 0)
  const [hints, setHints] = useState(0)
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState<null | 'ok' | 'rev'>(saved ? (saved.revealed ? 'rev' : 'ok') : null)
  const toggle = (i: number) => { if (done) return; setMsg(''); setSel(step.multi ? (sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i]) : [i]) }
  const finish = (ok: boolean, t: number) => { setDone(ok ? 'ok' : 'rev'); p.onResult({ ok, tries: t, hints, revealed: !ok }) }
  const submit = () => {
    if (!sel.length) return
    const t = tries + 1; setTries(t)
    if (step.multi) {
      const missing = step.opts.filter((o, i) => o.g === 'ok' && !sel.includes(i)).length
      const wrong = sel.filter((i) => step.opts[i].g === 'no').length
      if (!missing && !wrong) return finish(true, t)
      p.onErr?.('interpretacion')
      setMsg([wrong ? `Marcaste ${wrong} opción(es) que no corresponde(n).` : '', missing ? `Te falta(n) ${missing} por marcar.` : ''].join(' ') + ' Revisá y volvé a intentar.')
    } else {
      const o = step.opts[sel[0]]
      if (o.g === 'no') { p.onErr?.('interpretacion'); setMsg(o.fb); setSel([]) } else finish(true, t)
    }
  }
  const chosen = sel.length === 1 && !step.multi ? step.opts[sel[0]] : null
  return <>
    {step.multi && <p className="muted small">Podés marcar varias opciones.</p>}
    <div className="opts">{step.opts.map((o, i) => {
      const show = done && (step.multi || o.g !== 'no' || sel.includes(i))
      return <label key={i} className={'opt' + (sel.includes(i) ? ' sel' : '') + (show ? ' g-' + o.g : '')}>
        <input type={step.multi ? 'checkbox' : 'radio'} name={step.id} checked={sel.includes(i)} disabled={!!done} onChange={() => toggle(i)} />
        <span>{inline(o.t)}{show && <small><b>{o.g === 'ok' ? (step.multi ? 'Corresponde. ' : 'Opción más sólida. ') : o.g === 'alt' ? 'Razonable, con matices. ' : 'No corresponde. '}</b>{inline(o.fb)}</small>}</span>
      </label>
    })}</div>
    {!done && msg && <div className="fb bad"><p>{inline(msg)}</p></div>}
    {!done && <div className="row">
      <button className="btn primary" disabled={!sel.length} onClick={submit}>Comprobar</button>
      {step.hints && hints < step.hints.length && <button className="btn" onClick={() => setHints(hints + 1)}>Pedir pista</button>}
      {tries >= 1 && <button className="btn ghost" onClick={() => finish(false, tries)}>Ver solución</button>}
    </div>}
    {hints > 0 && !done && step.hints && <ol className="hints">{step.hints.slice(0, hints).map((h, i) => <li key={i}>{inline(h)}</li>)}</ol>}
    {done && <div className={'fb ' + (done === 'ok' ? 'good' : 'neutral')}>
      {chosen?.g === 'alt' && <p><b>Decisión razonable.</b> No hay una única respuesta correcta: mirá arriba las ventajas y consecuencias de cada alternativa.</p>}
      {chosen?.g === 'ok' && <p><b>Bien razonado.</b></p>}
      {step.multi && <p><b>{done === 'ok' ? 'Correcto.' : 'Solución marcada arriba.'}</b></p>}
      <Means step={step} /><Next p={p} /></div>}
  </>
}

function WriteBody(p: Props & { step: WriteStep }) {
  const { step, saved } = p
  const { s, set } = useStore()
  const text = s.drafts[step.id] ?? ''
  const [shown, setShown] = useState(!!saved)
  const [marks, setMarks] = useState<boolean[]>(step.checklist.map(() => false))
  const [done, setDone] = useState(!!saved)
  return <>
    <textarea rows={6} value={text} placeholder="Escribí tu versión antes de ver el modelo…"
      onChange={(e) => set((st) => ({ ...st, drafts: { ...st.drafts, [step.id]: e.target.value } }))} />
    {!shown && <div className="row"><button className="btn primary" disabled={text.trim().length < 20} onClick={() => setShown(true)}>Comparar con el modelo</button>
      <span className="muted small">Se habilita cuando escribís al menos un par de frases.</span></div>}
    {shown && <div className="fb neutral">
      <b>Autoevaluación: ¿tu texto incluye…?</b>
      <div className="opts">{step.checklist.map((c, i) => <label key={i} className="opt"><input type="checkbox" disabled={done} checked={marks[i]} onChange={() => setMarks(marks.map((m, j) => (j === i ? !m : m)))} /><span>{inline(c)}</span></label>)}</div>
      <div className="solution"><b>Un modelo posible</b><Rich text={step.model} /></div>
      <p className="muted small">La plataforma no corrige redacción automáticamente: compará vos con la lista y el modelo.</p>
      {!done ? <button className="btn primary" onClick={() => { setDone(true); p.onResult({ ok: marks.filter(Boolean).length >= Math.ceil(marks.length * 0.6), tries: 1, hints: 0, revealed: false }) }}>Guardar autoevaluación</button>
        : <><Means step={step} /><Next p={p} /></>}
    </div>}
  </>
}
