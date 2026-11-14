import { useState } from 'react'
import { EMAILS, LANGS, type Lang } from '../content/emails.ts'
import { EXCEL, GLOSSARY, XL_NAMES } from '../content/misc.ts'
import { C } from '../content/h.ts'
import { Runner } from '../components/Runner.tsx'
import { StepCard } from '../components/StepCard.tsx'
import { Rich } from '../components/Rich.tsx'
import { SECTORS, type Sector, type Step } from '../lib/types.ts'

const XL_QUIZ: Step[] = [
  C({ id: 'xl-q1', dim: 'calculo', q: 'En B2 hay 1.400 unidades y en B3, 120 unidades por caja. ¿Qué fórmula da las **cajas necesarias**?', opts: [['`=ARROTONDA.PER.ECC(B2/B3;0)`', 'ok', '1.400 ÷ 120 = 11,67 → 12 cajas.'], ['`=ARROTONDA(B2/B3;0)`', 'no', 'Aquí daría 12 por casualidad, pero con 11,3 daría 11: redondea al más cercano, no hacia arriba.'], ['`=B2/B3`', 'no', 'Devuelve 11,67: no existen 0,67 cajas.']] }),
  C({ id: 'xl-q2', dim: 'interpretacion', q: 'Coste en B2, precio en C2. ¿Cuál calcula el **margen sobre ventas**?', opts: [['`=(C2-B2)/C2`', 'ok', 'El denominador es el precio.'], ['`=(C2-B2)/B2`', 'no', 'Denominador coste: eso es el recargo.'], ['`=C2-B2/C2`', 'no', 'Sin paréntesis, Excel divide primero B2/C2 y luego resta.']] }),
  C({ id: 'xl-q3', dim: 'unidades', q: 'Verde en B2 (€/kg), merma en B3 (16 %). Alguien escribió `=B2/1-B3`. ¿Qué devuelve con B2 = 6,18?', opts: [['6,02: divide entre 1 y luego resta 0,16.', 'ok', 'Faltan los paréntesis: lo correcto es `=B2/(1-B3)` = 7,36. Comprobación rápida: el tostado debe costar más que el verde.'], ['7,36, que es lo correcto.', 'no', 'Excel respeta la prioridad: la división va antes que la resta.'], ['Un error #DIV/0!', 'no', 'No hay división entre cero.']] }),
]

export function ExcelPage() {
  return <>
    <h1>Excel en italiano</h1>
    <p className="muted">Fórmulas reutilizables con los nombres de función de Excel en italiano. Recordá: en la configuración italiana los argumentos se separan con <b>punto y coma</b> y los decimales con <b>coma</b>.</p>
    <div className="card rich"><h3>Tres comprobaciones antes de fiarte de una celda</h3>
      <ol><li><b>Unidades:</b> escribí la unidad en el encabezado de cada columna (€/kg, kg, €). Si una fórmula suma columnas con unidades distintas, está mal.</li>
        <li><b>Denominador:</b> en toda división, preguntate «¿entre qué estoy dividiendo y por qué?» (precio o coste, kilos comprados o kilos útiles, valor inicial o final).</li>
        <li><b>Coherencia:</b> estimá el resultado mentalmente antes de mirar la celda. El tostado cuesta más que el verde; el margen es menor que el recargo; una media ponderada queda entre sus extremos.</li></ol></div>
    {EXCEL.map((x) => <section key={x.title} className="card xl"><h3>{x.title}</h3><pre>{x.formula}</pre>
      <table><tbody>{x.parts.map(([a, b]) => <tr key={a}><td><code>{a}</code></td><td>{b}</td></tr>)}</tbody></table>
      <p className="small"><b>Comprobá:</b> {x.check}</p></section>)}
    <h2>Tabla de ejemplo: escandallo de café tostado</h2>
    <div className="card"><div className="tablewrap"><table><thead><tr><th></th><th>A</th><th>B</th><th>C (fórmula en B)</th></tr></thead><tbody>
      {[['1', 'Referencia arábica (¢/lb)', '300', 'dato'], ['2', 'Diferencial (¢/lb)', '18', 'dato'], ['3', 'Tipo de cambio (USD por €)', '1,08', 'dato'], ['4', 'Costes hasta almacén (€/kg)', '0,27', 'dato'],
        ['5', 'Verde en almacén (€/kg)', '6,76', '=(B1+B2)/100/0,45359/B3+B4'], ['6', 'Merma de tueste', '16 %', 'dato de producción'], ['7', 'Materia prima (€/kg tostado)', '8,05', '=B5/(1-B6)'],
        ['8', 'Tueste y envasado (€/kg)', '1,10', 'dato'], ['9', 'Coste total (€/kg tostado)', '9,15', '=B7+B8'], ['10', 'Margen objetivo', '25 %', 'dato'], ['11', 'Precio de venta (€/kg)', '12,20', '=B9/(1-B10)'], ['12', 'Comprobación del margen', '25 %', '=(B11-B9)/B11']]
        .map((r) => <tr key={r[0]}><th>{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td><td><code>{r[3]}</code></td></tr>)}</tbody></table></div>
      <p className="muted small">Valores <b>simulados</b>. Separar «datos» de «fórmulas» (y colorear las celdas de datos) permite cambiar un supuesto y ver el efecto en toda la cadena.</p></div>
    <h2>Nombres de función: italiano · español · inglés</h2>
    <div className="card"><div className="tablewrap"><table><thead><tr><th>Italiano</th><th>Español</th><th>Inglés</th></tr></thead><tbody>{XL_NAMES.map((r) => <tr key={r[0]}><td><code>{r[0]}</code></td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div></div>
    <h2>Practicá</h2>
    <Runner runId="quiz-excel" steps={XL_QUIZ} />
  </>
}

export function Comms() {
  const [id, setId] = useState(EMAILS[0].id)
  const [lang, setLang] = useState<Lang>('es')
  const [n, setN] = useState(0)
  const e = EMAILS.find((x) => x.id === id)!
  return <>
    <h1>Correos y recomendaciones</h1>
    <p className="muted">Elegí el tipo de mensaje y el idioma, escribí tu versión y comparala con un modelo. La plataforma no corrige gramática: te da una lista de comprobación y un texto de referencia.</p>
    <div className="chips">{EMAILS.map((x) => <button key={x.id} className={'chip' + (x.id === id ? ' on' : '')} onClick={() => { setId(x.id); setN(n + 1) }}>{x.title}</button>)}</div>
    <div className="chips">{(Object.keys(LANGS) as Lang[]).map((l) => <button key={l} className={'chip' + (l === lang ? ' on' : '')} onClick={() => { setLang(l); setN(n + 1) }}>{LANGS[l]}</button>)}</div>
    <div className="card">
      <StepCard key={id + lang + n} step={{ kind: 'write', id: `mail-${id}-${lang}`, q: `${e.scenario}\n\nEscribí el mensaje en **${LANGS[lang]}**.`, checklist: e.checklist, model: e.model[lang] }} onResult={() => {}} />
    </div>
    <div className="card"><b>Frases útiles en {LANGS[lang]}</b><ul>{e.phrases[lang].map((p) => <li key={p}>{p}</li>)}</ul></div>
  </>
}

export function Glossary() {
  const [q, setQ] = useState('')
  const [sec, setSec] = useState<Sector | ''>('')
  const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const items = GLOSSARY.filter((g) => (!sec || g.s === sec) && norm(g.t + ' ' + g.d).includes(norm(q))).sort((a, b) => a.t.localeCompare(b.t, 'es'))
  return <>
    <h1>Glosario</h1>
    <input className="search" placeholder="Buscar un término…" value={q} onChange={(e) => setQ(e.target.value)} />
    <div className="chips"><button className={'chip' + (!sec ? ' on' : '')} onClick={() => setSec('')}>Todos</button>{(Object.keys(SECTORS) as Sector[]).map((k) => <button key={k} className={'chip' + (sec === k ? ' on' : '')} onClick={() => setSec(k)}>{SECTORS[k]}</button>)}</div>
    <dl className="glossary card">{items.map((g) => <div key={g.t}><dt>{g.t} {g.s !== 'comun' && <span className={'tag sec ' + g.s}>{SECTORS[g.s]}</span>}</dt><dd><Rich text={g.d} /></dd></div>)}
      {!items.length && <p className="muted">Sin resultados.</p>}</dl>
  </>
}
