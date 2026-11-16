import { useState } from 'react'
import { CASES, LESSONS, TRACKS, lessonById } from '../content/index.ts'
import { DIAG_SKILLS, SKILL_LESSON } from '../content/misc.ts'
import { SKILLS, skillById } from '../content/skills.ts'
import { Drill, Runner } from '../components/Runner.tsx'
import { Rich } from '../components/Rich.tsx'
import { sceneFor } from './View3D.tsx'
import { check } from '../lib/num.ts'
import { dueSkills, skillSt, today, useStore, type State } from '../lib/store.tsx'
import { SECTORS, type Lesson, type NumStep } from '../lib/types.ts'

const lessonDone = (s: State, l: Lesson) => !!s.read[l.id] && (!l.quiz || !!s.runs['quiz-' + l.id]?.done)

export function Home() {
  const { s } = useStore()
  const due = dueSkills(s).length
  const nextCase = CASES.find((c) => !s.runs['case-' + c.id]?.done)
  const nextLesson = LESSONS.find((l) => !s.read[l.id])
  const started = Object.keys(s.read).length + Object.keys(s.runs).length > 0
  return <>
    <section className="hero">
      <h1>Entrenamiento comercial y logístico agroalimentario</h1>
      <p>Compra → costes → logística → precio de venta → negociación → entrega → cobro → rentabilidad. Con café como recorrido principal, y arroz, pasta, atún y salmón para aprender qué cambia de un producto a otro.</p>
    </section>
    <h2>{started ? 'Seguí donde lo dejaste' : 'Por dónde empezar'}</h2>
    <div className="grid">
      {!s.diag && <a className="tile accent" href="#/diagnostico"><b>1. Diagnóstico inicial</b><span>10 preguntas cortas, sin tiempo ni nota. Sirve para saber qué repasar primero. Podés responder «todavía no lo sé».</span></a>}
      {due > 0 && <a className="tile accent" href="#/repaso"><b>Repaso de hoy: {due} {due === 1 ? 'habilidad' : 'habilidades'}</b><span>Ejercicios cortos de lo que toca recordar hoy (repetición espaciada).</span></a>}
      {nextLesson && <a className="tile" href={'#/leccion/' + nextLesson.id}><b>Siguiente lección</b><span>{nextLesson.title}</span></a>}
      {nextCase && <a className="tile" href={'#/caso/' + nextCase.id}><b>{s.runs['case-' + nextCase.id] ? 'Continuar caso' : 'Siguiente caso'}</b><span>{nextCase.title}</span></a>}
    </div>
    <h2>Recorridos</h2>
    <div className="grid">{(Object.keys(TRACKS) as Lesson['track'][]).map((t) => {
      const ls = LESSONS.filter((l) => l.track === t), d = ls.filter((l) => lessonDone(s, l)).length
      return <a key={t} className={'tile' + (t === 'cafe' ? ' cafe' : '')} href={'#/ruta/' + t}><b>{TRACKS[t].title}</b><span>{TRACKS[t].desc}</span><progress max={ls.length} value={d} /><small>{d} de {ls.length} lecciones</small></a>
    })}
      <a className="tile" href="#/casos"><b>Casos y simulaciones</b><span>{CASES.length} casos en siete fases: comprender, qué falta, a quién consultar, calcular, comparar, decidir, comunicar.</span>
        <progress max={CASES.length} value={CASES.filter((c) => s.runs['case-' + c.id]?.done).length} /><small>{CASES.filter((c) => s.runs['case-' + c.id]?.done).length} de {CASES.length} completados</small></a>
    </div>
    <h2>Cómo funciona</h2>
    <div className="card rich">
      <ul>
        <li><b>Una pregunta por vez.</b> Primero intentás; después podés pedir pistas graduales y, tras al menos un intento, ver la solución.</li>
        <li><b>Diagnóstico del error.</b> Si fallás, la plataforma intenta decirte si fue cálculo, unidades, interpretación o un supuesto equivocado.</li>
        <li><b>Calculadora siempre a mano</b> (botón arriba a la derecha), con la operación exacta para teclear al final de cada ejercicio.</li>
        <li><b>Datos simulados.</b> Todos los precios, costes y tipos de cambio de los ejercicios son inventados con fines didácticos; no son cotizaciones actuales ni históricas.</li>
        <li><b>Tu progreso se guarda en este navegador</b> y, si abrís la plataforma desde su enlace de claude.ai con tu cuenta, se sincroniza con tu teléfono. Detalles y copia de seguridad en <a href="#/progreso">Mi progreso</a>.</li>
        <li><b>Cargas en 3D:</b> palés, camiones y un contenedor de café a escala real, para ver lo que dicen los números.</li>
      </ul>
    </div>
  </>
}

/* ---------- Diagnóstico ---------- */
export function Diagnostico() {
  const { s, set } = useStore()
  const [steps] = useState<NumStep[]>(() => DIAG_SKILLS.map((id) => skillById(id).gen(1)))
  const [i, setI] = useState(0)
  const [val, setVal] = useState('')
  const [res, setRes] = useState<Record<string, boolean>>({})
  const [running, setRunning] = useState(!s.diag)
  const finish = (r: Record<string, boolean>) => {
    set((st) => {
      const skills = { ...st.skills }
      for (const [id, ok] of Object.entries(r)) skills[id] = { ...skillSt(st, id), box: ok ? 2 : 0, level: ok ? 2 : 1, due: ok ? today(3) : today() }
      return { ...st, diag: { date: today(), res: r }, skills }
    })
    setRunning(false)
  }
  const answer = (ok: boolean) => { const r = { ...res, [DIAG_SKILLS[i]]: ok }; setRes(r); setVal(''); if (i + 1 >= steps.length) finish(r); else setI(i + 1) }
  if (!running && s.diag) {
    const r = s.diag.res, bad = DIAG_SKILLS.filter((k) => !r[k])
    const lessons = [...new Set(bad.map((k) => SKILL_LESSON[k]))].map((id) => lessonById(id)!).filter(Boolean)
    return <>
      <h1>Diagnóstico inicial</h1>
      <div className="card">
        <p>Realizado el {s.diag.date}. Resolviste <b>{DIAG_SKILLS.length - bad.length} de {DIAG_SKILLS.length}</b>. No es una nota: es un mapa.</p>
        <ul className="checklist">{DIAG_SKILLS.map((k) => <li key={k}><span className={'dot ' + (r[k] ? 'ok' : 'bad')} />{skillById(k).title} {!r[k] && <a href={'#/practica/' + k}>practicar</a>}</li>)}</ul>
        {lessons.length > 0 ? <><h3>Te recomiendo empezar por</h3><ul>{lessons.map((l) => <li key={l.id}><a href={'#/leccion/' + l.id}>{l.title}</a></li>)}</ul>
          <p className="muted small">Las habilidades pendientes ya están en tu <a href="#/repaso">repaso de hoy</a>.</p></>
          : <p>Buena base. Podés ir directamente al <a href="#/caso/cafe-ofertas">primer caso de café</a>.</p>}
        <button className="btn" onClick={() => { setI(0); setRes({}); setRunning(true) }}>Repetir el diagnóstico</button>
      </div></>
  }
  const st = steps[i]
  return <>
    <h1>Diagnóstico inicial</h1>
    <p className="muted">Pregunta {i + 1} de {steps.length}. Sin tiempo y sin nota. Podés usar la calculadora. Si no sabés por dónde empezar, decilo: es información útil.</p>
    <progress className="wide" max={steps.length} value={i} />
    <div className="card"><div className="question"><Rich text={st.q} /></div>
      <div className="answer"><input inputMode="decimal" value={val} autoFocus placeholder="Tu respuesta" onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && val.trim() && answer(check(st, val).ok)} />
        <span className="unit">{st.unit}</span><button className="btn primary" disabled={!val.trim()} onClick={() => answer(check(st, val).ok)}>Responder</button></div>
      <button className="btn ghost" onClick={() => answer(false)}>Todavía no lo sé</button>
    </div></>
}

/* ---------- Recorridos y lecciones ---------- */
export function Track({ id }: { id: string }) {
  const { s } = useStore()
  const t = TRACKS[id as Lesson['track']]
  if (!t) return <p>Recorrido no encontrado.</p>
  const ls = LESSONS.filter((l) => l.track === id)
  const units = [...new Set(ls.map((l) => l.unit))]
  const related = CASES.filter((c) => (id === 'cafe' ? c.sector === 'cafe' : id === 'sectores' ? ['arroz', 'pasta', 'atun', 'salmon'].includes(c.sector) : id === 'logistica' ? ['cajas-pales', 'incoterms-oferta', 'cafe-retraso'].includes(c.id) : id === 'internacional' ? c.id.startsWith('int-') || ['incoterms-oferta', 'cafe-fijacion'].includes(c.id) : id === 'comercial' ? ['cafe-horeca', 'arroz-licitacion', 'pasta-promo', 'atun-ofertas'].includes(c.id) : false))
  return <>
    <h1>{t.title}</h1><p className="muted">{t.desc}</p>
    {units.map((u) => <section key={u}><h2>{u}</h2><div className="list">{ls.filter((l) => l.unit === u).map((l) =>
      <a key={l.id} href={'#/leccion/' + l.id}><span className={'dot ' + (lessonDone(s, l) ? 'ok' : s.read[l.id] ? 'mid' : '')} /><span><b>{l.title}</b>
        <small>{l.sector !== 'comun' && id !== 'cafe' ? SECTORS[l.sector] + ' · ' : ''}Lectura{l.quiz ? ' + preguntas' : ''}{l.skills ? ' + práctica' : ''}</small></span></a>)}</div></section>)}
    {related.length > 0 && <section><h2>Casos relacionados</h2><div className="list">{related.map((c) => <a key={c.id} href={'#/caso/' + c.id}><span className={'dot ' + (s.runs['case-' + c.id]?.done ? 'ok' : s.runs['case-' + c.id] ? 'mid' : '')} /><span><b>{c.title}</b><small>{c.tipo}</small></span></a>)}</div></section>}
  </>
}

export function LessonPage({ id }: { id: string }) {
  const { s, set } = useStore()
  const l = lessonById(id)
  const [drill, setDrill] = useState<string | null>(null)
  if (!l) return <p>Lección no encontrada.</p>
  const ls = LESSONS.filter((x) => x.track === l.track), pos = ls.indexOf(l), next = ls[pos + 1]
  return <>
    <p className="crumbs"><a href={'#/ruta/' + l.track}>{TRACKS[l.track].title}</a> › {l.unit}</p>
    <h1>{l.title}</h1>
    <article className="card"><Rich text={l.body} /></article>
    {!s.read[l.id] && <button className="btn primary" onClick={() => set((st) => ({ ...st, read: { ...st.read, [l.id]: true } }))}>Marcar como leída</button>}
    {sceneFor(l.id) && <section><h2>Verlo en 3D</h2>{sceneFor(l.id)}</section>}
    {l.quiz && <section><h2>Comprobá que lo entendiste</h2><Runner runId={'quiz-' + l.id} steps={l.quiz} /></section>}
    {l.skills && <section><h2>Práctica</h2>
      <p className="muted">Ejercicios cortos con números que cambian cada vez. Entran automáticamente en tu repaso espaciado.</p>
      <div className="chips">{l.skills.map((k) => <button key={k} className={'chip' + (drill === k ? ' on' : '')} onClick={() => setDrill(k)}>{skillById(k).title}</button>)}</div>
      {drill && <Drill key={drill} skills={[drill]} />}</section>}
    <div className="row between">{next ? <a className="btn" href={'#/leccion/' + next.id}>Siguiente: {next.title} →</a> : <a className="btn" href="#/casos">Ir a los casos →</a>}</div>
  </>
}

export function Practice({ id }: { id: string }) {
  const sk = SKILLS.find((k) => k.id === id)
  if (!sk) return <p>Ejercicio no encontrado.</p>
  return <><h1>Práctica</h1><Drill key={id} skills={[id]} /></>
}

export function Review() {
  const { s } = useStore()
  const [queue] = useState(() => dueSkills(s))
  const seen = Object.keys(s.skills).length
  return <>
    <h1>Repaso de hoy</h1>
    <p className="muted">Repetición espaciada: cada habilidad vuelve tras 1, 3, 7, 14 y 30 días si la resolvés a la primera, y al día siguiente si te costó.</p>
    {queue.length ? <Drill skills={queue} review />
      : <div className="card"><p>{seen ? 'No hay nada pendiente para hoy.' : 'Todavía no hay habilidades en repaso. Aparecen cuando hacés el diagnóstico o la práctica de una lección.'}</p>
        <a className="btn" href={seen ? '#/casos' : '#/diagnostico'}>{seen ? 'Hacer un caso' : 'Hacer el diagnóstico'}</a></div>}
    <h2>Práctica libre</h2>
    <div className="chips">{SKILLS.map((k) => <a key={k.id} className="chip" href={'#/practica/' + k.id}>{k.title}</a>)}</div>
  </>
}

/** Ronda de cálculo mental: sin calculadora y sin reloj. */
export function Mental() {
  const [round, setRound] = useState(0)
  const [queue] = useState(() => SKILLS.filter((k) => k.topic === 'mental').map((k) => k.id))
  const order = [...queue, ...queue].sort(() => Math.random() - 0.5)
  return <>
    <h1>Cálculo mental</h1>
    <p className="muted">Rondas cortas para resolver <b>sin calculadora</b>: porcentajes, márgenes, divisas, plazos y unidades con números pensados para hacerse de cabeza. No hay reloj. Si te trabás, pedí la pista: te da la técnica, no el resultado.</p>
    <div className="card rich"><b>Seis técnicas que cubren casi todo</b><ul>
      <li><b>10 %</b> es correr la coma; de ahí salen el 5 % (mitad), el 20 % (doble) y el 15 % (suma).</li>
      <li><b>Margen del 20 %</b>: sumá un cuarto al coste. <b>25 %</b>: sumá un tercio. <b>50 %</b>: el doble.</li>
      <li><b>¢/lb a USD/t</b>: multiplicá por 22.</li>
      <li><b>Paquetes de 250 g</b>: dividí entre 4. <b>De 500 g</b>: entre 2.</li>
      <li><b>Plazos</b>: tipo anual ÷ 12 = coste de cada mes.</li>
      <li><b>Dólares a euros</b> con el cambio a 1,10: quitá una onceava parte.</li></ul></div>
    <Drill key={round} skills={order} review />
    <button className="btn" onClick={() => setRound(round + 1)}>Empezar otra ronda</button>
  </>
}
