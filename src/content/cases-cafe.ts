import type { Case } from '../lib/types.ts'
import { f, g } from '../lib/num.ts'
import { C, N, W } from './h.ts'

const K = 22.0462
/* ============ CASO 1: dos ofertas de café verde ============ */
const sacos = 320, kgSaco = 60, kg = sacos * kgSaco
const aClb = 290, aUsdT = aClb * K, flete = 2300, seguro = 250
const aCif = aUsdT + ((flete + seguro) / kg) * 1000
const bCif = 6560, fx = 1.08, local = 0.14
const aAlm = aCif / 1000 / fx + local, bAlm = bCif / 1000 / fx + local
const bPlazo = (bCif / 1000 / fx) * 0.06 * (60 / 360)
const merma = 0.16, kgTost = kg * (1 - merma), verdeTost = aAlm / (1 - merma)
const proc = 1.1, costeTost = verdeTost + proc, pvMargen = costeTost / 0.75, pvRecargo = costeTost * 1.25

const caso1: Case = {
  id: 'cafe-ofertas', title: 'Dos ofertas de café verde: ¿cuál conviene de verdad?', sector: 'cafe', tipo: 'Materia prima → producto transformado', level: 1,
  summary: 'Compará dos ofertas en condiciones equivalentes, calculá el coste puesto en almacén, aplicá la merma de tueste y construí un precio distinguiendo margen de recargo.',
  brief: `Trabajás en un tostador. Compras necesita **un contenedor de arábica brasileño natural** y han llegado dos ofertas con la misma especificación de calidad. El CEO te pide dos cosas: **cuál conviene** y **cuánto costará el kilo de café tostado**.

! Todos los precios, costes, tipos de cambio y mermas de este caso son **simulados** con fines didácticos. No son cotizaciones reales ni actuales.

Los datos irán apareciendo paso a paso, como ocurre en la realidad.`,
  steps: [
    C({
      id: 'c1-01', phase: 1, dim: 'razonamiento',
      data: [{ label: 'Oferta A', value: `${aClb} ¢/lb · FOB Santos` }, { label: 'Oferta B', value: `${f(bCif, 0)} USD/t · CIF Valencia` }, { label: 'Cantidad (ambas)', value: `${sacos} sacos de ${kgSaco} kg` }],
      q: 'Antes de calcular nada: ¿qué hay que hacer para poder decir cuál es más barata?',
      opts: [
        ['Comparar los dos números tal como vienen: 290 es mucho menor que 6.560.', 'no', 'Están en unidades distintas (centavos por libra frente a dólares por tonelada) y en puntos de entrega distintos. Compararlos así no significa nada.'],
        ['Llevar ambas a la misma unidad, la misma moneda y el mismo punto de entrega.', 'ok', 'Exacto: esa es la «base equivalente». Solo entonces los números son comparables.'],
        ['Pedir a los dos proveedores que bajen el precio y elegir al que más baje.', 'no', 'Negociar sin saber cuál es hoy la mejor oferta es negociar a ciegas.'],
      ],
      means: 'Tres cosas hacen que dos ofertas no sean comparables a simple vista: **unidad** (¢/lb, USD/t, €/kg), **moneda** y **punto de entrega** (Incoterm). Después vienen calidad y pago.',
    }),
    C({
      id: 'c1-02', phase: 2, dim: 'supuestos', multi: true,
      q: 'Con lo que sabés hasta ahora, ¿qué información **falta** para comparar A y B puestas en tu almacén?',
      opts: [
        ['El tipo de cambio EUR/USD que usará la empresa.', 'ok', 'Las dos ofertas están en dólares y tus costes y ventas en euros.'],
        ['El flete marítimo y el seguro Santos–Valencia.', 'ok', 'La oferta A es FOB: el transporte principal y el seguro los pagás vos. En B (CIF) ya están en el precio.'],
        ['Los gastos en puerto de destino, despacho y transporte hasta el almacén.', 'ok', 'Son comunes a las dos, pero sin ellos no tenés el coste «puesto en almacén».'],
        ['Las condiciones de pago de cada oferta.', 'ok', 'Pagar al contado o a 60 días no cuesta lo mismo.'],
        ['El precio al que vende la competencia el café tostado.', 'no', 'Importa para fijar tu precio de venta, pero no para comparar estas dos compras.'],
        ['El color de los sacos.', 'no', 'No afecta al coste ni a la calidad contratada.'],
      ],
      means: 'Hacer la lista de lo que falta **antes** de calcular evita dar una respuesta que haya que corregir delante del CEO.',
    }),
    C({
      id: 'c1-03', phase: 3, dim: 'razonamiento',
      q: '¿A quién le pedís el flete marítimo, el seguro y los gastos en destino para la oferta A?',
      opts: [
        ['Al transitario o al departamento de logística.', 'ok', 'Es quien cotiza fletes y gastos portuarios para esa ruta y esa fecha concretas.'],
        ['Al proveedor A, pidiéndole que cotice también en CIF.', 'alt', 'Es válido y útil para contrastar, pero entonces el flete lo controla el vendedor; conviene tener además tu propia cotización.'],
        ['A nadie: uso el flete del último embarque.', 'no', 'Los fletes cambian con frecuencia. Un dato viejo presentado como actual es un supuesto sin declarar.'],
      ],
      means: 'El tipo de cambio y el coste financiero se piden a finanzas; fletes y gastos, a logística o al transitario; la merma, a producción. Saber a quién preguntar es parte del trabajo.',
    }),
    N({
      id: 'c1-04', phase: 4, dim: 'unidades', unit: 'kg', a: kg,
      q: `Empecemos por la cantidad. ¿Cuántos **kg** son ${sacos} sacos de ${kgSaco} kg?`,
      hints: ['Sacos × kg por saco.', `Operación: ${sacos} × ${kgSaco}`], sol: [`${sacos} × ${kgSaco} = **${f(kg, 0)} kg** (19,2 t)`], keys: `${sacos} × ${kgSaco} =`,
      mental: '32 × 6 = 192; añadí los dos ceros: 19.200.',
      means: 'Es la carga típica de un contenedor de 20 pies en sacos. El peso del saco varía según el origen: confirmalo en cada oferta.',
    }),
    N({
      id: 'c1-05', phase: 4, dim: 'unidades', unit: 'USD/t', a: aUsdT,
      data: [{ label: 'Equivalencia', value: '1 ¢/lb = 22,046 USD/t (porque 1 lb = 0,4536 kg)' }],
      q: `Pasá la oferta A (**${aClb} ¢/lb**) a **USD por tonelada**.`,
      hints: ['Usá la equivalencia que acaba de aparecer.', `Operación: ${aClb} × 22,046`],
      sol: [`${aClb} ¢/lb × 22,046 = **${f(aUsdT, 0)} USD/t**`, `Camino largo: ${aClb} ¢ = ${f(aClb / 100)} USD/lb → ÷ 0,4536 = ${f(aClb / 100 / 0.45359, 4)} USD/kg → × 1.000`],
      keys: `${aClb} × 22,046 =`, mental: `${aClb} × 22 = ${f(aClb * 22, 0)}: para una estimación rápida alcanza.`,
      traps: [{ v: aClb * 10, kind: 'unidades', msg: 'Convertiste centavos a dólares pero no libras a toneladas.' }],
      means: 'Ahora A y B están en la misma unidad y moneda. Todavía **no** son comparables: A es FOB y B es CIF.',
    }),
    N({
      id: 'c1-06', phase: 4, dim: 'unidades', unit: 'USD/t', a: aCif,
      intro: 'Logística te responde con una cotización del transitario.',
      data: [{ label: 'Flete marítimo Santos–Valencia', value: `${f(flete, 0)} USD por contenedor` }, { label: 'Seguro de transporte', value: `${seguro} USD por embarque` }],
      q: 'Calculá el precio de la oferta A **en base CIF Valencia**, en USD/t.',
      hints: ['Flete y seguro son importes totales del contenedor; el precio es por tonelada.', `Repartí ${f(flete + seguro, 0)} USD entre 19,2 t y sumalo al FOB.`, `Operación: ${f(aUsdT, 1)} + (${flete} + ${seguro}) ÷ 19,2`],
      sol: [`Flete + seguro: ${f(flete + seguro, 0)} USD`, `Por tonelada: ${f(flete + seguro, 0)} ÷ 19,2 = ${f((flete + seguro) / 19.2, 1)} USD/t`, `CIF equivalente: ${f(aUsdT, 1)} + ${f((flete + seguro) / 19.2, 1)} = **${f(aCif, 0)} USD/t**`],
      keys: `${f(aUsdT, 1)} + (${flete} + ${seguro}) ÷ 19,2 =`,
      traps: [{ v: aUsdT + flete + seguro, kind: 'unidades', msg: 'Sumaste USD por contenedor a USD por tonelada. Primero hay que repartir flete y seguro entre las 19,2 toneladas.' }],
      means: 'Ahora sí: misma unidad, misma moneda, mismo punto de entrega. Fijate que el coste del flete por tonelada depende de cuánto cargue el contenedor.',
    }),
    N({
      id: 'c1-07', phase: 5, dim: 'calculo', unit: 'USD/t', a: bCif - aCif, tol: 0.06,
      q: `¿Cuántos **USD/t más cara** es la oferta B (${f(bCif, 0)} USD/t CIF) que la A en base CIF?`,
      hints: ['Resta simple, ahora que están en la misma base.', `Operación: ${bCif} − ${f(aCif, 0)}`], sol: [`${f(bCif, 0)} − ${f(aCif, 0)} = **${f(bCif - aCif, 0)} USD/t**`, `Sobre 19,2 t: ≈ ${f((bCif - aCif) * 19.2, 0)} USD en el contenedor`], keys: `${bCif} − ${f(aCif, 0)} =`,
      means: 'La diferencia es pequeña (alrededor del 0,5 %). Con diferencias así, las condiciones de pago y el riesgo pueden pesar más que el precio.',
    }),
    N({
      id: 'c1-08', phase: 4, dim: 'unidades', unit: '€/kg', a: aAlm, tol: 0.001,
      intro: 'Finanzas y logística completan los datos.',
      data: [{ label: 'Tipo de cambio de presupuesto', value: `1 € = ${f(fx)} USD` }, { label: 'Gastos en destino hasta almacén (puerto, despacho, camión, descarga)', value: `${f(local)} €/kg` }, { label: 'Arancel', value: '0 % en este caso simulado (verificar en TARIC para el producto y origen reales)' }],
      q: 'Calculá el **coste de la oferta A puesto en almacén**, en €/kg.',
      hints: ['Primero USD/t → USD/kg, después a euros, y al final sumá los gastos locales (que ya están en €).', `Para pasar de USD a EUR con «1 € = ${f(fx)} USD», se divide.`, `Operación: ${f(aCif, 1)} ÷ 1000 ÷ ${f(fx)} + ${f(local)}`],
      sol: [`${f(aCif, 1)} USD/t ÷ 1.000 = ${f(aCif / 1000, 4)} USD/kg`, `÷ ${f(fx)} = ${f(aCif / 1000 / fx, 4)} €/kg`, `+ ${f(local)} €/kg de gastos en destino = **${f(aAlm, 3)} €/kg**`],
      keys: `${f(aCif, 1)} ÷ 1000 ÷ ${f(fx)} + ${f(local)} =`, excel: '=B2/1000/B3+B4',
      traps: [{ v: (aCif / 1000) * fx + local, kind: 'unidades', msg: 'Multiplicaste por el tipo de cambio. Con 1 € = 1,08 USD, los dólares valen menos que los euros: hay que dividir.' }, { v: (aCif / 1000 + local) / fx, kind: 'unidades', msg: 'Sumaste los gastos locales (en €) antes de convertir: los convertiste como si fueran dólares.' }, { v: aCif / 1000 / fx, kind: 'supuesto', msg: 'Te falta sumar los gastos en destino: ese es el coste CIF en euros, no el coste puesto en almacén.' }],
      means: 'Este es el **coste total entregado** del café verde: la cifra sobre la que se construye todo lo demás.',
    }),
    N({
      id: 'c1-09', phase: 4, dim: 'calculo', unit: '€/kg', a: bAlm,
      q: `Ahora el **coste de la oferta B puesto en almacén** (${f(bCif, 0)} USD/t CIF), en €/kg.`,
      hints: ['Mismo camino que en A; B ya incluye flete y seguro.', `Operación: ${bCif} ÷ 1000 ÷ ${f(fx)} + ${f(local)}`],
      sol: [`${f(bCif / 1000, 2)} USD/kg ÷ ${f(fx)} = ${f(bCif / 1000 / fx, 4)} €/kg`, `+ ${f(local)} = **${f(bAlm, 3)} €/kg**`, `B cuesta ${f(bAlm - aAlm, 3)} €/kg más que A → ≈ ${f((bAlm - aAlm) * kg, 0)} € en el contenedor`],
      keys: `${bCif} ÷ 1000 ÷ ${f(fx)} + ${f(local)} =`,
      means: 'A precio «de papel», A gana por unos 600 €. Falta mirar una diferencia que todavía no comparamos.',
    }),
    N({
      id: 'c1-10', phase: 5, dim: 'supuestos', unit: '€/kg', a: bPlazo, tol: 0.03,
      intro: 'Leyendo la letra pequeña aparecen las condiciones de pago.',
      data: [{ label: 'Pago oferta A', value: 'Al contado contra documentos' }, { label: 'Pago oferta B', value: '60 días desde la fecha del conocimiento de embarque' }, { label: 'Coste de financiación de la empresa', value: '6 % anual' }],
      q: `¿Cuánto **vale el plazo de 60 días** de la oferta B, en €/kg? Tomá como base su precio CIF en euros (${f(bCif / 1000 / fx, 3)} €/kg) y año de 360 días.`,
      hints: ['Es el interés que te ahorrás por no desembolsar el dinero durante 60 días.', 'Base × tipo anual × (días ÷ 360).', `Operación: ${f(bCif / 1000 / fx, 3)} × 6 % × 60 ÷ 360`],
      sol: [`Interés anual: ${f(bCif / 1000 / fx, 3)} × 0,06 = ${f((bCif / 1000 / fx) * 0.06, 4)} €/kg`, `Por 60 días: × 60 ÷ 360 = **${f(bPlazo, 3)} €/kg**`, `Coste de B ajustado por financiación: ${f(bAlm, 3)} − ${f(bPlazo, 3)} = ${f(bAlm - bPlazo, 3)} €/kg, frente a ${f(aAlm, 3)} de A`],
      keys: `${f(bCif / 1000 / fx, 3)} × 6% × 60 ÷ 360 =`, mental: '6 % anual = 0,5 % al mes → 60 días = 1 %. El 1 % de 6,07 es 0,06.',
      traps: [{ v: (bCif / 1000 / fx) * 0.06, kind: 'supuesto', msg: 'Ese es el interés de un año entero. El plazo son solo 60 días.' }],
      means: 'Con el plazo valorado, **B pasa a ser ligeramente más barata** que A. El orden se invirtió al igualar una condición más: eso es comparar «en condiciones equivalentes».',
    }),
    C({
      id: 'c1-11', phase: 6, dim: 'interpretacion',
      q: '¿Qué recomendás?',
      opts: [
        ['Oferta A: es la más barata puesta en almacén y controlamos nosotros el flete.', 'alt', 'Defendible si la empresa tiene caja de sobra (su coste de dinero real es menor al 6 %) y logística propia. Consecuencia: pagás antes y asumís vos el riesgo de que el flete suba hasta el embarque.'],
        ['Oferta B: valorando el plazo de pago resulta algo más barata y alivia la caja.', 'alt', 'Defendible si la caja es ajustada. Consecuencias: el flete lo contrata el vendedor (menos control sobre naviera y fechas) y dependés de que te mantengan el crédito.'],
        ['Ninguna todavía: la diferencia es mínima; pido a A precio con pago a 60 días (o a B precio al contado) y decido con ofertas totalmente equivalentes.', 'ok', 'Con una diferencia de céntimos, una ronda más de negociación con datos concretos suele valer más que la diferencia misma. Riesgo: la validez de las ofertas es corta; hay que moverse rápido.'],
        ['Oferta A, porque 290 es menor que 6.560.', 'no', 'Son unidades distintas. Es exactamente el error que este caso enseña a evitar.'],
      ],
      means: 'Aquí hay varias decisiones razonables. Lo profesional no es «acertar», sino poder explicar **en qué supuestos** se apoya tu recomendación (coste del dinero, riesgo de flete, validez de las ofertas). Para continuar todos con los mismos números, seguimos con la **oferta A**.',
    }),
    N({
      id: 'c1-12', phase: 4, dim: 'supuestos', unit: 'kg tostados', a: kgTost,
      intro: 'Producción te informa de la merma habitual para este perfil de tueste.',
      data: [{ label: 'Merma de tueste', value: `${merma * 100} % del peso (SIMULADA; la real depende del grado de tueste y la humedad del verde)` }],
      q: `De los ${f(kg, 0)} kg de café verde, ¿cuántos **kg de café tostado** salen?`,
      hints: [`Si se pierde el ${merma * 100} %, queda el ${100 - merma * 100} %.`, `Operación: ${kg} × ${g(1 - merma)}`], sol: [`Rendimiento: 1 − ${g(merma)} = ${g(1 - merma)}`, `${f(kg, 0)} × ${g(1 - merma)} = **${f(kgTost, 0)} kg**`], keys: `${kg} × ${g(1 - merma)} =`,
      means: `Se «evaporan» ${f(kg - kgTost, 0)} kg (agua, sobre todo). Los pagaste, los transportaste, y no los vas a vender.`,
    }),
    N({
      id: 'c1-13', phase: 4, dim: 'supuestos', unit: '€/kg tostado', a: verdeTost,
      q: `El verde (oferta A) cuesta **${f(aAlm, 3)} €/kg** puesto en almacén. ¿Cuánto cuesta la materia prima **por kg de café tostado**?`,
      hints: ['El mismo dinero se reparte entre menos kilos.', `Dividí el coste entre el rendimiento (${g(1 - merma)}).`, `Operación: ${f(aAlm, 3)} ÷ ${g(1 - merma)}`],
      sol: [`${f(aAlm, 3)} ÷ ${g(1 - merma)} = **${f(verdeTost, 3)} €/kg tostado**`, `Comprobación por totales: ${f(kg, 0)} kg × ${f(aAlm, 3)} = ${f(kg * aAlm, 0)} € ÷ ${f(kgTost, 0)} kg = ${f(verdeTost, 3)}`],
      keys: `${f(aAlm, 3)} ÷ ${g(1 - merma)} =`, excel: '=B5/(1-B6)',
      traps: [{ v: aAlm * (1 + merma), kind: 'supuesto', msg: `Multiplicaste por 1,16. La merma no «añade un 16 % de coste»: quita un 16 % de kilos. Hay que dividir entre 0,84, y da ${f(verdeTost - aAlm * (1 + merma), 2)} €/kg más.` }],
      means: `La merma encarece la materia prima un ${f((1 / (1 - merma) - 1) * 100, 1)} %, no un 16 %. En un contenedor, confundir «× 1,16» con «÷ 0,84» son unos ${f((verdeTost - aAlm * (1 + merma)) * kgTost, 0)} € de coste que no verías.`,
    }),
    N({
      id: 'c1-14', phase: 4, dim: 'interpretacion', unit: '€/kg', a: pvMargen,
      data: [{ label: 'Tueste y envasado', value: `${f(proc)} €/kg de café tostado` }, { label: 'Objetivo de dirección', value: 'margen del 25 % sobre ventas' }],
      q: '¿A qué **precio por kg** hay que vender el café tostado para obtener un **margen del 25 % sobre ventas**?',
      hints: [`Coste total por kg tostado = materia prima (${f(verdeTost, 3)}) + proceso (${f(proc)}).`, 'Si el margen es el 25 % del precio, el coste es el 75 %. Precio = coste ÷ 0,75.', `Operación: (${f(verdeTost, 3)} + ${f(proc)}) ÷ 0,75`],
      sol: [`Coste total: ${f(verdeTost, 3)} + ${f(proc)} = ${f(costeTost, 3)} €/kg`, `Precio: ${f(costeTost, 3)} ÷ 0,75 = **${f(pvMargen, 2)} €/kg**`, `Comprobación: (${f(pvMargen, 2)} − ${f(costeTost, 2)}) ÷ ${f(pvMargen, 2)} = 25 %`],
      keys: `(${f(verdeTost, 3)} + ${f(proc)}) ÷ 0,75 =`, excel: '=(B7+B8)/(1-B9)',
      traps: [{ v: pvRecargo, kind: 'interpretacion', msg: 'Sumaste un 25 % al coste: eso es un recargo. El margen sobre ventas resultante sería solo del 20 %. Para un margen, dividí entre (1 − 0,25).' }, { v: verdeTost / 0.75, kind: 'supuesto', msg: 'Olvidaste el coste de tueste y envasado.' }],
      means: 'Este es tu precio objetivo. Por debajo de él, cada céntimo que cedas sale del margen.',
    }),
    N({
      id: 'c1-15', phase: 5, dim: 'interpretacion', unit: '%', a: 20, tol: 0.01,
      q: `Un compañero propone «coste + 25 %»: ${f(costeTost, 2)} × 1,25 = ${f(pvRecargo, 2)} €/kg. ¿Qué **margen sobre ventas** daría ese precio?`,
      hints: ['Margen = beneficio ÷ precio de venta.', `Operación: (${f(pvRecargo, 2)} − ${f(costeTost, 2)}) ÷ ${f(pvRecargo, 2)} × 100`],
      sol: [`Beneficio: ${f(pvRecargo, 2)} − ${f(costeTost, 2)} = ${f(pvRecargo - costeTost, 2)} €/kg`, `÷ ${f(pvRecargo, 2)} = **20 %**`], keys: `(${f(pvRecargo, 2)} − ${f(costeTost, 2)}) ÷ ${f(pvRecargo, 2)} × 100 =`,
      mental: 'Recargo 25 % = margen 20 %. Siempre: margen = recargo ÷ (1 + recargo) = 0,25 ÷ 1,25.',
      traps: [{ v: 25, kind: 'interpretacion', msg: 'El 25 % es sobre el coste (recargo). Sobre el precio de venta, la misma ganancia es un porcentaje menor.' }],
      means: `Mismo «25 %», dos precios: ${f(pvMargen, 2)} frente a ${f(pvRecargo, 2)} €/kg. En los ${f(kgTost, 0)} kg del contenedor, la diferencia es de unos ${f((pvMargen - pvRecargo) * kgTost, 0)} €. Cuando alguien diga «un 25 %», preguntá sobre qué.`,
    }),
    W({
      id: 'c1-16', phase: 7,
      q: 'Escribí un **resumen de 5–6 líneas para el CEO** con tu recomendación de compra y el precio de venta objetivo.',
      checklist: ['La recomendación aparece en la primera línea.', 'Las dos ofertas se comparan en la misma base (€/kg puesto en almacén).', 'Menciona la diferencia de condiciones de pago y cuánto vale.', 'Da el coste por kg tostado y el precio para un margen del 25 % sobre ventas.', 'Declara los supuestos: tipo de cambio, merma, flete, coste financiero.', 'Dice qué falta confirmar y antes de cuándo (validez de las ofertas).'],
      model: `**Recomendación:** pedir hoy a A precio con pago a 60 días; si no mejora, cerrar con B.

**Comparación (puesto en almacén):** A ${f(aAlm, 2)} €/kg, pago contado · B ${f(bAlm, 2)} €/kg, pago 60 días. El plazo de B vale ≈ ${f(bPlazo, 2)} €/kg (6 % anual), con lo que B queda en ${f(bAlm - bPlazo, 2)} €/kg equivalente. Diferencia total: menos de 600 € en el contenedor.

**Coste y precio (con A):** ${f(verdeTost, 2)} €/kg tostado de materia prima + ${f(proc)} de proceso = ${f(costeTost, 2)} €/kg. Precio para margen 25 % sobre ventas: **${f(pvMargen, 2)} €/kg**.

**Supuestos:** EUR/USD ${f(fx)}; merma ${merma * 100} % (dato de producción); flete cotizado por el transitario; arancel 0 % pendiente de verificar.

**Pendiente:** validez de ambas ofertas y confirmación del flete antes de cerrar.`,
      means: 'Un resumen para dirección responde primero «qué hacemos», después «por qué» y al final «de qué depende». Los números de detalle van en un anexo o en la hoja de cálculo.',
    }),
  ],
}

/* ============ CASO 3: integrador ============ */
const paq = 40000, gPaq = 0.25, tost = paq * gPaq, m2 = 0.16, verde = tost / (1 - m2)
const arClb = 300, roUsd = 4600, logi = 0.27, fx2 = 1.08
const arAlm = (x: number, e: number) => (x * K) / 1000 / e + logi
const roAlm = (e: number) => roUsd / 1000 / e + logi
const mix = (a: number, r: number) => 0.7 * a + 0.3 * r
const proc2 = 0.65, env = 0.11, dist = 0.06
const paqCost = (mz: number) => (mz / (1 - m2) + proc2) * gPaq + env + dist
const ar0 = arAlm(arClb, fx2), ro0 = roAlm(fx2), mz0 = mix(ar0, ro0), pc0 = paqCost(mz0), pv0 = pc0 / 0.82
const verdeTotal = verde * mz0, fin = verdeTotal * 0.06 * (110 / 360)
const mzFx = mix(arAlm(arClb, 1.02), roAlm(1.02)), pcFx = paqCost(mzFx)
const mzMp = mix(arAlm(arClb * 1.15, fx2), ro0), pcMp = paqCost(mzMp)

const caso3: Case = {
  id: 'cafe-integrador', title: 'Caso integrador: del café verde al paquete en el lineal', sector: 'cafe', tipo: 'Materia prima → producto terminado', level: 3,
  summary: 'Comprar, importar, tostar, envasar y vender una mezcla arábica-robusta. Cantidades, rendimientos, costes, precio, margen y caja. Después, tres sobresaltos: divisa, materia prima y transporte.',
  brief: `Una cadena de supermercados quiere **40.000 paquetes de 250 g** de café molido para su marca propia: mezcla **70 % arábica / 30 % robusta**. Tu empresa compra el verde, lo importa, lo tuesta, lo muele, lo envasa y lo entrega.

Tenés que construir el precio de la oferta, estimar la caja que inmoviliza la operación y, después, reaccionar ante tres cambios de escenario.

! Todos los datos son **simulados**. Arábica y robusta aparecen cada uno en su unidad habitual de referencia (¢/lb y USD/t): no las mezcles.`,
  steps: [
    C({
      id: 'c3-01', phase: 1, dim: 'razonamiento',
      q: '¿Por dónde conviene empezar a calcular?',
      opts: [
        ['Por la venta: cuántos kg de tostado pide el cliente, y de ahí hacia atrás hasta el verde.', 'ok', 'Planificar «hacia atrás» desde el pedido garantiza que comprás lo necesario, ni más ni menos.'],
        ['Por la compra: un contenedor de verde, y vemos cuánto sale.', 'alt', 'Funciona si el objetivo es llenar un contenedor, pero aquí el compromiso es un pedido concreto: podés quedarte corto o con sobrante.'],
        ['Por el precio de la competencia en el lineal.', 'no', 'Es una referencia útil para negociar, pero no te dice si la operación es rentable.'],
      ],
    }),
    C({
      id: 'c3-02', phase: 2, dim: 'supuestos', multi: true,
      q: '¿Qué datos necesitás conseguir antes de comprometer un precio?',
      opts: [
        ['La merma real de tueste para ese perfil.', 'ok', 'Cambia los kilos de verde y el coste.'], ['El tipo de cambio y si se va a cubrir.', 'ok', 'Comprás en USD y vendés en EUR.'],
        ['Plazo de pago del cliente y calendario de entregas.', 'ok', 'Determinan cuánta caja inmoviliza la operación.'], ['Si el contrato permite revisar el precio y cómo.', 'ok', 'Un precio fijo a meses vista con materia prima volátil es un riesgo que hay que valorar o cubrir.'],
        ['La especificación exacta: mezcla, molienda, formato, vida útil.', 'ok', 'Sin especificación cerrada no hay coste fiable.'], ['El nombre del buque.', 'no', 'Todavía no es relevante para el precio.'],
      ],
    }),
    C({
      id: 'c3-03', phase: 3, dim: 'razonamiento',
      q: '¿Quién te da la merma de tueste?',
      opts: [['Producción / el maestro tostador, con datos de tuestes anteriores.', 'ok', 'Es un dato medido en la planta para cada perfil.'], ['El proveedor del café verde.', 'no', 'Conoce la humedad del verde, no tu perfil de tueste.'], ['La estimo yo: «siempre es un 20 %».', 'no', 'Varía con el grado de tueste y la humedad: unos pocos puntos cambian el coste de forma apreciable.']],
    }),
    N({ id: 'c3-04', phase: 4, dim: 'unidades', unit: 'kg', a: tost, q: '¿Cuántos **kg de café tostado** son 40.000 paquetes de 250 g?', hints: ['250 g = 0,25 kg.', 'Operación: 40000 × 0,25'], sol: ['40.000 × 0,25 kg = **10.000 kg**'], keys: '40000 × 0,25 =', mental: 'Cuatro paquetes de 250 g hacen un kilo: 40.000 ÷ 4.', means: 'Diez toneladas de producto terminado.' }),
    N({
      id: 'c3-05', phase: 4, dim: 'supuestos', unit: 'kg', a: verde, data: [{ label: 'Merma de tueste', value: '16 % (simulada, dato de producción)' }],
      q: '¿Cuántos **kg de café verde** hacen falta para obtener esos 10.000 kg tostados?', hints: ['Verde × 0,84 = tostado.', 'Operación: 10000 ÷ 0,84'], sol: ['10.000 ÷ 0,84 = **11.904,8 kg de verde**'], keys: '10000 ÷ 0,84 =',
      traps: [{ v: tost * 1.16, kind: 'supuesto', msg: 'Sumaste un 16 % al tostado (11.600 kg). Te faltarían unos 300 kg de verde: la merma se calcula sobre el verde, así que hay que dividir entre 0,84.' }],
      means: 'Con 11.600 kg no llegarías a los 10.000 kg de tostado. En la práctica se añade además un pequeño colchón por mermas de envasado.',
    }),
    N({
      id: 'c3-06', phase: 4, dim: 'unidades', unit: 'sacos', a: Math.ceil((verde * 0.7) / 60), tol: 0,
      q: 'El 70 % del verde es arábica y viene en sacos de 60 kg. ¿Cuántos **sacos enteros de arábica** hay que comprar?', hints: ['70 % de 11.904,8 kg, dividido entre 60.', 'Operación: 11904,8 × 0,7 ÷ 60 → hacia arriba'], sol: [`Arábica: 11.904,8 × 0,7 = ${f(verde * 0.7, 1)} kg`, `÷ 60 = ${f((verde * 0.7) / 60, 2)} → **139 sacos**`], keys: '11904,8 × 0,7 ÷ 60 =',
      traps: [{ v: 138, kind: 'supuesto', msg: 'Redondeaste hacia abajo: faltarían kilos.' }], means: `De robusta harán falta ${Math.ceil((verde * 0.3) / 60)} sacos. Los sobrantes por redondeo quedan como stock: tenelo en cuenta en la caja.`,
    }),
    N({
      id: 'c3-07', phase: 4, dim: 'unidades', unit: '€/kg', a: ar0, tol: 0.001,
      data: [{ label: 'Arábica FOB', value: `${arClb} ¢/lb` }, { label: 'Robusta FOB', value: `${f(roUsd, 0)} USD/t` }, { label: 'Tipo de cambio', value: `1 € = ${f(fx2)} USD` }, { label: 'Flete, seguro, puerto y transporte hasta almacén', value: `${f(logi)} €/kg (ya en euros)` }],
      q: 'Coste del **arábica puesto en almacén**, en €/kg. (1 ¢/lb = 22,046 USD/t)',
      hints: ['¢/lb → USD/t → USD/kg → €/kg, y al final sumá la logística.', `Operación: ${arClb} × 22,046 ÷ 1000 ÷ ${f(fx2)} + ${f(logi)}`], sol: [`${arClb} × 22,046 = ${f(arClb * K, 0)} USD/t = ${f((arClb * K) / 1000, 3)} USD/kg`, `÷ ${f(fx2)} = ${f((arClb * K) / 1000 / fx2, 3)} €/kg`, `+ ${f(logi)} = **${f(ar0, 3)} €/kg**`], keys: `${arClb} × 22,046 ÷ 1000 ÷ ${f(fx2)} + ${f(logi)} =`,
      traps: [{ v: ((arClb * K) / 1000 + logi) / fx2, kind: 'unidades', msg: 'Convertiste también la logística, que ya estaba en euros.' }],
    }),
    N({ id: 'c3-08', phase: 4, dim: 'unidades', unit: '€/kg', a: ro0, q: 'Coste del **robusta puesto en almacén**, en €/kg.', hints: ['El robusta ya está en USD/t: no hay libras.', `Operación: ${roUsd} ÷ 1000 ÷ ${f(fx2)} + ${f(logi)}`], sol: [`${f(roUsd / 1000, 2)} USD/kg ÷ ${f(fx2)} = ${f(roUsd / 1000 / fx2, 3)} €/kg`, `+ ${f(logi)} = **${f(ro0, 3)} €/kg**`], keys: `${roUsd} ÷ 1000 ÷ ${f(fx2)} + ${f(logi)} =`, traps: [{ v: (roUsd * K) / 1000 / fx2 + logi, kind: 'supuesto', msg: 'Aplicaste al robusta la conversión del arábica. Su referencia ya está en USD por tonelada.' }] }),
    N({ id: 'c3-09', phase: 4, dim: 'calculo', unit: '€/kg', a: mz0, q: `Coste por kg de la **mezcla verde** 70/30 (arábica ${f(ar0, 3)} · robusta ${f(ro0, 3)}).`, hints: ['Media ponderada, no promedio simple.', `Operación: 0,7 × ${f(ar0, 3)} + 0,3 × ${f(ro0, 3)}`], sol: [`0,7 × ${f(ar0, 3)} = ${f(0.7 * ar0, 3)}`, `0,3 × ${f(ro0, 3)} = ${f(0.3 * ro0, 3)}`, `Suma: **${f(mz0, 3)} €/kg**`], keys: `0,7 × ${f(ar0, 3)} + 0,3 × ${f(ro0, 3)} =`, excel: '=MATR.SOMMA.PRODOTTO(B2:B3;C2:C3)', traps: [{ v: (ar0 + ro0) / 2, kind: 'supuesto', msg: 'Promedio simple: supone 50/50. La mezcla es 70/30.' }], means: 'El resultado queda entre ambos precios y más cerca del arábica: coherente.' }),
    N({ id: 'c3-10', phase: 4, dim: 'supuestos', unit: '€/kg tostado', a: mz0 / (1 - m2), q: 'Coste de materia prima **por kg tostado** (merma 16 %).', hints: ['Dividí entre el rendimiento.', `Operación: ${f(mz0, 3)} ÷ 0,84`], sol: [`${f(mz0, 3)} ÷ 0,84 = **${f(mz0 / 0.84, 3)} €/kg tostado**`], keys: `${f(mz0, 3)} ÷ 0,84 =`, traps: [{ v: mz0 * 1.16, kind: 'supuesto', msg: 'Hay que dividir entre 0,84, no multiplicar por 1,16.' }] }),
    N({
      id: 'c3-11', phase: 4, dim: 'unidades', unit: '€/paquete', a: pc0,
      data: [{ label: 'Tueste y molienda', value: `${f(proc2)} €/kg tostado` }, { label: 'Envase y embalaje', value: `${f(env)} €/paquete` }, { label: 'Distribución hasta plataforma del cliente', value: `${f(dist)} €/paquete` }],
      q: '**Coste total por paquete** de 250 g.', hints: ['Hay costes por kg y costes por paquete: pasá primero los de kg a paquete.', 'Un paquete es 0,25 kg.', `Operación: (${f(mz0 / 0.84, 3)} + ${f(proc2)}) × 0,25 + ${f(env)} + ${f(dist)}`],
      sol: [`Café tostado y molido: ${f(mz0 / 0.84, 3)} + ${f(proc2)} = ${f(mz0 / 0.84 + proc2, 3)} €/kg`, `Por paquete: × 0,25 = ${f((mz0 / 0.84 + proc2) * 0.25, 3)} €`, `+ envase ${f(env)} + distribución ${f(dist)} = **${f(pc0, 3)} €/paquete**`], keys: `(${f(mz0 / 0.84, 3)} + ${f(proc2)}) × 0,25 + ${f(env)} + ${f(dist)} =`,
      traps: [{ v: mz0 / 0.84 + proc2 + env + dist, kind: 'unidades', msg: 'Sumaste €/kg con €/paquete. Convertí primero el coste por kg a coste por paquete (× 0,25).' }],
      means: `El café verde representa alrededor del ${f(((mz0 / 0.84) * 0.25 * 100) / pc0, 0)} % del coste del paquete: es un producto terminado, pero sigue comportándose casi como una materia prima.`,
    }),
    N({ id: 'c3-12', phase: 4, dim: 'interpretacion', unit: '€/paquete', a: pv0, q: `En marca propia el margen objetivo es del **18 % sobre ventas**. ¿Qué **precio por paquete** ofertás?`, hints: ['Precio = coste ÷ (1 − margen).', `Operación: ${f(pc0, 3)} ÷ 0,82`], sol: [`${f(pc0, 3)} ÷ 0,82 = **${f(pv0, 3)} €/paquete**`, `Venta total: 40.000 × ${f(pv0, 3)} = ${f(paq * pv0, 0)} €`], keys: `${f(pc0, 3)} ÷ 0,82 =`, traps: [{ v: pc0 * 1.18, kind: 'interpretacion', msg: 'Eso es un recargo del 18 % (margen real 15,3 %).' }] }),
    N({
      id: 'c3-13', phase: 4, dim: 'supuestos', unit: '€', a: fin, tol: 0.02,
      intro: 'Ahora la **caja**. No es lo mismo ganar dinero que tenerlo: el beneficio se calcula con ingresos y costes; la caja, con las fechas de pagos y cobros.',
      data: [{ label: 'Pago del verde', value: 'día 0, contra documentos' }, { label: 'Tránsito + producción + entrega', value: '50 días' }, { label: 'Cobro del cliente', value: '60 días tras la entrega → día 110' }, { label: 'Valor del café verde', value: `${f(verde, 0)} kg × ${f(mz0, 3)} = ${f(verdeTotal, 0)} € (calculado)` }, { label: 'Coste de financiación', value: '6 % anual' }],
      q: `¿Cuánto cuesta **financiar el café verde** (${f(verdeTotal, 0)} €) durante los 110 días que pasan entre pagarlo y cobrar?`,
      hints: ['Importe × tipo anual × días ÷ 360.', `Operación: ${f(verdeTotal, 0)} × 6 % × 110 ÷ 360`], sol: [`${f(verdeTotal, 0)} × 0,06 = ${f(verdeTotal * 0.06, 0)} € al año`, `× 110 ÷ 360 = **${f(fin, 0)} €**`, `Por paquete: ${f(fin / paq, 3)} € (${f((fin / paq / pv0) * 100, 1)} % del precio)`], keys: `${f(verdeTotal, 0)} × 6% × 110 ÷ 360 =`,
      means: `La operación exige adelantar unos ${f(verdeTotal, 0)} € durante casi cuatro meses, y eso se come algo más de un punto de margen. Si el cliente pide 90 días en vez de 60, ya sabés calcular qué te está pidiendo.`,
    }),
    N({
      id: 'c3-14', phase: 5, dim: 'calculo', unit: '€/paquete', a: pcFx,
      intro: '## Sobresalto 1: la divisa\nEl precio al cliente ya está firmado. Antes de que pagues el verde, el euro se debilita.',
      data: [{ label: 'Nuevo tipo de cambio', value: '1 € = 1,02 USD' }, { label: 'Mezcla verde recalculada', value: `${f(mzFx, 3)} €/kg (calculado; antes ${f(mz0, 3)})` }],
      q: 'Con la mezcla verde a ese nuevo coste, ¿cuál es el **nuevo coste por paquete**?', hints: ['Mismo camino: ÷ 0,84, + tueste, × 0,25, + envase y distribución.', `Operación: (${f(mzFx, 3)} ÷ 0,84 + ${f(proc2)}) × 0,25 + ${f(env + dist)}`], sol: [`Tostado: ${f(mzFx, 3)} ÷ 0,84 = ${f(mzFx / 0.84, 3)} €/kg`, `Paquete: (${f(mzFx / 0.84, 3)} + ${f(proc2)}) × 0,25 + ${f(env + dist)} = **${f(pcFx, 3)} €**`], keys: `(${f(mzFx, 3)} ÷ 0,84 + ${f(proc2)}) × 0,25 + ${f(env + dist)} =`,
      means: `El coste sube ${f(pcFx - pc0, 3)} € por paquete sin que el café haya cambiado de precio en dólares.`,
    }),
    N({ id: 'c3-15', phase: 5, dim: 'interpretacion', unit: '%', a: ((pv0 - pcFx) / pv0) * 100, tol: 0.02, q: `El precio firmado sigue siendo ${f(pv0, 3)} €. ¿Qué **margen sobre ventas** queda con el nuevo coste?`, hints: ['Margen = (precio − coste) ÷ precio.', `Operación: (${f(pv0, 3)} − ${f(pcFx, 3)}) ÷ ${f(pv0, 3)} × 100`], sol: [`(${f(pv0, 3)} − ${f(pcFx, 3)}) ÷ ${f(pv0, 3)} = **${f(((pv0 - pcFx) / pv0) * 100, 1)} %** (antes 18 %)`], keys: `(${f(pv0, 3)} − ${f(pcFx, 3)}) ÷ ${f(pv0, 3)} × 100 =`, means: `Un movimiento del 5,6 % en la divisa se llevó casi cuatro puntos de margen: ${f((pcFx - pc0) * paq, 0)} € en el pedido.` }),
    C({
      id: 'c3-16', phase: 6, dim: 'interpretacion',
      q: 'Mirando hacia la próxima operación: ¿cómo gestionarías este riesgo?',
      opts: [
        ['Al firmar un precio de venta fijo en euros, pedir a finanzas que asegure el tipo de cambio para los dólares que habrá que pagar.', 'ok', 'Eso es **cubrir**: existe una exposición real (pagos en USD) y se fija su coste. Ventaja: el margen queda protegido. Consecuencia: si el euro sube, no te beneficiás. El instrumento y su coste los decide finanzas.'],
        ['Negociar con el cliente una cláusula de revisión de precio ligada al tipo de cambio.', 'alt', 'Traslada el riesgo al cliente. Las grandes cadenas no siempre lo aceptan, pero es legítimo plantearlo, sobre todo en contratos largos.'],
        ['Esperar para pagar: seguro que el euro se recupera.', 'no', 'Eso es **especular**: apostar sobre la dirección del mercado con el margen de la empresa.'],
        ['Subir todos los precios un 10 % «por si acaso».', 'no', 'Te deja fuera de mercado y no elimina el riesgo, solo lo tapa.'],
      ],
      means: 'Cubrir no es ganar dinero con la divisa: es renunciar a ganar y a perder para que el margen comercial dependa del negocio y no del mercado.',
    }),
    N({
      id: 'c3-17', phase: 5, dim: 'interpretacion', unit: '%', a: ((pcMp - pc0) / pc0) * 100, tol: 0.03,
      intro: '## Sobresalto 2: la materia prima\nVolvemos al tipo de cambio inicial (1,08). Para el siguiente pedido, el arábica ha subido un 15 %; el robusta no se ha movido.',
      data: [{ label: 'Arábica', value: `${f(arClb * 1.15, 0)} ¢/lb (+15 %)` }, { label: 'Nuevo coste por paquete', value: `${f(pcMp, 3)} € (calculado; antes ${f(pc0, 3)})` }],
      q: '¿En qué **porcentaje** sube el coste por paquete?', hints: ['Variación = (nuevo − anterior) ÷ anterior.', `Operación: (${f(pcMp, 3)} − ${f(pc0, 3)}) ÷ ${f(pc0, 3)} × 100`], sol: [`(${f(pcMp, 3)} − ${f(pc0, 3)}) ÷ ${f(pc0, 3)} = **${f(((pcMp - pc0) / pc0) * 100, 1)} %**`], keys: `(${f(pcMp, 3)} − ${f(pc0, 3)}) ÷ ${f(pc0, 3)} × 100 =`,
      traps: [{ v: 15, kind: 'interpretacion', msg: 'El 15 % es la subida del arábica, que es solo una parte del coste del paquete.' }],
      means: 'El arábica sube 15 % pero el paquete sube alrededor de un 9 %: la subida se diluye porque el arábica es solo una parte del coste. Es un argumento que funciona en las dos direcciones: no podés pedir un 15 %, y el cliente no puede pretender un 0 %.',
    }),
    N({ id: 'c3-18', phase: 5, dim: 'calculo', unit: '€/paquete', a: pcMp / 0.82 - pv0, tol: 0.03, q: `Para mantener el margen del 18 %, ¿cuántos **euros por paquete** tenés que subir el precio (precio actual ${f(pv0, 3)} €)?`, hints: ['Calculá el precio nuevo con el coste nuevo y restá el actual.', `Operación: ${f(pcMp, 3)} ÷ 0,82 − ${f(pv0, 3)}`], sol: [`Precio nuevo: ${f(pcMp, 3)} ÷ 0,82 = ${f(pcMp / 0.82, 3)} €`, `Subida: ${f(pcMp / 0.82, 3)} − ${f(pv0, 3)} = **${f(pcMp / 0.82 - pv0, 3)} €/paquete**`], keys: `${f(pcMp, 3)} ÷ 0,82 − ${f(pv0, 3)} =`, traps: [{ v: pcMp - pc0, kind: 'interpretacion', msg: 'Eso es la subida del coste. Repercutir solo el coste mantiene el beneficio en euros, pero el margen porcentual baja.' }], means: `Dos posturas defendibles: repercutir solo el coste (${f(pcMp - pc0, 3)} €: mantenés los euros de beneficio) o mantener el porcentaje (${f(pcMp / 0.82 - pv0, 3)} €). Saber las dos cifras te da margen de negociación.` }),
    C({
      id: 'c3-19', phase: 6, dim: 'interpretacion',
      q: '¿Cómo lo planteás al cliente?',
      opts: [
        ['Comunicar la subida con el desglose (qué sube, cuánto pesa en el coste), fecha de efecto y periodo de validez.', 'ok', 'Transparente y verificable: el cliente puede comprobar la evolución del mercado. Conviene tener preparada una posición de repliegue (repercutir solo el coste).'],
        ['Ofrecer alternativas acordadas: otra proporción de mezcla, otro formato o un compromiso de volumen a cambio de menor subida.', 'alt', 'Buena jugada si el cliente es sensible al precio. Cambia el producto: tiene que aprobarlo por escrito y con muestras.'],
        ['Absorber la subida esta vez para proteger la relación.', 'alt', `Puede ser razonable con una cuenta estratégica y una subida que creés temporal. Pero cuantificalo: son unos ${f((pcMp - pc0) * paq, 0)} € en este pedido, y sienta precedente.`],
        ['Cambiar la mezcla a 60/40 sin decir nada para compensar.', 'no', 'Es un incumplimiento de la especificación pactada: riesgo de reclamación, pérdida del cliente y daño reputacional.'],
      ],
    }),
    N({
      id: 'c3-20', phase: 5, dim: 'unidades', unit: '€/paquete', a: (0.05 / 0.84) * 0.25, tol: 0.03,
      intro: '## Sobresalto 3: el transporte\nEl transitario avisa de un recargo en el flete marítimo.',
      data: [{ label: 'Recargo de flete', value: '+0,05 €/kg de café verde' }],
      q: '¿Cuánto sube el coste **por paquete**?', hints: ['El recargo es por kg de verde: pasalo a kg tostado y después a paquete.', 'Operación: 0,05 ÷ 0,84 × 0,25'], sol: ['Por kg tostado: 0,05 ÷ 0,84 = 0,0595 €', 'Por paquete: × 0,25 = **0,0149 €**'], keys: '0,05 ÷ 0,84 × 0,25 =',
      means: `Céntimo y medio por paquete (${f((((0.05 / 0.84) * 0.25) / pc0) * 100, 1)} % del coste), frente a los ${f(pcMp - pc0, 2)} € de la subida del arábica. No todos los sobresaltos merecen una renegociación: cuantificá antes de reaccionar y elegí tus batallas.`,
    }),
    W({
      id: 'c3-21', phase: 7, q: 'Escribí una **nota breve para el CEO** sobre la subida del arábica: qué pasa, cuánto cuesta y qué proponés.',
      checklist: ['Primera línea: la propuesta.', 'Impacto en € por paquete y en € totales del pedido.', 'Diferencia entre repercutir el coste y mantener el margen.', 'Alternativas consideradas y sus consecuencias.', 'Supuestos (tipo de cambio, merma) y qué necesita decidir el CEO.'],
      model: `**Propuesta:** comunicar al cliente una subida de ${f(pcMp / 0.82 - pv0, 2)} €/paquete desde el próximo pedido, con repliegue hasta ${f(pcMp - pc0, 2)} € si hay resistencia.

**Qué pasa:** el arábica ha subido un 15 %; nuestro coste por paquete pasa de ${f(pc0, 2)} a ${f(pcMp, 2)} € (+${f(((pcMp - pc0) / pc0) * 100, 0)} %).

**Impacto si no hacemos nada:** −${f((pcMp - pc0) * paq, 0)} € en un pedido de 40.000 paquetes; el margen cae del 18 % al ${f(((pv0 - pcMp) / pv0) * 100, 0)} %.

**Alternativas:** absorberlo (precedente) o proponer otra mezcla (requiere aprobación del cliente).

**Supuestos:** EUR/USD 1,08; merma 16 %. **Necesito:** tu visto bueno al importe y a la posición de repliegue.`,
    }),
  ],
}

/* ============ CASO 4: retraso de embarque ============ */
const stock = 9600, cons = 480, faltaKg = 6 * cons, spot = 6.95, hab = 6.18, pvT = 11.28
const caso4: Case = {
  id: 'cafe-retraso', title: 'El contenedor se retrasa: continuidad de suministro', sector: 'cafe', tipo: 'Materia prima · logística', level: 2,
  summary: 'Un embarque de café verde llega tres semanas tarde. Calculá la cobertura real, cuantificá las alternativas y decidí cómo evitar la rotura de stock.',
  brief: `Lunes por la mañana. El transitario avisa: el buque con tu contenedor de arábica ha omitido una escala y la llegada se retrasa. Producción pregunta si puede mantener el plan de tueste.

! Datos **simulados**.`,
  steps: [
    C({ id: 'c4-01', phase: 1, dim: 'razonamiento', data: [{ label: 'Stock de arábica en almacén', value: `${f(stock, 0)} kg` }, { label: 'Consumo', value: `${cons} kg por día de producción (5 días por semana)` }, { label: 'Llegada prevista inicial', value: 'dentro de 12 días naturales' }, { label: 'Nueva llegada estimada', value: 'dentro de 33 días naturales' }],
      q: '¿Cuál es la primera pregunta que hay que responder?', opts: [['¿Hasta qué fecha alcanza el stock y cuándo estará disponible el café nuevo?', 'ok', 'Todo lo demás (comprar, reprogramar, avisar) depende de si hay hueco y de cuántos días.'], ['¿Quién tiene la culpa del retraso?', 'no', 'Importará para una eventual reclamación, pero no resuelve el suministro de las próximas semanas.'], ['¿Cuánto cuesta un flete aéreo?', 'no', 'Es saltar a una solución sin haber medido el problema.']] }),
    N({ id: 'c4-02', phase: 4, dim: 'calculo', unit: 'días de producción', a: stock / cons, q: '¿Para cuántos **días de producción** alcanza el stock?', hints: ['Stock ÷ consumo diario.', `Operación: ${stock} ÷ ${cons}`], sol: [`${f(stock, 0)} ÷ ${cons} = **20 días de producción**`], keys: `${stock} ÷ ${cons} =`, mental: '9.600 ÷ 480: quitá un cero a cada uno → 960 ÷ 48 = 20.' }),
    N({ id: 'c4-03', phase: 4, dim: 'unidades', unit: 'días naturales', a: 28, tol: 0, q: 'El barco navega en días naturales, pero la fábrica consume 5 días por semana. ¿Cuántos **días naturales** son 20 días de producción?', hints: ['20 días de producción son 4 semanas de trabajo.', 'Operación: 20 ÷ 5 × 7'], sol: ['20 ÷ 5 = 4 semanas', '4 × 7 = **28 días naturales**'], keys: '20 ÷ 5 × 7 =', traps: [{ v: 20, kind: 'unidades', msg: 'Esos son días de producción. Para comparar con la llegada del barco necesitás días naturales.' }], means: 'Comparar «20 días» de stock con «33 días» de tránsito sin unificar el tipo de día es un error de unidades clásico.' }),
    N({ id: 'c4-04', phase: 4, dim: 'supuestos', unit: 'días naturales', a: 8, tol: 0, data: [{ label: 'Descarga, transporte y control de calidad tras la llegada', value: '3 días naturales' }], q: '¿Durante cuántos **días naturales** te quedarías sin café?', hints: ['El café no está disponible el día que llega el barco.', 'Disponible el día 33 + 3 = 36. Stock hasta el día 28.', 'Operación: 33 + 3 − 28'], sol: ['Disponibilidad: día 36', 'Stock agotado: día 28', '36 − 28 = **8 días naturales** (unos 6 días de producción)'], keys: '33 + 3 − 28 =', traps: [{ v: 5, kind: 'supuesto', msg: 'Supusiste que el café se puede tostar el mismo día que llega el buque. Faltan descarga, transporte y control de calidad.' }], means: `Seis días de producción son ${f(faltaKg, 0)} kg de café verde que hay que conseguir, o producción que no sale.` }),
    C({ id: 'c4-05', phase: 2, dim: 'supuestos', multi: true, q: 'Antes de proponer nada, ¿qué conviene **verificar**?', opts: [['El stock físico real y su calidad (no solo el del sistema).', 'ok', 'Un saco dañado o un error de inventario cambian el cálculo.'], ['La nueva fecha con el transitario o la naviera, y su fiabilidad.', 'ok', 'Una ETA puede volver a moverse.'], ['Los pedidos de clientes comprometidos en esas semanas.', 'ok', 'Quizá no todo el consumo previsto es firme o igual de urgente.'], ['Si hay otro café equivalente aprobado disponible en Europa.', 'ok', 'Es la base de la alternativa «comprar spot».'], ['El color corporativo del nuevo envase.', 'no', 'No tiene relación con el problema.']] }),
    N({ id: 'c4-06', phase: 5, dim: 'calculo', unit: '€', a: faltaKg * (spot - hab), tol: 0.01, intro: 'Un importador europeo tiene café de calidad equivalente disponible para entrega inmediata.', data: [{ label: 'Precio spot del importador', value: `${f(spot)} €/kg entregado` }, { label: 'Tu coste habitual puesto en almacén', value: `${f(hab)} €/kg` }, { label: 'Cantidad a cubrir', value: `${f(faltaKg, 0)} kg (48 sacos)` }], q: '¿Cuál es el **sobrecoste total** de cubrir el hueco con café spot?', hints: ['Diferencia de precio × kilos.', `Operación: ${faltaKg} × (${f(spot)} − ${f(hab)})`], sol: [`Diferencia: ${f(spot)} − ${f(hab)} = ${f(spot - hab)} €/kg`, `× ${f(faltaKg, 0)} kg = **${f(faltaKg * (spot - hab), 0)} €**`], keys: `${faltaKg} × (${f(spot)} − ${f(hab)}) =`, traps: [{ v: faltaKg * spot, kind: 'interpretacion', msg: 'Ese es el importe total de la compra. El sobrecoste es solo la diferencia respecto a lo que habrías pagado igualmente.' }], means: 'Lo relevante para decidir es el coste **incremental**, no el importe de la factura. Atención a la caja: sí tendrás que pagar la factura completa, y antes de lo previsto.' }),
    N({ id: 'c4-07', phase: 5, dim: 'interpretacion', unit: '€', a: faltaKg * 0.84 * pvT * 0.25, tol: 0.01, data: [{ label: 'Precio de venta del tostado', value: `${f(pvT)} €/kg` }, { label: 'Margen sobre ventas', value: '25 %' }, { label: 'Merma de tueste', value: '16 %' }], q: `Si no cubrís el hueco, ¿cuánto **margen** dejás de ganar por no tostar esos ${f(faltaKg, 0)} kg de verde?`, hints: ['Primero cuántos kg de tostado no se venden; después su venta; después el margen.', `Operación: ${faltaKg} × 0,84 × ${f(pvT)} × 25 %`], sol: [`Tostado no producido: ${f(faltaKg, 0)} × 0,84 = ${f(faltaKg * 0.84, 0)} kg`, `Ventas perdidas: × ${f(pvT)} = ${f(faltaKg * 0.84 * pvT, 0)} €`, `Margen perdido: × 25 % = **${f(faltaKg * 0.84 * pvT * 0.25, 0)} €**`], keys: `${faltaKg} × 0,84 × ${f(pvT)} × 25% =`, means: 'Y eso sin contar penalizaciones por falta de servicio ni el riesgo de que el cliente pruebe a otro proveedor. El coste de no servir casi nunca es solo el margen de ese pedido.' }),
    C({ id: 'c4-08', phase: 6, dim: 'interpretacion', q: '¿Qué proponés?', opts: [['Comprar spot los 48 sacos, previa aprobación de muestra por calidad.', 'ok', `Sobrecoste ≈ ${f(faltaKg * (spot - hab), 0)} € frente a ≈ ${f(faltaKg * 0.84 * pvT * 0.25, 0)} € de margen perdido más el daño comercial. Condición: calidad debe confirmar que el café es equivalente.`], ['Comprar spot solo una parte y reprogramar entregas con los clientes menos urgentes.', 'alt', 'Reduce el sobrecoste pero exige coordinación con ventas y transparencia con clientes. Razonable si algunos pedidos tienen holgura.'], ['Esperar: los barcos a veces recuperan tiempo.', 'no', 'Es apostar la continuidad del servicio a algo que no controlás.'], ['Sustituir temporalmente por otro café que ya hay en almacén sin avisar.', 'no', 'Cambia la especificación del producto vendido. Solo con acuerdo del cliente.']], means: 'Comprar el café llegará igual: cuando el contenedor arribe tendrás más stock del previsto. Avisá a compras para ajustar el siguiente pedido.' }),
    C({ id: 'c4-09', phase: 6, dim: 'supuestos', q: 'Pasada la urgencia: ¿qué cambiarías para que no se repita?', opts: [['Revisar el stock de seguridad usando los retrasos reales de esa ruta, no el tránsito «de catálogo».', 'ok', 'El punto de pedido suponía un plazo fiable. Si la ruta se retrasa a menudo, el supuesto era optimista. Más stock de seguridad cuesta (caja, espacio, frescura): es una decisión, no una fórmula.'], ['Duplicar siempre el stock de café.', 'alt', 'Elimina casi todo el riesgo, pero inmoviliza mucha caja y el verde también envejece. Puede justificarse en orígenes críticos, no en general.'], ['Nada: fue mala suerte.', 'no', 'Puede serlo, pero sin mirar el historial de retrasos no lo sabés.']] }),
    W({ id: 'c4-10', phase: 7, q: 'Escribí un **mensaje interno** (producción, ventas, compras) con la situación y el plan.', checklist: ['Qué ha pasado y nueva fecha estimada, indicando que es una estimación.', 'Hasta qué fecha alcanza el stock.', 'Qué se ha decidido y quién hace qué.', 'Qué se necesita de cada departamento y para cuándo.', 'Cuándo será la próxima actualización.'], model: `**Asunto: Retraso contenedor arábica – plan de continuidad**

El contenedor previsto para dentro de 12 días llegará, según el transitario, en unos 33 días (estimación; la confirmo el jueves). Con descarga y control de calidad, el café estaría disponible hacia el día 36.

El stock actual (9.600 kg) cubre el plan de tueste hasta el día 28. Hueco estimado: 6 días de producción (≈ 2.880 kg).

**Plan:** comprar 48 sacos a un importador europeo, sujeto a aprobación de muestra.
- **Calidad:** valorar la muestra antes del miércoles.
- **Compras:** cerrar la compra spot si calidad aprueba; ajustar el siguiente pedido.
- **Ventas:** indicarme antes del miércoles qué pedidos de esas semanas tienen fecha inamovible.
- **Producción:** mantener el plan actual; aviso si cambia algo.

Próxima actualización: jueves.` }),
  ],
}

export const CASES_CAFE: Case[] = [caso1, caso3, caso4]
