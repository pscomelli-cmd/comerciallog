import type { NumStep, Skill } from '../lib/types.ts'
import { f, g, pick, rnd } from '../lib/num.ts'

const N = (o: Omit<NumStep, 'kind'>): NumStep => ({ kind: 'num', ...o })
export const LB = 0.45359237 // kg por libra
export const CLB_TO_USDT = 22.0462 // ¢/lb → USD/t
const SIM = ' _(datos simulados)_'

export const SKILLS: Skill[] = [
  {
    id: 'conv-peso', title: 'Gramos, kilos y toneladas', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const [prod, gr] = pick([['paquetes de pasta', 500], ['paquetes de café molido', 250], ['paquetes de arroz', 1000], ['latas de atún', 160]] as [string, number][])
      const cajas = lv === 1 ? pick([40, 50, 60, 80]) : rnd(36, 96), u = pick([12, 20, 24])
      const kg = (cajas * u * gr) / 1000
      const pal = lv >= 3 ? rnd(8, 22) : 1
      const a = lv >= 3 ? (kg * pal) / 1000 : kg
      return N({
        id: 'conv-peso', dim: 'unidades', unit: lv >= 3 ? 't' : 'kg', a,
        q: `Un palé lleva **${cajas} cajas** de **${u} ${prod} de ${g(gr)} g**. ` + (lv >= 3 ? `¿Cuántas **toneladas** netas suman **${pal} palés**?` : '¿Cuántos **kg** netos de producto lleva el palé?'),
        hints: ['Primero contá unidades: cajas × unidades por caja.', 'Después pasá a gramos (× gramos por unidad) y dividí entre 1.000 para tener kilos.', lv >= 3 ? `Operación: ${cajas} × ${u} × ${g(gr)} ÷ 1000 × ${pal} ÷ 1000` : `Operación: ${cajas} × ${u} × ${g(gr)} ÷ 1000`],
        sol: [`Unidades: ${cajas} × ${u} = ${f(cajas * u, 0)}`, `Gramos: ${f(cajas * u, 0)} × ${g(gr)} g = ${f(cajas * u * gr, 0)} g`, `Kilos: ÷ 1.000 = **${g(kg)} kg**`, ...(lv >= 3 ? [`${pal} palés: ${g(kg)} × ${pal} = ${f(kg * pal, 0)} kg → ÷ 1.000 = **${g(a)} t**`] : [])],
        keys: lv >= 3 ? `${cajas} × ${u} × ${g(gr)} ÷ 1000 × ${pal} ÷ 1000 =` : `${cajas} × ${u} × ${g(gr)} ÷ 1000 =`,
        mental: gr === 500 ? 'Con paquetes de 500 g, los kilos son la mitad de las unidades.' : gr === 250 ? 'Con paquetes de 250 g, los kilos son un cuarto de las unidades.' : undefined,
        means: 'El peso neto por palé es la base para saber cuántos palés hacen falta para un pedido en kilos y si un camión se llena antes por peso o por espacio.',
      })
    },
  },
  {
    id: 'conv-cajas', title: 'Unidades → cajas → palés', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const upc = pick([12, 24, 48]), cpp = pick([40, 50, 60])
      const cajasExact = lv === 1 ? cpp * rnd(2, 5) : rnd(70, 400)
      const uds = cajasExact * upc - (lv >= 3 ? rnd(1, upc - 1) : 0)
      const cajas = Math.ceil(uds / upc), pal = Math.ceil(cajas / cpp)
      return N({
        id: 'conv-cajas', dim: 'unidades', unit: 'palés', a: pal, tol: 0,
        q: `Un cliente pide **${f(uds, 0)} latas de atún**. Van en cajas de **${upc} latas** y cada palé admite **${cpp} cajas**. ¿Cuántos **palés** (enteros) necesitás preparar?`,
        hints: ['Dos pasos: primero cajas, después palés.', 'Una caja o un palé empezado ocupa igual: se redondea siempre hacia arriba.', `Operación: ${f(uds, 0)} ÷ ${upc} → redondeá hacia arriba → ÷ ${cpp} → redondeá hacia arriba.`],
        sol: [`Cajas: ${f(uds, 0)} ÷ ${upc} = ${g(uds / upc, 2)} → **${cajas} cajas**`, `Palés: ${cajas} ÷ ${cpp} = ${g(cajas / cpp, 2)} → **${pal} palés**`],
        keys: `${uds} ÷ ${upc} =  y luego  ${cajas} ÷ ${cpp} =`,
        excel: `=ARROTONDA.PER.ECC(ARROTONDA.PER.ECC(${uds}/${upc};0)/${cpp};0)`,
        traps: [{ v: cajas, kind: 'unidades', msg: 'Ese número son cajas, no palés. Falta el segundo paso.' }, { v: Math.floor(cajas / cpp), kind: 'supuesto', msg: 'Redondeaste hacia abajo: quedarían cajas sin palé. En logística se redondea hacia arriba.' }],
        means: 'El transporte se contrata por palés completos (o por camión), no por fracciones. Un palé incompleto suele costar como uno entero: por eso conviene saber cuántas unidades faltan para llenarlo antes de cerrar el pedido.',
      })
    },
  },
  {
    id: 'regla3', title: 'Proporciones y regla de tres', sector: 'arroz', topic: 'bases',
    gen: (lv) => {
      const t1 = lv === 1 ? pick([10, 20, 25]) : rnd(12, 28), price = lv === 1 ? pick([600, 800, 900]) : rnd(610, 980)
      const t2 = lv === 1 ? t1 + pick([5, 10]) : rnd(30, 60)
      const total = t1 * price, a = t2 * price
      return N({
        id: 'regla3', dim: 'calculo', unit: '€', a,
        q: `**${t1} t** de arroz largo a granel costaron **${f(total, 0)} €**${SIM}. Al mismo precio, ¿cuánto costarían **${t2} t**?`,
        hints: ['Buscá primero cuánto cuesta 1 tonelada.', 'Regla de tres: importe conocido ÷ cantidad conocida × cantidad nueva.', `Operación: ${total} ÷ ${t1} × ${t2}`],
        sol: [`Precio de 1 t: ${f(total, 0)} ÷ ${t1} = ${f(price, 0)} €/t`, `${t2} t × ${f(price, 0)} €/t = **${f(a, 0)} €**`],
        keys: `${total} ÷ ${t1} × ${t2} =`,
        mental: 'Pasar siempre por «el valor de 1» evita equivocarse sobre qué multiplica y qué divide.',
        traps: [{ v: (total * t1) / t2, kind: 'interpretacion', msg: 'Invertiste la proporción: más toneladas al mismo precio deben costar más, no menos.' }],
        means: 'La regla de tres solo vale si el precio unitario se mantiene. En la práctica, más volumen suele cambiar el precio (descuento) o el flete por tonelada: comprobá ese supuesto antes de extrapolar.',
      })
    },
  },
  {
    id: 'pct-de', title: 'Porcentaje de una cantidad', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const base = lv === 1 ? pick([2000, 5000, 12000, 40000]) : rnd(31, 980) * 100, pct = lv === 1 ? pick([2, 3, 5, 10]) : pick([1.5, 2.5, 4, 7.5, 12])
      const a = (base * pct) / 100
      return N({
        id: 'pct-de', dim: 'calculo', unit: '€', a,
        q: `Un distribuidor pide un **descuento del ${g(pct)} %** sobre una factura de **${f(base, 0)} €**. ¿Cuántos **euros** de descuento son?`,
        hints: ['«Por ciento» significa «de cada 100».', `${g(pct)} % = ${g(pct)} ÷ 100 = ${g(pct / 100)}. Multiplicá la factura por ese decimal.`, `Operación: ${base} × ${g(pct)} ÷ 100`],
        sol: [`${g(pct)} % como decimal: ${g(pct / 100)}`, `${f(base, 0)} × ${g(pct / 100)} = **${f(a)} €**`],
        keys: `${base} × ${g(pct)} % =`,
        mental: `El 10 % es correr la coma un lugar (${f(base / 10, 0)}); el 1 % dos lugares (${f(base / 100, 0)}). Combiná: ${g(pct)} % = ${g(pct)} veces el 1 %.`,
        excel: `=${base}*${g(pct)}%`,
        means: 'Un descuento «pequeño» en porcentaje se resta entero del beneficio. Si tu margen es del 8 %, un descuento del 2 % se lleva una cuarta parte.',
      })
    },
  },
  {
    id: 'pct-var', title: 'Variación porcentual', sector: 'salmon', topic: 'bases',
    gen: (lv) => {
      const p0 = lv === 1 ? pick([5, 8, 10]) : rnd(620, 940) / 100
      const up = Math.random() < 0.6
      const p1 = lv === 1 ? p0 + pick([0.5, 1, 2]) * (up ? 1 : -1) : Math.round(p0 * (1 + (up ? 1 : -1) * rnd(4, 22) / 100) * 100) / 100
      const a = ((p1 - p0) / p0) * 100
      return N({
        id: 'pct-var', dim: 'calculo', unit: '%', a, tol: 0.01,
        q: `El salmón fresco entero pasó de **${f(p0)} €/kg** a **${f(p1)} €/kg** en dos semanas${SIM}. ¿Cuál es la **variación porcentual**? (Si baja, respondé en negativo.)`,
        hints: ['Variación = (valor nuevo − valor anterior) ÷ valor anterior.', 'El denominador es siempre el punto de partida, no el de llegada.', `Operación: (${g(p1)} − ${g(p0)}) ÷ ${g(p0)} × 100`],
        sol: [`Diferencia: ${f(p1)} − ${f(p0)} = ${f(p1 - p0)} €/kg`, `Sobre el precio inicial: ${f(p1 - p0)} ÷ ${f(p0)} = ${g((p1 - p0) / p0, 4)}`, `× 100 = **${f(a, 1)} %**`],
        keys: `(${g(p1)} − ${g(p0)}) ÷ ${g(p0)} × 100 =`,
        excel: '=(B2-A2)/A2   (con formato porcentaje)',
        traps: [{ v: ((p1 - p0) / p1) * 100, kind: 'interpretacion', msg: 'Dividiste entre el precio nuevo. La variación se mide sobre el precio de partida.' }, { v: p1 - p0, kind: 'unidades', msg: 'Eso es la diferencia en €/kg, no el porcentaje. Falta dividir entre el precio inicial.' }],
        means: 'En fresco, las variaciones semanales pueden superar tu margen. Saber el % permite decidir rápido si el precio pactado con el cliente sigue siendo viable.',
      })
    },
  },
  {
    id: 'pct-inverso', title: 'Deshacer un porcentaje', sector: 'cafe', topic: 'bases',
    gen: (lv) => {
      const pct = lv === 1 ? pick([10, 20, 25]) : rnd(4, 18), p0 = lv === 1 ? pick([8, 10, 12]) : rnd(720, 1380) / 100
      const p1 = Math.round(p0 * (1 + pct / 100) * 100) / 100, a = p1 / (1 + pct / 100)
      return N({
        id: 'pct-inverso', dim: 'interpretacion', unit: '€/kg', a,
        q: `Tras una **subida del ${pct} %**, tu café tostado cuesta **${f(p1)} €/kg**${SIM}. ¿Cuánto costaba **antes** de la subida?`,
        hints: ['El precio nuevo es el anterior multiplicado por (1 + porcentaje).', `Precio nuevo = precio anterior × ${g(1 + pct / 100)}. Para deshacerlo, dividí.`, `Operación: ${g(p1)} ÷ ${g(1 + pct / 100)}`],
        sol: [`Subir ${pct} % es multiplicar por ${g(1 + pct / 100)}`, `Precio anterior = ${f(p1)} ÷ ${g(1 + pct / 100)} = **${f(a)} €/kg**`],
        keys: `${g(p1)} ÷ ${g(1 + pct / 100)} =`,
        traps: [{ v: p1 * (1 - pct / 100), kind: 'interpretacion', msg: `Restaste el ${pct} % del precio nuevo. Pero el ${pct} % se calculó sobre el precio anterior, que es más bajo: hay que dividir entre ${g(1 + pct / 100)}.` }],
        means: 'Una subida del 20 % no se deshace con una bajada del 20 %. Lo mismo ocurre con márgenes y recargos: el porcentaje depende de la base sobre la que se calcula.',
      })
    },
  },
  {
    id: 'media-pond', title: 'Media ponderada y coste de mezcla', sector: 'cafe', topic: 'bases',
    gen: (lv) => {
      const pa = lv === 1 ? pick([60, 70, 80]) : rnd(11, 17) * 5, ca = rnd(580, 720) / 100, cr = rnd(380, 470) / 100
      const kg = lv >= 2 ? rnd(8, 30) * 100 : 0
      const a = (pa * ca + (100 - pa) * cr) / 100
      const qa = (kg * pa) / 100, qr = kg - qa
      return N({
        id: 'media-pond', dim: 'calculo', unit: '€/kg', a,
        q: (kg ? `Una mezcla lleva **${f(qa, 0)} kg de arábica** a **${f(ca)} €/kg** y **${f(qr, 0)} kg de robusta** a **${f(cr)} €/kg**` : `Una mezcla lleva **${pa} % de arábica** a **${f(ca)} €/kg** y **${100 - pa} % de robusta** a **${f(cr)} €/kg**`) + `${SIM}. ¿Cuál es el **coste por kg de la mezcla** (café verde)?`,
        hints: ['No es el promedio simple: cada café pesa según su proporción.', kg ? 'Coste total de cada parte (kg × precio), sumá y dividí entre los kg totales.' : 'Multiplicá cada precio por su proporción en decimal y sumá.', kg ? `Operación: (${qa} × ${g(ca)} + ${qr} × ${g(cr)}) ÷ ${kg}` : `Operación: ${g(pa / 100)} × ${g(ca)} + ${g(1 - pa / 100)} × ${g(cr)}`],
        sol: kg ? [`Arábica: ${f(qa, 0)} × ${f(ca)} = ${f(qa * ca)} €`, `Robusta: ${f(qr, 0)} × ${f(cr)} = ${f(qr * cr)} €`, `Total ${f(qa * ca + qr * cr)} € ÷ ${f(kg, 0)} kg = **${f(a, 3)} €/kg**`]
          : [`Arábica: ${g(pa / 100)} × ${f(ca)} = ${f((pa * ca) / 100, 3)}`, `Robusta: ${g(1 - pa / 100)} × ${f(cr)} = ${f(((100 - pa) * cr) / 100, 3)}`, `Suma = **${f(a, 3)} €/kg**`],
        keys: kg ? `(${qa} × ${g(ca)} + ${qr} × ${g(cr)}) ÷ ${kg} =` : `${pa}% × ${g(ca)} + ${100 - pa}% × ${g(cr)} =`,
        excel: '=MATR.SOMMA.PRODOTTO(B2:B3;C2:C3)/SOMMA(B2:B3)',
        traps: [{ v: (ca + cr) / 2, kind: 'supuesto', msg: 'Calculaste el promedio simple, que supone mitad y mitad. Las proporciones no son iguales: hay que ponderar.' }],
        means: 'Comprobación rápida: el resultado debe quedar entre los dos precios y más cerca del componente con mayor proporción. Cambiar 10 puntos de arábica por robusta abarata la mezcla, pero también cambia el producto que recibe el cliente.',
      })
    },
  },
  {
    id: 'neto', title: 'De venta bruta a venta neta', sector: 'pasta', topic: 'bases',
    gen: (lv) => {
      const bruto = lv === 1 ? pick([10000, 50000, 80000]) : rnd(120, 950) * 100, d = pick([3, 4, 5, 8]), rp = lv === 1 ? 0 : pick([1, 1.5, 2, 3])
      const n1 = bruto * (1 - d / 100), a = n1 * (1 - rp / 100)
      return N({
        id: 'neto', dim: 'calculo', unit: '€', a,
        q: `Facturás **${f(bruto, 0)} €** brutos de pasta a una cadena. Tiene **${d} % de descuento en factura**` + (rp ? ` y un **rappel anual del ${g(rp)} %** sobre lo facturado neto` : '') + `${SIM}. ¿Cuál es tu **venta neta** final?`,
        hints: ['Descontar un d % es quedarse con (100 − d) %.', rp ? 'El rappel se aplica después, sobre el importe ya descontado: se encadenan multiplicaciones.' : `Multiplicá por ${g(1 - d / 100)}.`, rp ? `Operación: ${bruto} × ${g(1 - d / 100)} × ${g(1 - rp / 100)}` : `Operación: ${bruto} × ${g(1 - d / 100)}`],
        sol: [`Tras descuento: ${f(bruto, 0)} × ${g(1 - d / 100)} = ${f(n1)} €`, ...(rp ? [`Tras rappel: ${f(n1)} × ${g(1 - rp / 100)} = **${f(a)} €**`] : [])],
        keys: rp ? `${bruto} × ${g(1 - d / 100)} × ${g(1 - rp / 100)} =` : `${bruto} × ${g(1 - d / 100)} =`,
        excel: rp ? '=A2*(1-B2)*(1-C2)' : '=A2*(1-B2)',
        traps: rp ? [{ v: bruto * (1 - (d + rp) / 100), kind: 'supuesto', msg: 'Sumaste los dos porcentajes. Así funcionaría si ambos se calcularan sobre el bruto; aquí el rappel se calcula sobre el neto facturado. Leé siempre sobre qué base se aplica cada condición.' }] : [],
        means: 'El margen se mide sobre la venta neta, no sobre la tarifa. El rappel se paga más tarde (movimiento de caja diferido), pero es un menor ingreso desde el primer día: hay que provisionarlo al calcular la rentabilidad del cliente.',
      })
    },
  },
  {
    id: 'margen', title: 'Margen sobre ventas', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const c = lv === 1 ? pick([6, 8, 15]) : rnd(310, 1490) / 100
      const p = lv === 1 ? c + pick([2, 4, 5]) : Math.round(c * (1 + rnd(8, 45) / 100) * 100) / 100
      const a = ((p - c) / p) * 100
      return N({
        id: 'margen', dim: 'interpretacion', unit: '%', a, tol: 0.01,
        q: `Un producto te cuesta **${f(c)} €/kg** entregado y lo vendés a **${f(p)} €/kg** netos. ¿Cuál es tu **margen sobre ventas**?`,
        hints: ['Margen = beneficio ÷ precio de venta.', 'El denominador es la venta (lo que entra), no el coste.', `Operación: (${g(p)} − ${g(c)}) ÷ ${g(p)} × 100`],
        sol: [`Beneficio: ${f(p)} − ${f(c)} = ${f(p - c)} €/kg`, `Sobre la venta: ${f(p - c)} ÷ ${f(p)} = ${g((p - c) / p, 4)} → **${f(a, 1)} %**`],
        keys: `(${g(p)} − ${g(c)}) ÷ ${g(p)} × 100 =`,
        excel: '=(B2-A2)/B2',
        traps: [{ v: ((p - c) / c) * 100, kind: 'interpretacion', msg: 'Eso es el recargo sobre coste (dividiste entre el coste). El margen divide entre el precio de venta, y siempre da un número menor.' }],
        means: 'Cuando dirección habla de «margen» casi siempre se refiere a este: qué parte de cada euro vendido queda como beneficio bruto. Con el mismo par coste-precio, el recargo siempre es mayor que el margen: confundirlos lleva a prometer rentabilidades que no existen.',
      })
    },
  },
  {
    id: 'precio-margen', title: 'Precio a partir de un margen objetivo', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const c = lv === 1 ? pick([6, 9, 12]) : rnd(310, 1490) / 100, m = lv === 1 ? pick([20, 25, 40]) : rnd(8, 35)
      const a = c / (1 - m / 100)
      return N({
        id: 'precio-margen', dim: 'interpretacion', unit: '€/kg', a,
        q: `Tu coste total entregado es **${f(c)} €/kg**. Dirección exige un **margen del ${m} % sobre ventas**. ¿A qué **precio** tenés que vender?`,
        hints: [`Si el margen es ${m} % de la venta, el coste es el ${100 - m} % restante.`, `Coste = precio × ${g(1 - m / 100)}. Despejá el precio dividiendo.`, `Operación: ${g(c)} ÷ ${g(1 - m / 100)}`],
        sol: [`El coste representa ${100 - m} % del precio`, `Precio = ${f(c)} ÷ ${g(1 - m / 100)} = **${f(a)} €/kg**`, `Comprobación: (${f(a)} − ${f(c)}) ÷ ${f(a)} = ${m} %`],
        keys: `${g(c)} ÷ (1 − ${m}%) =`,
        excel: '=A2/(1-B2)',
        mental: 'Márgenes «redondos»: 20 % → dividir entre 0,8 (= multiplicar por 1,25). 25 % → ÷ 0,75 (× 1,333). 50 % → × 2.',
        traps: [{ v: c * (1 + m / 100), kind: 'interpretacion', msg: `Sumaste el ${m} % al coste: eso es un recargo, y deja un margen sobre ventas menor (${f((m / (100 + m)) * 100, 1)} %). Para un margen, dividí entre (1 − margen).` }],
        means: 'Esta división es la operación más útil de un comercial: convierte un coste en un precio mínimo. Por debajo de ese precio estás regalando margen; conviene conocerlo antes de sentarte a negociar.',
      })
    },
  },
  {
    id: 'recargo-margen', title: 'De recargo a margen', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const rc = lv === 1 ? pick([25, 50, 100]) : rnd(10, 60), a = (rc / (100 + rc)) * 100
      return N({
        id: 'recargo-margen', dim: 'interpretacion', unit: '%', a, tol: 0.01,
        q: `Un compañero calcula precios sumando un **${rc} % al coste** (recargo). ¿Qué **margen sobre ventas** obtiene realmente?`,
        hints: ['Usá un coste de 100 para verlo fácil.', `Coste 100 → precio ${100 + rc}. El beneficio es ${rc}. ¿Qué parte del precio es?`, `Operación: ${rc} ÷ ${100 + rc} × 100`],
        sol: ['Coste = 100', `Precio = 100 + ${rc} = ${100 + rc}`, `Margen = ${rc} ÷ ${100 + rc} = **${f(a, 1)} %**`],
        keys: `${rc} ÷ ${100 + rc} × 100 =`,
        excel: '=A2/(1+A2)',
        mental: 'Pares para memorizar: recargo 25 % = margen 20 % · recargo 33,3 % = margen 25 % · recargo 50 % = margen 33,3 % · recargo 100 % = margen 50 %.',
        traps: [{ v: rc, kind: 'interpretacion', msg: 'Margen y recargo no son iguales: el mismo beneficio se divide entre una base distinta (precio, que es mayor que el coste).' }],
        means: 'Cuando un cliente o proveedor dice «trabajo con un 30 %», preguntá siempre: ¿sobre coste o sobre venta? La diferencia puede ser varios puntos de rentabilidad.',
      })
    },
  },
  {
    id: 'coste-entregado', title: 'Coste total entregado', sector: 'arroz', topic: 'bases',
    gen: (lv) => {
      const t = lv === 1 ? 20 : rnd(18, 26), p = lv === 1 ? pick([700, 800]) : rnd(640, 930), fl = lv === 1 ? 600 : rnd(55, 140) * 10, man = lv === 1 ? 0 : rnd(8, 18)
      const a = (t * p + fl + t * man) / (t * 1000)
      return N({
        id: 'coste-entregado', dim: 'unidades', unit: '€/kg', a,
        q: `Comprás **${t} t** de arroz a **${f(p, 0)} €/t** recogido en el molino. El camión cuesta **${f(fl, 0)} €** por viaje` + (man ? ` y la descarga y almacenaje **${man} €/t**` : '') + `${SIM}. ¿Cuál es el **coste entregado en €/kg**?`,
        hints: ['Sumá todos los costes en la misma unidad antes de dividir.', 'El flete es por viaje (total); el precio es por tonelada. Llevá todo a € totales o todo a €/t.', `Operación: (${t} × ${p} + ${fl}${man ? ` + ${t} × ${man}` : ''}) ÷ ${t * 1000}`],
        sol: [`Compra: ${t} × ${f(p, 0)} = ${f(t * p, 0)} €`, `Flete: ${f(fl, 0)} €` + (man ? ` · Manipulación: ${t} × ${man} = ${f(t * man, 0)} €` : ''), `Total: ${f(t * p + fl + t * man, 0)} €`, `En kg: ${t} t = ${f(t * 1000, 0)} kg → **${f(a, 4)} €/kg**`],
        keys: `(${t} × ${p} + ${fl}${man ? ` + ${t} × ${man}` : ''}) ÷ ${t * 1000} =`,
        traps: [{ v: p / 1000, kind: 'supuesto', msg: 'Ese es solo el precio de compra por kg. Faltan flete y demás costes: el margen se calcula sobre el coste entregado, no sobre el de compra.' }, { v: (p + fl + man) / 1000, kind: 'unidades', msg: 'Sumaste €/t con € por viaje. El flete hay que repartirlo entre las toneladas del camión antes de sumarlo.' }],
        means: 'Dos ofertas solo son comparables cuando están en el mismo punto de entrega. Un proveedor más barato en origen puede ser más caro puesto en tu almacén.',
      })
    },
  },
  {
    id: 'contribucion', title: 'Contribución de un pedido', sector: 'atun', topic: 'bases',
    gen: (lv) => {
      const n = lv === 1 ? pick([1000, 2000, 5000]) : rnd(8, 60) * 240, pv = rnd(120, 180) / 100, cv = Math.round(pv * rnd(70, 88)) / 100, fijo = lv === 1 ? 100 : rnd(9, 40) * 10
      const a = n * (pv - cv) - fijo
      return N({
        id: 'contribucion', dim: 'calculo', unit: '€', a,
        q: `Un pedido de **${f(n, 0)} latas** de atún: precio neto **${f(pv)} €/lata**, coste variable **${f(cv)} €/lata**, y el envío de este pedido cuesta **${f(fijo, 0)} €**${SIM}. ¿Qué **contribución** deja el pedido?`,
        hints: ['Contribución unitaria = precio neto − coste variable.', 'Multiplicá por las unidades y restá los costes propios del pedido.', `Operación: ${n} × (${g(pv)} − ${g(cv)}) − ${fijo}`],
        sol: [`Por lata: ${f(pv)} − ${f(cv)} = ${f(pv - cv)} €`, `Por las ${f(n, 0)} latas: ${f(n * (pv - cv))} €`, `Menos envío: − ${f(fijo, 0)} € = **${f(a)} €**`],
        keys: `${n} × (${g(pv)} − ${g(cv)}) − ${fijo} =`,
        excel: '=A2*(B2-C2)-D2',
        traps: [{ v: n * (pv - cv), kind: 'supuesto', msg: 'Olvidaste el coste de envío del pedido. Los costes que existen solo porque existe el pedido se le restan a él.' }],
        means: 'La contribución dice cuánto aporta el pedido a cubrir costes fijos y beneficio. Un pedido pequeño con envío propio puede dejar contribución negativa aunque el margen por lata sea bueno: de ahí los pedidos mínimos.',
      })
    },
  },
  {
    id: 'financiacion', title: 'Coste de financiar un plazo de cobro', sector: 'comun', topic: 'bases',
    gen: (lv) => {
      const v = lv === 1 ? pick([36000, 72000, 120000]) : rnd(25, 300) * 1000, d = pick([30, 60, 90, 120]), i = lv === 1 ? 6 : pick([4.5, 5, 7, 8])
      const a = (v * i * d) / 36000
      return N({
        id: 'financiacion', dim: 'supuestos', unit: '€', a,
        q: `Vendés **${f(v, 0)} €** y el cliente paga a **${d} días**. Tu empresa financia su circulante al **${g(i)} % anual**${SIM}. ¿Cuánto **cuesta financiar** esa venta hasta el cobro? (año comercial de 360 días)`,
        hints: ['El tipo es anual: solo usás la parte del año que dura el plazo.', `Fracción del año: ${d} ÷ 360.`, `Operación: ${v} × ${g(i)} % × ${d} ÷ 360`],
        sol: [`Interés de un año entero: ${f(v, 0)} × ${g(i)} % = ${f((v * i) / 100)} €`, `Proporción del año: ${d} ÷ 360 = ${g(d / 360, 4)}`, `Coste: **${f(a)} €** (${f((a / v) * 100, 2)} % de la venta)`],
        keys: `${v} × ${g(i)} % × ${d} ÷ 360 =`,
        excel: '=A2*B2*C2/360',
        mental: `Al ${g(i)} % anual, cada 30 días cuestan ${g(i / 12, 3)} % de la venta.`,
        traps: [{ v: (v * i) / 100, kind: 'supuesto', msg: 'Aplicaste el interés de un año entero. El plazo es solo una fracción del año.' }],
        means: 'Conceder 30 días más de plazo equivale a un descuento. Traducirlo a euros y a % de la venta te permite compararlo con un descuento directo o pedir algo a cambio. Ojo: el interés es un coste; el dinero inmovilizado es un movimiento de caja. Son cosas distintas.',
      })
    },
  },
  /* ---------------- CAFÉ ---------------- */
  {
    id: 'cafe-clb', title: 'Arábica: de ¢/lb a €/kg', sector: 'cafe', topic: 'cafe',
    gen: (lv) => {
      const c = lv === 1 ? pick([200, 250, 300]) : rnd(215, 395), fx = lv === 1 ? 1.1 : rnd(102, 118) / 100
      const usdkg = c / 100 / LB, a = usdkg / fx
      return N({
        id: 'cafe-clb', dim: 'unidades', unit: '€/kg', a,
        q: `Una oferta de **arábica** indica **${c} ¢/lb** (centavos de dólar por libra). Con un tipo de cambio de **1 € = ${f(fx)} USD**${SIM}, ¿cuánto es en **€/kg**? Usá 1 lb = 0,4536 kg.`,
        hints: ['Tres conversiones: centavos → dólares, libras → kilos, dólares → euros.', 'Un kilo tiene más de dos libras, así que el precio por kg es mayor que por lb: se divide entre 0,4536. Y como 1 € vale más de 1 USD, en euros da menos: se divide entre el tipo de cambio.', `Operación: ${c} ÷ 100 ÷ 0,4536 ÷ ${g(fx)}`],
        sol: [`Centavos a dólares: ${c} ÷ 100 = ${f(c / 100)} USD/lb`, `Libras a kilos: ${f(c / 100)} ÷ 0,4536 = ${f(usdkg, 4)} USD/kg`, `Dólares a euros: ${f(usdkg, 4)} ÷ ${f(fx)} = **${f(a, 4)} €/kg**`],
        keys: `${c} ÷ 100 ÷ 0,4536 ÷ ${g(fx)} =`,
        mental: `Atajo: ¢/lb × 22,046 ≈ USD/t. ${c} × 22 ≈ ${f(c * 22, 0)} USD/t ≈ ${f((c * 22) / 1000, 2)} USD/kg.`,
        excel: '=A2/100/0,45359/B2',
        traps: [{ v: usdkg * fx, kind: 'unidades', msg: 'Multiplicaste por el tipo de cambio. Si 1 € = ' + f(fx) + ' USD, para pasar de dólares a euros hay que dividir (un euro «compra» más de un dólar).' }, { v: (c / 100) * LB / fx, kind: 'unidades', msg: 'Multiplicaste por 0,4536 en vez de dividir. Un kilo son unas 2,2 libras: el precio por kilo tiene que ser mayor que el precio por libra.' }, { v: usdkg, kind: 'unidades', msg: 'Ese resultado está en USD/kg. Falta pasar a euros.' }],
        means: 'El arábica se referencia en ¢/lb; tu cliente compra en €/kg. Esta conversión es el puente diario entre el mercado y tu oferta. Un error de unidades aquí se multiplica por miles de kilos.',
      })
    },
  },
  {
    id: 'cafe-robusta', title: 'Robusta: de USD/t a €/kg', sector: 'cafe', topic: 'cafe',
    gen: (lv) => {
      const u = lv === 1 ? pick([4000, 4400, 5500]) : rnd(380, 560) * 10, fx = lv === 1 ? 1.1 : rnd(102, 118) / 100, a = u / 1000 / fx
      return N({
        id: 'cafe-robusta', dim: 'unidades', unit: '€/kg', a,
        q: `Una oferta de **robusta** indica **${f(u, 0)} USD/t**. Con **1 € = ${f(fx)} USD**${SIM}, ¿cuánto es en **€/kg**?`,
        hints: ['El robusta se referencia en dólares por tonelada métrica: no hay libras aquí.', '1 t = 1.000 kg. Después, dólares a euros dividiendo entre el tipo de cambio.', `Operación: ${u} ÷ 1000 ÷ ${g(fx)}`],
        sol: [`Por kg: ${f(u, 0)} ÷ 1.000 = ${f(u / 1000, 3)} USD/kg`, `En euros: ${f(u / 1000, 3)} ÷ ${f(fx)} = **${f(a, 4)} €/kg**`],
        keys: `${u} ÷ 1000 ÷ ${g(fx)} =`,
        traps: [{ v: (u / 1000) * fx, kind: 'unidades', msg: 'Multiplicaste por el tipo de cambio: para pasar de USD a EUR con una cotización «USD por euro» hay que dividir.' }, { v: u / 100 / LB / fx, kind: 'supuesto', msg: 'Aplicaste la conversión del arábica (¢/lb). El robusta se cotiza en USD por tonelada: no mezcles las unidades de las dos referencias.' }],
        means: 'Arábica y robusta tienen referencias de mercado y unidades distintas. Antes de comparar o mezclar, llevá ambos a €/kg en el mismo punto de entrega.',
      })
    },
  },
  {
    id: 'cafe-dif', title: 'Referencia + diferencial = precio físico', sector: 'cafe', topic: 'cafe',
    gen: (lv) => {
      const fut = lv === 1 ? pick([250, 300]) : rnd(220, 380), dif = (lv === 1 ? pick([10, 20]) : rnd(3, 45)) * pick([1, -1])
      const clb = fut + dif, a = lv >= 2 ? clb * CLB_TO_USDT : clb
      return N({
        id: 'cafe-dif', dim: 'interpretacion', unit: lv >= 2 ? 'USD/t' : '¢/lb', a,
        q: `Oferta de arábica: «**${dif > 0 ? '+' : '−'}${Math.abs(dif)} ¢/lb** sobre la referencia de futuros». La referencia está a **${fut} ¢/lb**${SIM}. ¿Cuál es el **precio físico** en ${lv >= 2 ? '**USD/t**? (1 ¢/lb = 22,046 USD/t)' : '**¢/lb**?'}`,
        hints: ['Precio físico = referencia de mercado + diferencial.', `El diferencial es ${dif > 0 ? 'positivo: se suma (prima)' : 'negativo: se resta (descuento)'}.`, lv >= 2 ? `Operación: (${fut} ${dif > 0 ? '+' : '−'} ${Math.abs(dif)}) × 22,046` : `Operación: ${fut} ${dif > 0 ? '+' : '−'} ${Math.abs(dif)}`],
        sol: [`${fut} ${dif > 0 ? '+' : '−'} ${Math.abs(dif)} = ${clb} ¢/lb`, ...(lv >= 2 ? [`${clb} × 22,046 = **${f(a, 0)} USD/t**`] : [])],
        keys: lv >= 2 ? `(${fut} ${dif > 0 ? '+' : '−'} ${Math.abs(dif)}) × 22,046 =` : `${fut} ${dif > 0 ? '+' : '−'} ${Math.abs(dif)} =`,
        traps: [{ v: lv >= 2 ? (fut - dif) * CLB_TO_USDT : fut - dif, kind: 'interpretacion', msg: 'Aplicaste el diferencial con el signo contrario. Un diferencial positivo es una prima; uno negativo, un descuento.' }],
        means: 'El diferencial refleja calidad, origen, disponibilidad y condiciones de entrega de ese café concreto. La referencia se mueve cada día; el diferencial se negocia. En un contrato «pendiente de fijación» pactás hoy el diferencial y la referencia se fija más adelante.',
      })
    },
  },
  {
    id: 'cafe-merma', title: 'Coste del café tostado (merma)', sector: 'cafe', topic: 'cafe',
    gen: (lv) => {
      const c = lv === 1 ? pick([5, 6, 8]) : rnd(480, 760) / 100, m = lv === 1 ? 20 : rnd(13, 19), a = c / (1 - m / 100)
      return N({
        id: 'cafe-merma', dim: 'supuestos', unit: '€/kg tostado', a,
        q: `El café verde te cuesta **${f(c)} €/kg** puesto en almacén. En el tueste pierde un **${m} % de peso** (merma simulada). ¿Cuánto cuesta la materia prima **por kg de café tostado**?`,
        hints: ['Pagaste por 1 kg de verde, pero después de tostar te queda menos de 1 kg.', `De 1 kg verde salen ${g(1 - m / 100)} kg tostados. El mismo dinero se reparte entre menos kilos: dividí.`, `Operación: ${g(c)} ÷ ${g(1 - m / 100)}`],
        sol: [`Rendimiento: 1 − ${g(m / 100)} = ${g(1 - m / 100)} kg tostado por kg verde`, `Coste: ${f(c)} ÷ ${g(1 - m / 100)} = **${f(a, 3)} €/kg tostado**`],
        keys: `${g(c)} ÷ (1 − ${m}%) =`,
        excel: '=A2/(1-B2)',
        traps: [{ v: c * (1 + m / 100), kind: 'supuesto', msg: `Sumaste un ${m} % al coste. La merma reduce los kilos, no aumenta los euros: hay que dividir el coste entre el rendimiento (${g(1 - m / 100)}). La diferencia parece pequeña pero es sistemática.` }, { v: c * (1 - m / 100), kind: 'interpretacion', msg: 'El coste por kg tostado tiene que ser mayor que el del verde, no menor: el mismo gasto se reparte entre menos kilos.' }],
        means: 'Es la misma lógica que el rendimiento del filete de salmón o del arroz blanco: cuando un proceso pierde peso, el coste por kilo útil sube dividiendo entre el rendimiento. La merma real depende del grado de tueste y de la humedad del verde: pedila a producción, no la supongas.',
      })
    },
  },
  {
    id: 'cafe-sacos', title: 'Sacos de verde para un pedido de tostado', sector: 'cafe', topic: 'cafe',
    gen: (lv) => {
      const kg = lv === 1 ? pick([1000, 2000, 5000]) : rnd(12, 180) * 100, m = lv === 1 ? 20 : rnd(13, 19), saco = lv >= 3 ? 69 : 60
      const verde = kg / (1 - m / 100), a = Math.ceil(verde / saco)
      return N({
        id: 'cafe-sacos', dim: 'unidades', unit: 'sacos', a, tol: 0,
        q: `Necesitás entregar **${f(kg, 0)} kg de café tostado**. Merma de tueste simulada: **${m} %**. El verde viene en **sacos de ${saco} kg**. ¿Cuántos **sacos enteros** hay que comprar como mínimo?`,
        hints: ['Hace falta más verde que tostado: el verde pierde peso.', `Verde necesario = tostado ÷ ${g(1 - m / 100)}. Luego dividí entre ${saco} y redondeá hacia arriba.`, `Operación: ${kg} ÷ ${g(1 - m / 100)} ÷ ${saco} → hacia arriba`],
        sol: [`Verde necesario: ${f(kg, 0)} ÷ ${g(1 - m / 100)} = ${f(verde, 1)} kg`, `Sacos: ${f(verde, 1)} ÷ ${saco} = ${f(verde / saco, 2)} → **${a} sacos**`],
        keys: `${kg} ÷ (1 − ${m}%) ÷ ${saco} =`,
        excel: `=ARROTONDA.PER.ECC(A2/(1-B2)/${saco};0)`,
        traps: [{ v: Math.ceil((kg * (1 + m / 100)) / saco), kind: 'supuesto', msg: `Sumaste el ${m} % al tostado. La merma se aplica sobre el verde: hay que dividir entre ${g(1 - m / 100)}, y da más kilos.` }, { v: Math.ceil(kg / saco), kind: 'supuesto', msg: 'Calculaste como si no hubiera merma: te faltaría café para cumplir el pedido.' }, { v: Math.floor(verde / saco), kind: 'supuesto', msg: 'Redondeaste hacia abajo: no alcanza. Los sacos se compran enteros.' }],
        means: 'Planificar compras «hacia atrás» desde la venta evita quedarse corto. El peso del saco depende del origen (60 kg es habitual; en otros orígenes se usan 69 o 70 kg): confirmalo siempre en la oferta.',
      })
    },
  },
  /* ---------------- OTROS SECTORES ---------------- */
  {
    id: 'atun-escurrido', title: 'Atún: precio por kg escurrido', sector: 'atun', topic: 'sectores',
    gen: (lv) => {
      const [neto, esc] = pick([[160, 112], [80, 52], [120, 84], [900, 650]] as [number, number][])
      const escv = lv === 1 ? esc : esc - pick([0, 4, 8]), p = Math.round((neto * rnd(75, 110)) / 100) / 100, a = p / (escv / 1000)
      return N({
        id: 'atun-escurrido', dim: 'unidades', unit: '€/kg escurrido', a,
        q: `Una lata de atún en aceite: **peso neto ${neto} g**, **peso escurrido ${escv} g**, precio **${f(p)} €**${SIM}. ¿Cuál es el **precio por kg escurrido**?`,
        hints: ['El peso neto incluye el líquido de cobertura; el escurrido es solo pescado.', 'Dividí el precio entre el peso escurrido expresado en kilos.', `Operación: ${g(p)} ÷ ${g(escv / 1000)}`],
        sol: [`Escurrido en kg: ${escv} g = ${g(escv / 1000)} kg`, `${f(p)} € ÷ ${g(escv / 1000)} kg = **${f(a)} €/kg escurrido**`],
        keys: `${g(p)} ÷ ${g(escv / 1000)} =`,
        excel: '=A2/(B2/1000)',
        traps: [{ v: p / (neto / 1000), kind: 'supuesto', msg: 'Dividiste entre el peso neto. Así estás pagando el aceite a precio de atún: para comparar conservas, la base es el peso escurrido.' }],
        means: 'Dos latas con el mismo neto y distinto escurrido no son el mismo producto. Compará siempre en €/kg escurrido, y aparte valorá especie, presentación (tronco, migas) y tipo de cobertura.',
      })
    },
  },
  {
    id: 'salmon-rend', title: 'Salmón: coste del filete según rendimiento', sector: 'salmon', topic: 'sectores',
    gen: (lv) => {
      const p = lv === 1 ? pick([6, 7.5, 9]) : rnd(610, 960) / 100, y = lv === 1 ? 60 : rnd(56, 68), a = p / (y / 100)
      return N({
        id: 'salmon-rend', dim: 'supuestos', unit: '€/kg filete', a,
        q: `Comprás salmón entero eviscerado a **${f(p)} €/kg**. El rendimiento en filete es **${y} %** (simulado: depende del calibre y del tipo de corte). ¿Cuál es el **coste de materia prima por kg de filete**?`,
        hints: ['De cada kilo de pescado entero solo una parte acaba siendo filete.', `De 1 kg entero salen ${g(y / 100)} kg de filete: el coste se reparte entre menos kilos.`, `Operación: ${g(p)} ÷ ${g(y / 100)}`],
        sol: [`Rendimiento ${y} % = ${g(y / 100)}`, `${f(p)} ÷ ${g(y / 100)} = **${f(a)} €/kg filete**`],
        keys: `${g(p)} ÷ ${y}% =`,
        excel: '=A2/B2',
        traps: [{ v: p * (1 + (100 - y) / 100), kind: 'supuesto', msg: 'Sumaste la merma como porcentaje al precio. Hay que dividir entre el rendimiento: con ' + y + ' % de rendimiento el coste sube bastante más.' }, { v: p * (y / 100), kind: 'interpretacion', msg: 'El filete no puede costar menos por kilo que el pescado entero del que sale.' }],
        means: 'Es la misma fórmula que la merma de tueste del café, pero con otro dato y otro riesgo: en salmón el rendimiento cambia con el calibre y el corte, y además el producto caduca en días. Un punto de rendimiento vale dinero: medilo, no lo supongas.',
      })
    },
  },
  {
    id: 'arroz-rend', title: 'Arroz: del cáscara al blanco', sector: 'arroz', topic: 'sectores',
    gen: (lv) => {
      const p = lv === 1 ? 400 : rnd(330, 480), y = lv === 1 ? 50 : rnd(52, 62), sub = lv >= 2 ? rnd(30, 70) : 0
      const a = (p - sub) / (y * 10)
      return N({
        id: 'arroz-rend', dim: 'supuestos', unit: '€/kg', a,
        q: `Comprás arroz cáscara a **${p} €/t**. De cada tonelada se obtienen **${y * 10} kg de arroz blanco entero**` + (sub ? `, y el resto (partidos, salvado, cascarilla) se vende por **${sub} €** en total` : '') + ` (rendimientos simulados). ¿Cuál es el **coste de materia prima por kg de arroz blanco entero**?`,
        hints: ['El coste de la tonelada de cáscara se reparte solo entre los kilos de blanco entero.', sub ? 'Restá primero lo que recuperás vendiendo los subproductos.' : 'Dividí el coste de la tonelada entre los kilos obtenidos.', `Operación: ${sub ? `(${p} − ${sub})` : p} ÷ ${y * 10}`],
        sol: [sub ? `Coste neto de subproductos: ${p} − ${sub} = ${p - sub} €` : `Coste: ${p} € por tonelada de cáscara`, `÷ ${y * 10} kg de blanco entero = **${f(a, 3)} €/kg**`],
        keys: `${sub ? `(${p} − ${sub})` : p} ÷ ${y * 10} =`,
        traps: [{ v: p / 1000, kind: 'supuesto', msg: 'Dividiste entre 1.000 kg, como si todo el cáscara se convirtiera en arroz blanco entero. El rendimiento industrial es bastante menor.' }, ...(sub ? [{ v: p / (y * 10), kind: 'supuesto' as const, msg: 'No descontaste el ingreso por subproductos. En arroz, partidos y salvado tienen valor y reducen el coste del producto principal.' }] : [])],
        means: 'A diferencia del café (donde la merma se evapora), en arroz lo que no es producto principal se vende como subproducto. Misma fórmula de rendimiento, supuesto distinto: hay que restar el valor recuperado.',
      })
    },
  },
  {
    id: 'pasta-volumen', title: 'Camión: ¿límite por peso o por espacio?', sector: 'pasta', topic: 'logistica',
    gen: (lv) => {
      const [prod, w] = pick([['spaghetti (formato denso)', 880], ['fusilli (formato voluminoso)', 430], ['arroz envasado de 1 kg', 1020], ['café tostado en paquetes', 520], ['penne rigate', 560]] as [string, number][])
      const pw = lv === 1 ? w : w + rnd(-30, 30), max = 24000, huecos = 33
      const porPeso = Math.floor(max / pw), a = Math.min(huecos, porPeso)
      return N({
        id: 'pasta-volumen', dim: 'razonamiento', unit: 'palés', a, tol: 0,
        q: `Un camión admite **${huecos} palés** en el suelo y **${f(max, 0)} kg** de carga útil (valores típicos simulados; dependen del vehículo y la normativa). Cada palé de **${prod}** pesa **${pw} kg** brutos. ¿Cuántos **palés** podés cargar como máximo?`,
        hints: ['Hay dos límites: el espacio y el peso. Manda el que se alcanza primero.', `Por peso: ${f(max, 0)} ÷ ${pw}, redondeado hacia abajo. Comparalo con los ${huecos} huecos.`, `Operación: ${max} ÷ ${pw} → hacia abajo; quedate con el menor entre ese número y ${huecos}.`],
        sol: [`Límite por peso: ${f(max, 0)} ÷ ${pw} = ${f(max / pw, 1)} → ${porPeso} palés`, `Límite por espacio: ${huecos} palés`, `Manda el menor: **${a} palés** (${porPeso < huecos ? 'limita el peso: sobra espacio' : 'limita el espacio: sobra capacidad de peso'})`],
        keys: `${max} ÷ ${pw} =`,
        excel: `=MIN(${huecos};ARROTONDA.PER.DIF(${max}/${pw};0))`,
        traps: [{ v: huecos, kind: 'supuesto', msg: 'Supusiste que el camión se llena por espacio. Con este producto el peso se agota antes.' }, { v: porPeso, kind: 'supuesto', msg: 'Por peso cabrían más, pero no hay más huecos de palé en el suelo.' }],
        means: 'El coste de transporte por kilo depende de qué límite se alcanza: un producto voluminoso «transporta aire» y un producto denso deja huecos vacíos. Por eso el mismo flete repercute distinto en pasta corta, pasta larga, arroz o café.',
      })
    },
  },
  {
    id: 'cobertura', title: 'Cobertura de stock en días', sector: 'cafe', topic: 'logistica',
    gen: (lv) => {
      const cons = lv === 1 ? pick([100, 200, 500]) : rnd(12, 95) * 10, dias = lv === 1 ? pick([10, 20, 30]) : rnd(9, 60)
      const stock = cons * dias + (lv >= 2 ? rnd(0, cons - 1) : 0), sem = lv >= 3
      const a = stock / cons
      return N({
        id: 'cobertura', dim: 'calculo', unit: 'días', a, tol: 0.02,
        q: `Tenés **${f(stock, 0)} kg** de café verde en almacén y el tostador consume **${sem ? f(cons * 5, 0) + ' kg por semana (5 días de producción)' : f(cons, 0) + ' kg por día de producción'}**. ¿Para cuántos **días de producción** alcanza el stock?`,
        hints: ['Cobertura = stock ÷ consumo por periodo.', sem ? 'Pasá primero el consumo semanal a diario: ÷ 5.' : 'Stock y consumo deben estar en la misma unidad (kg).', `Operación: ${stock} ÷ ${cons}`],
        sol: [...(sem ? [`Consumo diario: ${f(cons * 5, 0)} ÷ 5 = ${f(cons, 0)} kg/día`] : []), `${f(stock, 0)} ÷ ${f(cons, 0)} = **${f(a, 1)} días de producción**`],
        keys: `${stock} ÷ ${cons} =`,
        excel: '=A2/B2',
        means: 'La cobertura sola no dice nada: hay que compararla con el plazo de reposición. Si el próximo contenedor tarda más días que tu cobertura, vas hacia una rotura de stock. Y distinguí días de producción de días naturales: el barco navega también los fines de semana.',
      })
    },
  },
  {
    id: 'punto-pedido', title: 'Punto de pedido', sector: 'comun', topic: 'logistica',
    gen: (lv) => {
      const d = lv === 1 ? pick([100, 200]) : rnd(8, 60) * 10, lt = lv === 1 ? 10 : rnd(6, 45), ssd = lv === 1 ? 5 : rnd(3, 12)
      const ss = d * ssd, a = d * lt + ss
      return N({
        id: 'punto-pedido', dim: 'supuestos', unit: 'kg', a,
        q: `Consumo medio: **${f(d, 0)} kg/día**. Plazo de aprovisionamiento: **${lt} días**. Stock de seguridad decidido: **${f(ss, 0)} kg**${SIM}. ¿Con qué **nivel de stock** hay que lanzar el pedido?`,
        hints: ['Mientras llega el pedido seguís consumiendo.', 'Punto de pedido = consumo durante el plazo + stock de seguridad.', `Operación: ${d} × ${lt} + ${ss}`],
        sol: [`Consumo durante el plazo: ${f(d, 0)} × ${lt} = ${f(d * lt, 0)} kg`, `+ stock de seguridad ${f(ss, 0)} kg = **${f(a, 0)} kg**`],
        keys: `${d} × ${lt} + ${ss} =`,
        excel: '=A2*B2+C2',
        traps: [{ v: d * lt, kind: 'supuesto', msg: 'Olvidaste el stock de seguridad: con este punto de pedido, cualquier retraso o pico de demanda te deja a cero.' }],
        means: 'La fórmula supone consumo estable y plazo fiable. Si el consumo es estacional o los embarques se retrasan con frecuencia, el supuesto falla: el stock de seguridad existe precisamente para cubrir esa variabilidad, y dimensionarlo es una decisión (coste de inmovilizar frente a coste de romper stock).',
      })
    },
  },
]

export const skillById = (id: string) => SKILLS.find((k) => k.id === id)!
