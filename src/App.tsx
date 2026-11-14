import { useEffect, useState } from 'react'
import { Calculator } from './components/Calculator.tsx'
import { dueSkills, useStore } from './lib/store.tsx'
import { lessonById } from './content/index.ts'
import { Home, Diagnostico, Track, LessonPage, Practice, Review } from './pages/Learn.tsx'
import { CasesList, CasePage } from './pages/Cases.tsx'
import { Tools } from './pages/Tools.tsx'
import { ExcelPage, Comms, Glossary } from './pages/Reference.tsx'
import { MyCases } from './pages/MyCases.tsx'
import { Progress } from './pages/Progress.tsx'

const NAV: [string, [string, string][]][] = [
  ['Empezar', [['', 'Inicio'], ['diagnostico', 'Diagnóstico inicial'], ['repaso', 'Repaso de hoy']]],
  ['Aprender', [['ruta/bases', 'Bases matemáticas'], ['ruta/cafe', 'Recorrido de café'], ['ruta/sectores', 'Arroz, pasta, atún, salmón'], ['ruta/logistica', 'Logística e Incoterms'], ['ruta/comercial', 'Gestión comercial']]],
  ['Practicar', [['casos', 'Casos y simulaciones'], ['mis-casos', 'Mis casos'], ['correos', 'Correos en 4 idiomas']]],
  ['Consultar', [['herramientas', 'Calculadoras'], ['excel', 'Excel en italiano'], ['glosario', 'Glosario'], ['progreso', 'Mi progreso']]],
]

export const go = (path: string) => { window.location.hash = '#/' + path }
const read = () => window.location.hash.replace(/^#\/?/, '')

export function App() {
  const [path, setPath] = useState(read())
  const [menu, setMenu] = useState(false)
  const [calc, setCalc] = useState(() => window.innerWidth > 1100)
  const { s, storageOk } = useStore()
  useEffect(() => { const h = () => { setPath(read()); setMenu(false); window.scrollTo(0, 0) }; window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h) }, [])
  const [a, b] = path.split('/')
  const due = dueSkills(s).length
  const active = a === 'caso' ? 'casos' : a === 'leccion' ? 'ruta/' + (lessonById(b)?.track ?? '') : a === 'practica' ? 'repaso' : path
  const page = a === '' ? <Home /> : a === 'diagnostico' ? <Diagnostico /> : a === 'ruta' ? <Track id={b} /> : a === 'leccion' ? <LessonPage id={b} />
    : a === 'practica' ? <Practice id={b} /> : a === 'repaso' ? <Review /> : a === 'casos' ? <CasesList /> : a === 'caso' ? <CasePage id={b} />
    : a === 'herramientas' ? <Tools /> : a === 'excel' ? <ExcelPage /> : a === 'correos' ? <Comms /> : a === 'glosario' ? <Glossary />
    : a === 'mis-casos' ? <MyCases /> : a === 'progreso' ? <Progress /> : <Home />
  return <div className="shell">
    <header className="top">
      <button className="burger" onClick={() => setMenu(!menu)} aria-label="Menú">☰</button>
      <a className="brand" href="#/">Comercial<b>Log</b></a>
      <button className={'btn small' + (calc ? ' on' : '')} onClick={() => setCalc(!calc)}>{calc ? 'Ocultar calculadora' : 'Calculadora'}</button>
    </header>
    <nav className={'side' + (menu ? ' open' : '')}>{NAV.map(([g, items]) => <div key={g}><h4>{g}</h4>
      {items.map(([p, label]) => <a key={p} href={'#/' + p} className={active === p ? 'on' : ''}>{label}{p === 'repaso' && due > 0 && <span className="badge">{due}</span>}</a>)}</div>)}
      <p className="small muted sidefoot">Precios y datos de los ejercicios: <b>simulados</b>.</p></nav>
    {menu && <div className="scrim" onClick={() => setMenu(false)} />}
    <main className={calc ? 'withcalc' : ''}>
      {!storageOk && <div className="note warn">Este navegador no permite guardar datos (modo privado o almacenamiento bloqueado). Podés usar la plataforma, pero el progreso se perderá al cerrar la pestaña.</div>}
      {page}
    </main>
    {calc && <Calculator onClose={() => setCalc(false)} />}
  </div>
}
