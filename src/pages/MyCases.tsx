import { useState } from 'react'
import { N } from '../content/h.ts'
import { Runner } from '../components/Runner.tsx'
import { f, parseNum } from '../lib/num.ts'
import { today, useStore, type FieldStatus, type MyCase, type MyField } from '../lib/store.tsx'
import type { Step } from '../lib/types.ts'

type V = Record<string, number>
interface Tpl { title: string; desc: string; fields: [string, string, string][]; compute: (v: V) => [string, number, string, number?][]; steps: (v: V, id: string) => Step[] }

const TPL: Record<string, Tpl> = {
  compraventa: {
    title: 'Compra → venta', desc: 'Coste entregado, margen, contribución y financiación de una operación.',
    fields: [['qty', 'Cantidad comprada', 'kg'], ['pc', 'Precio de compra', '€/kg'], ['gastos', 'Transporte y otros gastos (total)', '€'], ['merma', 'Merma (0 si no hay)', '%'], ['pv', 'Precio de venta neto', '€/kg'], ['dias', 'Días entre el pago y el cobro', 'días'], ['tipo', 'Coste de financiación anual', '%']],
    compute: (v) => { const util = v.qty * (1 - v.merma / 100), ct = v.qty * v.pc + v.gastos, ck = ct / util
      return [['Kilos vendibles', util, 'kg', 0], ['Coste total de la operación', ct, '€', 0], ['Coste entregado por kg vendible', ck, '€/kg', 3], ['Margen sobre ventas', ((v.pv - ck) / v.pv) * 100, '%', 1], ['Recargo sobre coste', ((v.pv - ck) / ck) * 100, '%', 1], ['Contribución total', util * (v.pv - ck), '€', 0], ['Coste de financiación', (ct * (v.tipo / 100) * v.dias) / 360, '€', 0]] },
    steps: (v, id) => { const util = v.qty * (1 - v.merma / 100), ct = v.qty * v.pc + v.gastos, ck = ct / util
      return [
        N({ id: id + '-1', dim: 'unidades', unit: '€/kg', a: ck, q: `Con tus datos: comprás **${f(v.qty, 0)} kg** a **${f(v.pc, 3)} €/kg**, con **${f(v.gastos, 0)} €** de gastos y una merma del **${f(v.merma, 1)} %**. ¿Cuál es el **coste entregado por kg vendible**?`, hints: ['Coste total = compra + gastos.', 'Dividí entre los kilos que quedan después de la merma.', `Operación: (${v.qty} × ${f(v.pc, 3)} + ${v.gastos}) ÷ (${v.qty} × ${f(1 - v.merma / 100, 3)})`], sol: [`Coste total: ${f(ct, 0)} €`, `Kilos vendibles: ${f(util, 0)} kg`, `**${f(ck, 3)} €/kg**`], means: 'Es la base para fijar o evaluar el precio de venta de tu caso.' }),
        N({ id: id + '-2', dim: 'interpretacion', unit: '%', a: ((v.pv - ck) / v.pv) * 100, tol: 0.02, q: `Vendés a **${f(v.pv, 3)} €/kg**. ¿Qué **margen sobre ventas** obtenés?`, hints: ['(precio − coste) ÷ precio.', `Operación: (${f(v.pv, 3)} − ${f(ck, 3)}) ÷ ${f(v.pv, 3)} × 100`], sol: [`(${f(v.pv, 3)} − ${f(ck, 3)}) ÷ ${f(v.pv, 3)} = **${f(((v.pv - ck) / v.pv) * 100, 1)} %**`], traps: [{ v: ((v.pv - ck) / ck) * 100, kind: 'interpretacion', msg: 'Eso es el recargo sobre coste.' }] }),
        N({ id: id + '-3', dim: 'supuestos', unit: '€', a: (ct * (v.tipo / 100) * v.dias) / 360, tol: 0.02, q: `Entre pagar y cobrar pasan **${f(v.dias, 0)} días**, y el dinero cuesta un **${f(v.tipo, 1)} % anual**. ¿Cuánto cuesta **financiar** el coste de la operación (${f(ct, 0)} €)?`, hints: ['Importe × tipo × días ÷ 360.', `Operación: ${f(ct, 0)} × ${f(v.tipo, 1)} % × ${v.dias} ÷ 360`], sol: [`**${f((ct * (v.tipo / 100) * v.dias) / 360, 0)} €**`], means: 'Comparalo con la contribución de la operación para ver cuánto margen consume el plazo.' }),
      ] },
  },
  cafe: {
    title: 'Café verde → tostado', desc: 'De una cotización de arábica al coste y precio por kg tostado.',
    fields: [['clb', 'Precio del arábica (referencia + diferencial)', '¢/lb'], ['fx', 'Tipo de cambio: 1 € =', 'USD'], ['log', 'Costes hasta almacén', '€/kg'], ['merma', 'Merma de tueste', '%'], ['proc', 'Tueste y envasado', '€/kg tostado'], ['margen', 'Margen objetivo sobre ventas', '%']],
    compute: (v) => { const alm = v.clb / 100 / 0.45359237 / v.fx + v.log, t = alm / (1 - v.merma / 100)
      return [['Precio en origen', (v.clb * 22.0462), 'USD/t', 0], ['Verde puesto en almacén', alm, '€/kg', 3], ['Materia prima por kg tostado', t, '€/kg', 3], ['Coste total por kg tostado', t + v.proc, '€/kg', 3], ['Precio de venta objetivo', (t + v.proc) / (1 - v.margen / 100), '€/kg', 2]] },
    steps: (v, id) => { const alm = v.clb / 100 / 0.45359237 / v.fx + v.log, t = alm / (1 - v.merma / 100), ct = t + v.proc
      return [
        N({ id: id + '-1', dim: 'unidades', unit: '€/kg', a: alm, q: `Tu café cotiza a **${f(v.clb, 1)} ¢/lb**, con **1 € = ${f(v.fx, 3)} USD** y **${f(v.log, 3)} €/kg** de costes hasta almacén. ¿Coste del **verde puesto en almacén**?`, hints: ['¢/lb ÷ 100 ÷ 0,4536 = USD/kg.', 'Dividí entre el tipo de cambio y sumá los costes en euros.', `Operación: ${f(v.clb, 1)} ÷ 100 ÷ 0,4536 ÷ ${f(v.fx, 3)} + ${f(v.log, 3)}`], sol: [`**${f(alm, 3)} €/kg**`] }),
        N({ id: id + '-2', dim: 'supuestos', unit: '€/kg tostado', a: t, q: `Con una merma del **${f(v.merma, 1)} %**, ¿cuánto cuesta la materia prima **por kg tostado**?`, hints: ['Dividí entre el rendimiento.', `Operación: ${f(alm, 3)} ÷ ${f(1 - v.merma / 100, 3)}`], sol: [`${f(alm, 3)} ÷ ${f(1 - v.merma / 100, 3)} = **${f(t, 3)} €/kg**`], traps: [{ v: alm * (1 + v.merma / 100), kind: 'supuesto', msg: 'Hay que dividir entre (1 − merma), no multiplicar por (1 + merma).' }] }),
        N({ id: id + '-3', dim: 'interpretacion', unit: '€/kg', a: ct / (1 - v.margen / 100), q: `Sumando **${f(v.proc, 2)} €/kg** de proceso, ¿a qué **precio** hay que vender para un margen del **${f(v.margen, 1)} %** sobre ventas?`, hints: ['Coste total ÷ (1 − margen).', `Operación: (${f(t, 3)} + ${f(v.proc, 2)}) ÷ ${f(1 - v.margen / 100, 3)}`], sol: [`Coste total: ${f(ct, 3)} €/kg`, `**${f(ct / (1 - v.margen / 100), 2)} €/kg**`], traps: [{ v: ct * (1 + v.margen / 100), kind: 'interpretacion', msg: 'Eso es un recargo, no un margen sobre ventas.' }] }),
      ] },
  },
  pales: {
    title: 'Cajas y palés', desc: 'Cajas, palés y coste de transporte por unidad de un pedido.',
    fields: [['u', 'Unidades del pedido', 'uds'], ['upc', 'Unidades por caja', 'uds'], ['cpp', 'Cajas por palé', 'cajas'], ['t', 'Tarifa de transporte', '€/palé']],
    compute: (v) => { const c = Math.ceil(v.u / v.upc), p = Math.ceil(c / v.cpp); return [['Cajas', c, '', 0], ['Palés', p, '', 0], ['Coste de transporte', p * v.t, '€', 2], ['Transporte por unidad', (p * v.t) / v.u, '€', 4], ['Unidades para completar palés', p * v.cpp * v.upc - v.u, 'uds', 0]] },
    steps: (v, id) => { const c = Math.ceil(v.u / v.upc), p = Math.ceil(c / v.cpp)
      return [
        N({ id: id + '-1', dim: 'calculo', unit: 'cajas', a: c, tol: 0, q: `Tu pedido es de **${f(v.u, 0)} unidades** en cajas de **${f(v.upc, 0)}**. ¿Cuántas **cajas** enteras?`, hints: ['Dividí y redondeá hacia arriba.'], sol: [`${f(v.u, 0)} ÷ ${f(v.upc, 0)} = ${f(v.u / v.upc, 2)} → **${c} cajas**`] }),
        N({ id: id + '-2', dim: 'unidades', unit: 'palés', a: p, tol: 0, q: `Con **${f(v.cpp, 0)} cajas por palé**, ¿cuántos **palés**?`, hints: ['Cajas ÷ cajas por palé, hacia arriba.'], sol: [`${c} ÷ ${f(v.cpp, 0)} = ${f(c / v.cpp, 2)} → **${p} palés**`] }),
        N({ id: id + '-3', dim: 'unidades', unit: '€/unidad', a: (p * v.t) / v.u, tol: 0.02, q: `A **${f(v.t, 2)} € por palé**, ¿cuánto cuesta el transporte **por unidad**?`, hints: ['Coste total ÷ unidades.', `Operación: ${p} × ${f(v.t, 2)} ÷ ${v.u}`], sol: [`${p} × ${f(v.t, 2)} = ${f(p * v.t, 2)} €`, `÷ ${f(v.u, 0)} = **${f((p * v.t) / v.u, 4)} €/unidad**`] }),
      ] },
  },
}
const STATUS: Record<FieldStatus, string> = { aportado: 'Dato aportado por mí', supuesto: 'Supuesto simulado', pendiente: 'Pendiente de verificar' }

export function MyCases() {
  const { s, set } = useStore()
  const [sel, setSel] = useState<string | null>(s.myCases[0]?.id ?? null)
  const [practice, setPractice] = useState(0)
  const cur = s.myCases.find((c) => c.id === sel)
  const save = (c: MyCase) => set((st) => ({ ...st, myCases: st.myCases.map((x) => (x.id === c.id ? { ...c, updated: today() } : x)) }))
  const add = (k: string) => { const id = 'mc' + Date.now().toString(36)
    const c: MyCase = { id, title: 'Caso sin título', sector: '', tipo: '', template: k, notes: '', updated: today(), fields: TPL[k].fields.map(([key, label, unit]): MyField => ({ key, label, unit, value: '', status: 'aportado' })) }
    set((st) => ({ ...st, myCases: [...st.myCases, c] })); setSel(id); setPractice(0) }
  return <>
    <h1>Mis casos</h1>
    <p className="muted">Introducí situaciones reales <b>anonimizadas</b> y reutilizalas como ejercicios. La plataforma no inventa datos de tu empresa: solo calcula con lo que vos escribís, y te obliga a decir de dónde sale cada cifra.</p>
    <div className="legend"><span className="k aportado">Datos aportados por mí</span><span className="k calc">Resultados calculados</span><span className="k supuesto">Supuestos simulados</span><span className="k pendiente">Pendiente de verificar</span></div>
    <div className="note">Antes de escribir: quitá nombres de clientes, proveedores y personas. Los casos se guardan <b>solo en este navegador</b> (no se envían a ningún servidor), pero cualquiera con acceso a este dispositivo puede verlos.</div>
    <div className="chips">{s.myCases.map((c) => <button key={c.id} className={'chip' + (c.id === sel ? ' on' : '')} onClick={() => { setSel(c.id); setPractice(0) }}>{c.title}</button>)}</div>
    <div className="row"><span className="muted small">Nuevo caso a partir de:</span>{Object.entries(TPL).map(([k, t]) => <button key={k} className="btn small" title={t.desc} onClick={() => add(k)}>+ {t.title}</button>)}</div>
    {cur && <Editor key={cur.id} c={cur} save={save} practice={practice} setPractice={setPractice}
      del={() => { if (confirm('¿Eliminar este caso? No se puede deshacer.')) { set((st) => ({ ...st, myCases: st.myCases.filter((x) => x.id !== cur.id) })); setSel(null) } }} />}
  </>
}

function Editor({ c, save, del, practice, setPractice }: { c: MyCase; save: (c: MyCase) => void; del: () => void; practice: number; setPractice: (n: number) => void }) {
  const { set } = useStore()
  const t = TPL[c.template]
  const vals: V = {}, missing: string[] = []
  for (const fl of c.fields) { const n = parseNum(fl.value)[0]; if (n === undefined) missing.push(fl.label); else vals[fl.key] = n }
  const sup = c.fields.filter((x) => x.status === 'supuesto' && x.value).length, pen = c.fields.filter((x) => x.status === 'pendiente').length
  const setF = (i: number, p: Partial<MyField>) => save({ ...c, fields: c.fields.map((x, j) => (j === i ? { ...x, ...p } : x)) })
  const runId = 'my-' + c.id
  return <div className="card mycase">
    <div className="toolgrid">
      <label className="field"><span>Título (sin nombres reales)</span><div><input value={c.title} onChange={(e) => save({ ...c, title: e.target.value })} /></div></label>
      <label className="field"><span>Sector y tipo de producto</span><div><input value={c.sector} placeholder="p. ej. Café · materia prima" onChange={(e) => save({ ...c, sector: e.target.value })} /></div></label>
    </div>
    <p className="small muted">Plantilla: <b>{t.title}</b>. {t.desc}</p>
    {c.fields.map((fl, i) => <div key={fl.key} className={'myfield ' + fl.status}>
      <label><span>{fl.label}</span><div><input inputMode="decimal" value={fl.value} placeholder={fl.status === 'pendiente' ? 'aún no lo sé' : ''} onChange={(e) => setF(i, { value: e.target.value })} /><em>{fl.unit}</em></div></label>
      <select value={fl.status} aria-label="Origen del dato" onChange={(e) => setF(i, { status: e.target.value as FieldStatus })}>{(Object.keys(STATUS) as FieldStatus[]).map((k) => <option key={k} value={k}>{STATUS[k]}</option>)}</select>
    </div>)}
    <label className="field"><span>Notas: contexto, a quién consultar, qué falta</span><textarea rows={3} value={c.notes} onChange={(e) => save({ ...c, notes: e.target.value })} /></label>
    <div className="results calc"><b>Resultados calculados</b>
      {missing.length ? <p>No se puede calcular todavía. Falta: <b>{missing.join(' · ')}</b>.<br /><span className="small">Identificar lo que falta ya es parte del análisis: ¿quién puede darte cada dato?</span></p>
        : <>{t.compute(vals).map(([l, v, u, d]) => <div className="res" key={l}><span>{l}</span><b>{isFinite(v) ? f(v, d ?? 2) : '—'} {u}</b></div>)}
          {(sup > 0 || pen > 0) && <p className="small"><b>Atención:</b> estos resultados dependen de {sup > 0 && <span className="k supuesto">{sup} supuesto(s) simulado(s)</span>} {pen > 0 && <span className="k pendiente">{pen} dato(s) pendiente(s) de verificar</span>}. No los presentes como definitivos.</p>}</>}
    </div>
    <div className="row"><button className="btn primary" disabled={missing.length > 0} onClick={() => { set((st) => { const runs = { ...st.runs }; delete runs[runId]; return { ...st, runs } }); setPractice(practice + 1) }}>Practicar con este caso</button>
      <button className="btn ghost" onClick={del}>Eliminar caso</button></div>
    {practice > 0 && !missing.length && <Runner key={practice} runId={runId} steps={t.steps(vals, runId + '-' + practice)} />}
  </div>
}
