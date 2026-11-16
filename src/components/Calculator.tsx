import { useState } from 'react'
import { evalExpr, g } from '../lib/num.ts'

const KEYS = ['7', '8', '9', '÷', '(', '4', '5', '6', '×', ')', '1', '2', '3', '−', '%', '0', ',', 'Ans', '+', '=']

export function Calculator({ onClose }: { onClose: () => void }) {
  const [expr, setExpr] = useState('')
  const [tape, setTape] = useState<{ e: string; r: string }[]>([])
  const [err, setErr] = useState('')
  const [help, setHelp] = useState(false)
  const last = tape.length ? tape[tape.length - 1].r : ''
  const run = () => {
    if (!expr.trim()) return
    try { const v = evalExpr(expr); setTape([...tape.slice(-5), { e: expr, r: g(v, 6) }]); setExpr(''); setErr('') }
    catch (e) { setErr((e as Error).message) }
  }
  const press = (k: string) => {
    setErr('')
    if (k === '=') run()
    else if (k === 'Ans') setExpr(expr + last.split('.').join(''))
    else setExpr(expr + k)
  }
  return <aside className="calcpanel" aria-label="Calculadora">
    <header><b>Calculadora</b>
      <span><button className="link" onClick={() => setHelp(!help)}>{help ? 'Ocultar ayuda' : 'Cómo usarla'}</button>
        <button className="link" onClick={onClose} aria-label="Cerrar calculadora">Cerrar ✕</button></span></header>
    {help && <div className="calchelp">
      <p>Escribí la operación completa y pulsá <b>=</b> (o Enter). Ejemplo: <code>(6,39 + 0,13) ÷ 1,08</code>.</p>
      <p>Decimales con <b>coma</b>. El punto se lee como separador de miles (1.400 = mil cuatrocientos).</p>
      <p><b>%</b> convierte en centésimas: <code>250 × 12%</code> = 30. Para sumar un 12 %: <code>250 × (1 + 12%)</code>.</p>
      <p><b>Ans</b> pega el último resultado. Usá paréntesis cuando una suma deba hacerse antes que una división.</p>
    </div>}
    <div className="tape">{tape.map((t, i) => <div key={i}><span>{t.e} =</span><b>{t.r}</b></div>)}</div>
    <input className="calcin" value={expr} placeholder="Ej.: 1400 ÷ 140" aria-label="Operación"
      onChange={(e) => { setExpr(e.target.value); setErr('') }} onKeyDown={(e) => e.key === 'Enter' && run()} />
    {err && <div className="calcerr">{err}</div>}
    <div className="keys5">{KEYS.map((k) => <button key={k} className={k === '=' ? 'eq' : /\d|,/.test(k) ? '' : 'op'} onClick={() => press(k)}>{k}</button>)}</div>
    <div className="row"><button className="btn small" onClick={() => setExpr(expr.slice(0, -1))}>← Borrar</button>
      <button className="btn small" onClick={() => { setExpr(''); setErr('') }}>C</button>
      <button className="btn small" onClick={() => setTape([])}>Limpiar cinta</button></div>
  </aside>
}
