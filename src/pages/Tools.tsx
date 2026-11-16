import { useState, type ReactNode } from 'react'
import { f, parseNum } from '../lib/num.ts'

export function useForm<T extends Record<string, string>>(init: T) {
  const [v, setV] = useState(init)
  return { n: (k: keyof T) => parseNum(v[k])[0] ?? NaN, bind: (k: keyof T) => ({ value: v[k], onChange: (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value }) }) }
}
export const F = ({ label, unit, ...b }: { label: string; unit?: string; value: string; onChange: (e: { target: { value: string } }) => void }) =>
  <label className="field"><span>{label}</span><div><input inputMode="decimal" {...b} />{unit && <em>{unit}</em>}</div></label>
export const R = ({ label, v, unit, d = 2, strong }: { label: string; v: number; unit?: string; d?: number; strong?: boolean }) =>
  <div className={'res' + (strong ? ' strong' : '')}><span>{label}</span><b>{isFinite(v) ? f(v, d) : '—'} {unit}</b></div>
const Tool = ({ title, how, children }: { title: string; how: string; children: ReactNode }) =>
  <section className="card tool"><h3>{title}</h3><div className="toolgrid">{children}</div><p className="muted small"><b>Cómo se calcula:</b> {how}</p></section>

export function Tools() {
  return <>
    <h1>Calculadoras</h1>
    <p className="muted">Los valores iniciales son ejemplos <b>simulados</b>: reemplazalos por los tuyos. Decimales con coma. La calculadora general está en el botón de arriba.</p>
    <Margen /><Cafe /><Pales /><Camion /><Stock /><Conserva /><Plazo />
  </>
}

function Margen() {
  const { n, bind } = useForm({ c: '8,46', p: '11,28', m: '25' })
  const c = n('c'), p = n('p'), m = n('m') / 100
  return <Tool title="Margen y recargo" how="margen = (precio − coste) ÷ precio · recargo = (precio − coste) ÷ coste · precio objetivo = coste ÷ (1 − margen).">
    <div><F label="Coste total" unit="€" {...bind('c')} /><F label="Precio de venta neto" unit="€" {...bind('p')} /><F label="Margen objetivo" unit="%" {...bind('m')} /></div>
    <div><R label="Beneficio unitario" v={p - c} unit="€" /><R label="Margen sobre ventas" v={((p - c) / p) * 100} unit="%" d={1} strong /><R label="Recargo sobre coste" v={((p - c) / c) * 100} unit="%" d={1} />
      <R label="Precio para el margen objetivo" v={c / (1 - m)} unit="€" strong /><R label="Recargo equivalente a ese margen" v={(m / (1 - m)) * 100} unit="%" d={1} /></div>
  </Tool>
}
function Cafe() {
  const [esp, setEsp] = useState<'a' | 'r'>('a')
  const { n, bind } = useForm({ ref: '300', dif: '18', usdt: '4600', fx: '1,08', log: '0,27', merma: '16', proc: '1,10', kg: '19200' })
  const usdkg = esp === 'a' ? ((n('ref') + n('dif')) / 100) / 0.45359237 : n('usdt') / 1000
  const eur = usdkg / n('fx'), alm = eur + n('log'), tost = alm / (1 - n('merma') / 100)
  return <Tool title="Café: de la cotización al coste por kg tostado" how="arábica: (referencia + diferencial) ¢/lb ÷ 100 ÷ 0,4536 = USD/kg · robusta: USD/t ÷ 1.000 · ÷ tipo de cambio (USD por €) · + costes hasta almacén · ÷ (1 − merma) · + proceso.">
    <div>
      <div className="chips"><button className={'chip' + (esp === 'a' ? ' on' : '')} onClick={() => setEsp('a')}>Arábica (¢/lb)</button><button className={'chip' + (esp === 'r' ? ' on' : '')} onClick={() => setEsp('r')}>Robusta (USD/t)</button></div>
      {esp === 'a' ? <><F label="Referencia de mercado" unit="¢/lb" {...bind('ref')} /><F label="Diferencial (negativo si es descuento)" unit="¢/lb" {...bind('dif')} /></> : <F label="Precio" unit="USD/t" {...bind('usdt')} />}
      <F label="Tipo de cambio: 1 € =" unit="USD" {...bind('fx')} /><F label="Flete, seguro y gastos hasta almacén" unit="€/kg" {...bind('log')} />
      <F label="Merma de tueste" unit="%" {...bind('merma')} /><F label="Tueste y envasado" unit="€/kg tostado" {...bind('proc')} /><F label="Kilos de verde" unit="kg" {...bind('kg')} /></div>
    <div><R label="Precio en origen" v={usdkg * 1000} unit="USD/t" d={0} /><R label="Precio en origen" v={eur} unit="€/kg" d={3} /><R label="Verde puesto en almacén" v={alm} unit="€/kg" d={3} strong />
      <R label="Materia prima por kg tostado" v={tost} unit="€/kg" d={3} /><R label="Coste total por kg tostado" v={tost + n('proc')} unit="€/kg" d={3} strong />
      <R label="Kilos de tostado obtenidos" v={n('kg') * (1 - n('merma') / 100)} unit="kg" d={0} /><R label="Valor del verde en almacén" v={n('kg') * alm} unit="€" d={0} /></div>
  </Tool>
}
function Pales() {
  const { n, bind } = useForm({ u: '1400', upc: '70', cpp: '7', t: '45' })
  const cajas = Math.ceil(n('u') / n('upc')), pal = Math.ceil(cajas / n('cpp')), cap = pal * n('cpp') * n('upc')
  return <Tool title="Unidades, cajas y palés" how="cajas = unidades ÷ unidades por caja, hacia arriba · palés = cajas ÷ cajas por palé, hacia arriba · coste = palés × tarifa.">
    <div><F label="Unidades del pedido" unit="uds" {...bind('u')} /><F label="Unidades por caja" unit="uds" {...bind('upc')} /><F label="Cajas por palé" unit="cajas" {...bind('cpp')} /><F label="Tarifa de transporte" unit="€/palé" {...bind('t')} /></div>
    <div><R label="Cajas" v={cajas} d={0} /><R label="Palés" v={pal} d={0} strong /><R label="Unidades por palé completo" v={n('cpp') * n('upc')} d={0} /><R label="Coste de transporte" v={pal * n('t')} unit="€" />
      <R label="Transporte por unidad" v={(pal * n('t')) / n('u')} unit="€" d={4} strong /><R label="Unidades que faltan para completar palés" v={cap - n('u')} d={0} /></div>
  </Tool>
}
function Camion() {
  const { n, bind } = useForm({ kgp: '430', hue: '33', max: '24000', coste: '900', neto: '360' })
  const pp = Math.floor(n('max') / n('kgp')), pal = Math.min(n('hue'), pp)
  return <Tool title="Camión o contenedor: peso frente a espacio" how="palés por peso = carga útil ÷ kg por palé, hacia abajo · se toma el menor entre ese número y los huecos disponibles.">
    <div><F label="Peso bruto por palé" unit="kg" {...bind('kgp')} /><F label="Peso neto de producto por palé" unit="kg" {...bind('neto')} /><F label="Huecos de palé" unit="palés" {...bind('hue')} /><F label="Carga útil máxima" unit="kg" {...bind('max')} /><F label="Coste del viaje" unit="€" {...bind('coste')} /></div>
    <div><R label="Límite por peso" v={pp} unit="palés" d={0} /><R label="Límite por espacio" v={n('hue')} unit="palés" d={0} /><R label="Palés que caben" v={pal} d={0} strong />
      <div className="res"><span>Qué limita</span><b>{pp < n('hue') ? 'El peso (sobra espacio)' : pp > n('hue') ? 'El espacio (sobra peso)' : 'Ambos a la vez'}</b></div>
      <R label="Kilos netos por viaje" v={pal * n('neto')} unit="kg" d={0} /><R label="Transporte por kg neto" v={n('coste') / (pal * n('neto'))} unit="€/kg" d={3} strong /></div>
  </Tool>
}
function Stock() {
  const { n, bind } = useForm({ s: '9600', c: '480', lt: '36', ss: '2400' })
  const cob = n('s') / n('c'), rop = n('c') * n('lt') + n('ss')
  return <Tool title="Cobertura y punto de pedido" how="cobertura = stock ÷ consumo diario · punto de pedido = consumo diario × plazo + stock de seguridad. Usá el mismo tipo de día en consumo y plazo.">
    <div><F label="Stock disponible" unit="kg" {...bind('s')} /><F label="Consumo por día" unit="kg/día" {...bind('c')} /><F label="Plazo de aprovisionamiento" unit="días" {...bind('lt')} /><F label="Stock de seguridad" unit="kg" {...bind('ss')} /></div>
    <div><R label="Cobertura" v={cob} unit="días" d={1} strong /><R label="Punto de pedido" v={rop} unit="kg" d={0} strong /><R label="Stock de seguridad, en días" v={n('ss') / n('c')} unit="días" d={1} />
      <div className="res"><span>Situación</span><b>{!isFinite(cob) ? '—' : n('s') <= rop ? 'Por debajo del punto de pedido: hay que pedir' : 'Por encima del punto de pedido'}</b></div>
      {cob < n('lt') && <div className="note warn">La cobertura ({f(cob, 1)} días) es menor que el plazo ({f(n('lt'), 0)} días): si no hay pedidos en camino, habrá rotura de stock.</div>}</div>
  </Tool>
}
function Conserva() {
  const { n, bind } = useForm({ pa: '1,42', na: '160', ea: '112', pb: '1,24', nb: '160', eb: '104' })
  const a = n('pa') / (n('ea') / 1000), b = n('pb') / (n('eb') / 1000)
  return <Tool title="Conservas: precio por kg neto y por kg escurrido" how="precio ÷ (peso en gramos ÷ 1.000). Compará siempre sobre peso escurrido y a igualdad de especie, presentación y cobertura.">
    <div><F label="A · precio por lata" unit="€" {...bind('pa')} /><F label="A · peso neto" unit="g" {...bind('na')} /><F label="A · peso escurrido" unit="g" {...bind('ea')} />
      <F label="B · precio por lata" unit="€" {...bind('pb')} /><F label="B · peso neto" unit="g" {...bind('nb')} /><F label="B · peso escurrido" unit="g" {...bind('eb')} /></div>
    <div><R label="A · por kg neto" v={n('pa') / (n('na') / 1000)} unit="€/kg" /><R label="A · por kg escurrido" v={a} unit="€/kg" strong /><R label="B · por kg neto" v={n('pb') / (n('nb') / 1000)} unit="€/kg" /><R label="B · por kg escurrido" v={b} unit="€/kg" strong />
      <R label="Diferencia de B frente a A, por lata" v={(n('pb') / n('pa') - 1) * 100} unit="%" d={1} /><R label="Diferencia de B frente a A, por kg escurrido" v={(b / a - 1) * 100} unit="%" d={1} strong /></div>
  </Tool>
}
function Plazo() {
  const { n, bind } = useForm({ imp: '100000', dias: '90', tipo: '6', margen: '10' })
  const coste = (n('imp') * (n('tipo') / 100) * n('dias')) / 360
  return <Tool title="Plazo de pago, financiación e impago" how="coste = importe × tipo anual × días ÷ 360 · ventas para recuperar un impago = importe impagado ÷ margen.">
    <div><F label="Importe" unit="€" {...bind('imp')} /><F label="Días de plazo" unit="días" {...bind('dias')} /><F label="Coste de financiación anual" unit="%" {...bind('tipo')} /><F label="Margen sobre ventas" unit="%" {...bind('margen')} /></div>
    <div><R label="Coste de financiar el plazo" v={coste} unit="€" strong /><R label="Como % del importe" v={(coste / n('imp')) * 100} unit="%" /><R label="Coste de cada 30 días adicionales" v={(n('imp') * (n('tipo') / 100) * 30) / 360} unit="€" />
      <R label="Ventas necesarias para recuperar un impago de ese importe" v={n('imp') / (n('margen') / 100)} unit="€" d={0} /></div>
  </Tool>
}
