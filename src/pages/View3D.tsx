import { useState } from 'react'
import { ColdRoomScene, ContainerScene, PalletScene, RoastScene, TruckScene, WarehouseScene } from '../components/Scene3D.tsx'
import { F, R, useForm } from './Tools.tsx'

const PROD: [string, number, number][] = [['Spaghetti', 880, 1.2], ['Fusilli', 430, 1.8], ['Arroz 1 kg', 1020, 1.1], ['Café en paquetes', 520, 1.6], ['Conservas de atún', 760, 1.2]]

export function View3D() {
  return <>
    <h1>Cargas en 3D</h1>
    <p className="muted">Seis escenas a escala real para ver lo que los números dicen: palés a medias, camiones que se llenan por peso o por espacio, un contenedor de café, la merma de tueste, un almacén con su punto de pedido y una cámara de salmón fresco. Los valores iniciales son <b>simulados</b>.</p>
    <Pales /><Camion /><Contenedor /><Tueste /><Almacen /><Camara />
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

const Dia = ({ v, max, set }: { v: number; max: number; set: (n: number) => void }) =>
  <label className="field"><span>Avanzar el tiempo: día {v}</span><div><input type="range" min={0} max={max} step={1} value={v} onChange={(e) => set(Number(e.target.value))} /></div></label>

function Tueste() {
  const { n, bind } = useForm({ s: '199', m: '16', g: '250' })
  return <section className="card"><h3>La merma de tueste, a la vista</h3>
    <div className="toolgrid"><div><F label="Sacos de café verde (60 kg)" unit="sacos" {...bind('s')} /><F label="Merma de tueste" unit="%" {...bind('m')} /><F label="Formato del paquete" unit="g" {...bind('g')} /></div>
      <div><R label="Café verde" v={n('s') * 60} unit="kg" d={0} /><R label="Café tostado" v={n('s') * 60 * (1 - n('m') / 100)} unit="kg" d={0} strong /><R label="Peso que se evapora" v={n('s') * 60 * (n('m') / 100)} unit="kg" d={0} /></div></div>
    <RoastScene sacos={Math.round(n('s')) || 0} merma={isFinite(n('m')) ? n('m') : -1} gramos={n('g') || 0} /></section>
}
function Almacen() {
  const [dia, setDia] = useState(0)
  const { n, bind } = useForm({ s: '48000', c: '960', lt: '30', ss: '9600', kp: '600' })
  return <section className="card"><h3>Almacén: stock, punto de pedido y stock de seguridad</h3>
    <div className="toolgrid"><div><F label="Stock inicial" unit="kg" {...bind('s')} /><F label="Consumo por día" unit="kg/día" {...bind('c')} /><F label="Plazo de aprovisionamiento" unit="días" {...bind('lt')} /></div>
      <div><F label="Stock de seguridad" unit="kg" {...bind('ss')} /><F label="Peso por palé" unit="kg" {...bind('kp')} /><Dia v={dia} max={60} set={setDia} /></div></div>
    <WarehouseScene stock={n('s')} cons={n('c')} plazo={n('lt')} ss={n('ss')} kgPale={n('kp')} dia={dia} /></section>
}
function Camara() {
  const [dia, setDia] = useState(0)
  const { n, bind } = useForm({ kg: '480', v: '57', vida: '7', c: '12,58', l: '6' })
  return <section className="card"><h3>Cámara de salmón fresco: lo que no se vende a tiempo</h3>
    <div className="toolgrid"><div><F label="Filete comprado" unit="kg" {...bind('kg')} /><F label="Venta por día" unit="kg/día" {...bind('v')} /><F label="Vida útil comercial" unit="días" {...bind('vida')} /></div>
      <div><F label="Coste del filete" unit="€/kg" {...bind('c')} /><F label="Valor de liquidación" unit="€/kg" {...bind('l')} /><Dia v={dia} max={Math.max(2, Math.round(n('vida') || 7) + 2)} set={setDia} /></div></div>
    <ColdRoomScene kg={n('kg')} venta={n('v')} vida={Math.round(n('vida')) || 0} coste={n('c')} liq={n('l')} dia={dia} /></section>
}
