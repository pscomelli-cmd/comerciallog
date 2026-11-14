import { useRef, useState } from 'react'
import { ConfirmButton } from '../components/Confirm.tsx'
import { CASES, LESSONS } from '../content/index.ts'
import { SKILLS } from '../content/skills.ts'
import { empty, today, useStore, type State } from '../lib/store.tsx'
import { DIM_LABEL, ERR_LABEL, type Dim, type ErrKind } from '../lib/types.ts'

export function Progress() {
  const { s, set, storageOk } = useStore()
  const file = useRef<HTMLInputElement>(null)
  const [txt, setTxt] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const casesDone = CASES.filter((c) => s.runs['case-' + c.id]?.done).length
  const read = LESSONS.filter((l) => s.read[l.id]).length
  const totalEx = Object.values(s.days).reduce((a, b) => a + b, 0)
  const errTotal = Object.values(s.errs).reduce((a, b) => a + b, 0)
  const practised = SKILLS.filter((k) => s.skills[k.id])
  const exportJson = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(s, null, 1)], { type: 'application/json' })); a.download = `comerciallog-progreso-${today()}.json`; a.click(); URL.revokeObjectURL(a.href) }
  const restore = (raw: string) => { try { const p = JSON.parse(raw) as State; if (p.v !== 1 || !p.skills || !p.runs) throw new Error(); set(() => ({ ...empty(), ...p })); setMsg('Copia restaurada.'); setTxt(null) } catch { setMsg('Ese contenido no es una copia de progreso válida de ComercialLog.') } }
  return <>
    <h1>Mi progreso</h1>
    <div className="stats"><div><b>{read}</b><span>de {LESSONS.length} lecciones leídas</span></div><div><b>{casesDone}</b><span>de {CASES.length} casos completados</span></div><div><b>{totalEx}</b><span>preguntas respondidas</span></div><div><b>{Object.keys(s.days).length}</b><span>días de práctica</span></div></div>

    <h2>Evaluación por dimensión</h2>
    <div className="card">{totalEx ? <div className="bars">{(Object.keys(DIM_LABEL) as Dim[]).map((d) => { const v = s.dims[d]; return <div key={d} className="bar"><span>{DIM_LABEL[d]}</span><progress max={Math.max(1, v.total)} value={v.ok} /><b>{v.total ? Math.round((v.ok / v.total) * 100) + ' %' : '—'}</b></div> })}</div> : <p className="muted">Todavía no hay datos. Aparecen al responder preguntas.</p>}
      <p className="small muted">Porcentaje de preguntas de cada tipo resueltas sin ver la solución.</p></div>

    <h2>Tipos de error detectados</h2>
    <div className="card">{errTotal ? <div className="bars">{(Object.keys(ERR_LABEL) as ErrKind[]).map((k) => <div key={k} className="bar"><span>{ERR_LABEL[k]}</span><progress max={errTotal} value={s.errs[k]} /><b>{s.errs[k]}</b></div>)}</div> : <p className="muted">Sin errores registrados todavía.</p>}
      <p className="small muted">Cuenta cada intento fallido. Si un tipo destaca, ahí está tu mejor inversión de tiempo.</p></div>

    <h2>Habilidades en repaso espaciado</h2>
    <div className="card">{practised.length ? <div className="tablewrap"><table><thead><tr><th>Habilidad</th><th>Nivel</th><th>Caja</th><th>Aciertos</th><th>Próximo repaso</th></tr></thead>
      <tbody>{practised.map((k) => { const x = s.skills[k.id]; return <tr key={k.id}><td><a href={'#/practica/' + k.id}>{k.title}</a></td><td>{x.level}/3</td><td>{x.box}/5</td><td>{x.ok}/{x.seen}</td><td>{x.due <= today() ? 'hoy' : x.due}</td></tr> })}</tbody></table></div>
      : <p className="muted">Hacé el <a href="#/diagnostico">diagnóstico</a> o la práctica de una lección para empezar.</p>}</div>

    <h2>Dónde se guarda tu progreso</h2>
    <div className="card rich">
      <p>Estado del guardado: <b>{storageOk ? 'activo en este navegador' : 'no disponible (el navegador lo bloquea)'}</b>.</p>
      <ul>
        <li>Todo (respuestas, repaso, «Mis casos», borradores de correos) se guarda en el <b>almacenamiento local de este navegador</b>, en este dispositivo. No hay cuenta ni servidor: nada sale de tu equipo.</li>
        <li><b>No se sincroniza.</b> En otro navegador, otro ordenador o el móvil, empezás de cero, salvo que importes una copia.</li>
        <li><b>Se pierde</b> si borrás los datos de navegación o del sitio, si usás una ventana privada, o si el navegador limpia el almacenamiento por falta de uso o de espacio (algunos navegadores móviles lo hacen tras varias semanas sin visitar la página).</li>
        <li>Está ligado a la <b>dirección web</b> exacta: si la plataforma se publica en otra dirección, el progreso no la sigue.</li>
        <li>No está cifrado: quien use este navegador puede verlo.</li>
      </ul>
      <p>Para no depender de eso, descargá una copia de vez en cuando:</p>
      <div className="row"><button className="btn primary" onClick={exportJson}>Descargar copia de seguridad</button>
        <button className="btn" onClick={() => file.current?.click()}>Restaurar desde una copia</button>
        <input ref={file} type="file" accept="application/json" hidden onChange={(e) => { const fl = e.target.files?.[0]; if (fl) void fl.text().then(restore); e.target.value = '' }} />
        <button className="btn" onClick={() => setTxt(txt === null ? JSON.stringify(s) : null)}>{txt === null ? 'Copiar o pegar como texto' : 'Ocultar texto'}</button>
        <ConfirmButton label="Borrar todo" onConfirm={() => { set(() => empty()); setMsg('Progreso borrado.') }} /></div>
      {txt !== null && <><p className="small muted">Si la descarga no funciona en tu navegador: copiá este texto y guardalo en una nota. Para restaurar, pegá aquí una copia anterior y pulsá el botón. Restaurar reemplaza el progreso actual.</p>
        <textarea className="backup" rows={5} value={txt} onChange={(e) => setTxt(e.target.value)} onFocus={(e) => e.target.select()} />
        <button className="btn small" onClick={() => restore(txt)}>Restaurar desde este texto</button></>}
      {msg && <p><b>{msg}</b></p>}
    </div>
  </>
}
