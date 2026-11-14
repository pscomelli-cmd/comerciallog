import { useState } from 'react'
import { ContainerScene, PalletScene, TruckScene } from '../components/Scene3D.tsx'
import { F, R, useForm } from './Tools.tsx'

const PROD: [string, number, number][] = [['Spaghetti', 880, 1.2], ['Fusilli', 430, 1.8], ['Arroz 1 kg', 1020, 1.1], ['Café en paquetes', 520, 1.6], ['Conservas de atún', 760, 1.2]]

export function View3D() {
  return <>
    <h1>Cargas en 3D</h1>
    <p className="muted">Tres escenas a escala real para ver lo que los números dicen: palés a medias, camiones que se llenan por peso o por espacio, y un contenedor de café. Los valores iniciales son <b>simulados</b>.</p>
    <Pales /><Camion /><Contenedor />
    <div className="note"><b>Realidad virtual:</b> si abrís esta página en un visor o navegador compatible con WebXR aparece el botón «Entrar en realidad virtual», que te sitúa de pie junto a la carga. No he podido probar ese modo con un visor real. En ordenador y teléfono la escena se explora girándola con el ratón o los dedos.</div>
  </>
}

export function PalesPresets() {
  const [k, setK] = useState(2)
  const opts: [string, number, number][] = [['Cajas de 140', 10, 5], ['Cajas de 100', 14, 6], ['Cajas de 70', 20, 7]]
  return <>
    <div className="chips">{opts.map((o, i) => <button key={o[0]} className={'chip' + (i === k ? ' on' : '')} onClick={() => setK(i)}>{o[0]}</button>)}</div>
    <PalletScene cajas={opts[k][1]} cpp={opts[k][2]} />
  </>
}

function Pales() {
  const { n, bind } = useForm({ u: '1400', upc: '70', cpp: '7' })
  const cajas = Math.ceil(n('u') / n('upc'))
  return <section className="card"><h3>Cajas sobre palés</h3>
    <div className="toolgrid"><div><F label="Unidades del pedido" unit="uds" {...bind('u')} /><F label="Unidades por caja" unit="uds" {...bind('upc')} /><F label="Cajas por palé" unit="cajas" {...bind('cpp')} /></div>
      <div><R label="Cajas" v={cajas} d={0} /><R label="Palés" v={Math.ceil(cajas / n('cpp'))} d={0} strong /><R label="Unidades para completar palés" v={Math.ceil(cajas / n('cpp')) * n('cpp') * n('upc') - n('u')} d={0} /></div></div>
    <PalletScene cajas={isFinite(cajas) ? cajas : 0} cpp={n('cpp') || 0} /></section>
}
function Camion() {
  const [p, setP] = useState(1)
  const { n, bind } = useForm({ kg: '' })
  const kg = n('kg') || PROD[p][1]
  return <section className="card"><h3>Camión: peso frente a espacio</h3>
    <div className="chips">{PROD.map((x, i) => <button key={x[0]} className={'chip' + (i === p && !n('kg') ? ' on' : '')} onClick={() => { setP(i); bind('kg').onChange({ target: { value: '' } }) }}>{x[0]} · {x[1]} kg/palé</button>)}</div>
    <div className="toolgrid"><div><F label="O escribí otro peso bruto por palé" unit="kg" {...bind('kg')} /></div><div><R label="Límite por peso (24.000 kg)" v={Math.floor(24000 / kg)} unit="palés" d={0} /><R label="Límite por espacio" v={33} unit="palés" d={0} /></div></div>
    <TruckScene kgPale={kg} alto={n('kg') ? 1.4 : PROD[p][2]} /></section>
}
function Contenedor() {
  const { n, bind } = useForm({ s: '320', kg: '60' })
  return <section className="card"><h3>Contenedor de 20 pies con café verde</h3>
    <div className="toolgrid"><div><F label="Sacos" unit="sacos" {...bind('s')} /><F label="Peso por saco" unit="kg" {...bind('kg')} /></div><div><R label="Peso neto de café" v={n('s') * n('kg')} unit="kg" d={0} strong /><R label="En toneladas" v={(n('s') * n('kg')) / 1000} unit="t" d={1} /></div></div>
    <ContainerScene sacos={Math.round(n('s')) || 0} kgSaco={n('kg') || 0} /></section>
}
