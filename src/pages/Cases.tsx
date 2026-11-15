import { CASES, caseById } from '../content/index.ts'
import { Runner } from '../components/Runner.tsx'
import { Rich } from '../components/Rich.tsx'
import { useStore } from '../lib/store.tsx'
import { PHASES, SECTORS } from '../lib/types.ts'
import { ContainerScene, RoastScene } from '../components/Scene3D.tsx'
import { PalesPresets, sceneFor } from './View3D.tsx'

export function CasesList() {
  const { s } = useStore()
  const cafe = CASES.filter((c) => c.sector === 'cafe').length
  return <>
    <h1>Casos y simulaciones</h1>
    <p className="muted">{CASES.length} casos, {cafe} de café. Cada uno recorre las siete fases: {Object.values(PHASES).join(' → ').toLowerCase()}. Los datos aparecen progresivamente.</p>
    <div className="list">{CASES.map((c) => { const r = s.runs['case-' + c.id]; return <a key={c.id} href={'#/caso/' + c.id}>
      <span className={'dot ' + (r?.done ? 'ok' : r ? 'mid' : '')} />
      <span><b>{c.title}</b><small><span className={'tag sec ' + c.sector}>{SECTORS[c.sector]}</span> {c.tipo} · Nivel {c.level} · {c.steps.length} preguntas{r && !r.done ? ` · vas por la ${Math.min(r.idx + 1, c.steps.length)}` : ''}</small>
        <em>{c.summary}</em></span></a> })}</div>
  </>
}

export function CasePage({ id }: { id: string }) {
  const c = caseById(id)
  if (!c) return <p>Caso no encontrado.</p>
  return <>
    <p className="crumbs"><a href="#/casos">Casos</a> › <span className={'tag sec ' + c.sector}>{SECTORS[c.sector]}</span> {c.tipo}</p>
    <h1>{c.title}</h1>
    <details className="card brief" open><summary>Situación</summary><Rich text={c.brief} /></details>
    {c.id === 'cajas-pales' && <details className="card brief"><summary>Verlo en 3D: los palés del escenario 2</summary><PalesPresets /></details>}
    {c.id === 'cafe-ofertas' && <details className="card brief"><summary>Verlo en 3D: 320 sacos en un contenedor</summary><ContainerScene sacos={320} kgSaco={60} /></details>}
    {c.id === 'cafe-integrador' && <details className="card brief"><summary>Verlo en 3D: del verde a los 40.000 paquetes</summary><RoastScene sacos={199} merma={16} gramos={250} /></details>}
    {sceneFor(c.id) && <details className="brief scenebox"><summary>Verlo en 3D</summary>{sceneFor(c.id)}</details>}
    <Runner runId={'case-' + c.id} steps={c.steps} showPhases />
  </>
}
