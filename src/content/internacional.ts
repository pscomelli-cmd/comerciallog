import type { Case, Lesson } from '../lib/types.ts'
import { f } from '../lib/num.ts'
import { C, N, W } from './h.ts'

const L = (o: Omit<Lesson, 'track' | 'sector'>): Lesson => ({ track: 'internacional', sector: 'comun', ...o })
const U1 = '1 · Pensar en internacional', U2 = '2 · Dinero y riesgo', U3 = '3 · Mercados, socios y fronteras'

export const LESSONS_INT: Lesson[] = [
  L({
    id: 'i-mentalidad', unit: U1, title: 'La mentalidad: qué cambia cuando cruzás una frontera',
    body: `Vender o comprar en otro país no es «lo mismo, pero más lejos». Aparecen riesgos que en una operación local no existen o son pequeños. Un profesional internacional los nombra antes de calcular.

## Los cinco riesgos

| Riesgo | Pregunta que hay que hacerse | Quién ayuda |
|---|---|---|
| **Precio** | ¿Mi compra o mi venta tiene el precio cerrado? ¿Las dos? | Compras, dirección |
| **Divisa** | ¿En qué moneda cobro y en cuál pago? ¿Cuánto tiempo pasa entre fijar el precio y mover el dinero? | Finanzas |
| **Contraparte y país** | ¿Quién es? ¿Paga? ¿Su país permite sacar divisas, tiene sanciones, es estable? | Finanzas, seguro de crédito, banco |
| **Logística y tiempo** | ¿Cuántas semanas pasan entre el pedido y la entrega? ¿Qué pasa si se retrasa? | Logística, transitario |
| **Normativa** | ¿Puede entrar el producto? ¿Con qué arancel, documentos y etiquetado? | Agente de aduanas, calidad |

## Tres hábitos mentales

**1. Pensar en el ciclo completo, no en el precio.** Una operación internacional termina cuando el dinero está en la cuenta y no hay reclamaciones abiertas, no cuando sale el contenedor.

**2. Preguntar «¿quién soporta esto?».** Cada riesgo lo lleva alguien: vos, el cliente, el banco, la aseguradora. El Incoterm reparte el del transporte; el medio de pago, el de cobro; la moneda de la factura, el de cambio. Negociar es, en gran parte, repartir riesgos.

**3. Ponerle precio al riesgo.** Un riesgo que no podés eliminar se cubre, se comparte o se cobra. Lo que no se debe hacer es ignorarlo.

## El tiempo lo cambia todo

En local, entre pedido y cobro pueden pasar 30 días. En una importación de ultramar pueden ser cuatro meses: producción, tránsito, aduana, stock, venta, cobro. Durante todo ese tiempo, precio y divisa pueden moverse y la caja está inmovilizada.

> Antes de dar un precio internacional, dibujá la línea de tiempo: fecha de oferta, pedido, embarque, llegada, entrega, cobro. Cada tramo tiene un riesgo y un dueño.`,
    quiz: [
      C({ id: 'i-ment-q1', dim: 'razonamiento', q: 'Vendés pasta a un importador de fuera de Europa: precio en dólares, pago a 90 días tras el embarque, entrega CIF. ¿Qué riesgo **no** estás soportando vos?', opts: [['El de daño de la mercancía durante la travesía.', 'ok', 'En CIF el riesgo pasa al comprador al cargar a bordo (aunque vos pagues flete y seguro).'], ['El de cambio.', 'no', 'Cobrás en dólares dentro de tres meses: si el dólar baja, recibís menos euros.'], ['El de impago.', 'no', 'A 90 días en cuenta abierta, el riesgo de cobro es tuyo.']] }),
    ],
  }),
  L({
    id: 'i-divisa', unit: U2, title: 'Divisas: de qué lado estás', skills: ['fx-impacto', 'precio-usd', 'cafe-clb'],
    body: `## Leer una cotización

«EUR/USD 1,08» significa que **1 euro vale 1,08 dólares**.

- De dólares a euros: **dividir** entre 1,08.
- De euros a dólares: **multiplicar** por 1,08.

Comprobación: mientras el euro valga más de un dólar, el mismo importe tiene que dar **menos euros que dólares**.

## «El euro sube» o «el euro baja»

- EUR/USD pasa de 1,08 a 1,14: el euro se **fortalece** (compra más dólares).
- Pasa de 1,08 a 1,02: el euro se **debilita**.

## ¿A quién beneficia?

| Tu situación | Euro fuerte | Euro débil |
|---|---|---|
| **Pagás** en dólares (importás café, atún) | Te beneficia: comprás más barato | Te perjudica |
| **Cobrás** en dólares (exportás) | Te perjudica: recibís menos euros | Te beneficia |
| Competís con importaciones en dólares | Te perjudica: el rival importa más barato | Te beneficia |

## Cuándo nace la exposición

No cuando pagás, sino cuando **comprometés un precio**. Si hoy das una oferta en dólares válida 30 días para cobrar a 90, tu margen en euros está abierto cuatro meses.

## Cómo se gestiona

- **Facturar en tu moneda.** Traslada el riesgo al cliente. Puede hacerte menos competitivo.
- **Cobertura natural.** Si comprás y vendés en dólares por importes y fechas parecidos, se compensan.
- **Seguro de cambio (_forward_).** Pactás hoy con el banco el cambio de una fecha futura. Fijás el margen; renunciás a ganar si la divisa se mueve a favor.
- **Cláusula de revisión.** El precio se ajusta si el cambio sale de una banda.
- **Validez corta** de las ofertas.

! Cubrir es proteger un cobro o un pago que ya existe. Tomar posiciones en divisa sin una operación comercial detrás es especular. La política la fija finanzas.

## Ejemplo (simulado)

Vendés por 59.400 USD con el cambio a 1,08 (55.000 €). Cobrás a 90 días con el cambio a 1,14: 59.400 ÷ 1,14 = 52.105 €. **Perdiste 2.895 €**; con un margen del 12 % (6.600 €), casi la mitad del beneficio, sin que nada haya ido mal en la operación.`,
  }),
  L({
    id: 'i-pagos', unit: U2, title: 'Medios de pago internacionales: la escalera del riesgo', skills: ['financiacion', 'pronto-pago'],
    body: `En local, si un cliente no paga, hay vías conocidas para reclamar. Con un cliente a 8.000 km, otro idioma y otra jurisdicción, recuperar una deuda es lento, caro e incierto. Por eso el **medio de pago** es parte central de la negociación.

## De más a menos seguro para quien vende

| Medio | Cómo funciona | Riesgo para el vendedor | Riesgo para el comprador |
|---|---|---|---|
| **Pago anticipado** | El comprador paga antes del embarque | Ninguno | Máximo: paga sin tener la mercancía |
| **Crédito documentario (carta de crédito)** | El banco del comprador se compromete a pagar si el vendedor presenta los documentos conformes. **Confirmado**: además responde un banco del país del vendedor | Bajo; muy bajo si está confirmado. Exige documentos perfectos | Bajo: solo se paga contra documentos correctos |
| **Cobranza documentaria** (pago contra documentos) | Los bancos entregan los documentos al comprador cuando paga (o acepta un efecto a plazo). Los bancos no garantizan el pago | Medio: el comprador puede no retirar la mercancía | Medio-bajo |
| **Cuenta abierta** (transferencia a 30, 60, 90 días) | Se envía la mercancía y se factura | Máximo | Ninguno |

## Qué hay que saber

- **Cuanta más seguridad, más coste y más papeleo.** Una carta de crédito tiene comisiones bancarias y exige que cada documento coincida al detalle: una errata puede bloquear el cobro.
- **El banco paga por documentos, no por mercancía.** No comprueba la calidad.
- **Seguro de crédito:** permite vender en cuenta abierta con parte del riesgo cubierto, si la aseguradora acepta al cliente y hasta el límite que conceda.
- **Combinaciones habituales:** anticipo parcial + saldo contra documentos; carta de crédito en las primeras operaciones y cuenta abierta asegurada cuando hay historial.

## Cómo elegir

Depende de cuatro cosas: cuánto conocés al cliente, el riesgo de su país, el importe frente a tu margen, y el poder de negociación de cada parte.

> **Cuenta rápida:** con un margen del 10 %, un impago obliga a vender diez operaciones iguales para recuperarlo. Si el coste de asegurar el cobro es del 1 %, estás pagando una décima parte del margen por no arriesgarlo entero.

_Las reglas de créditos documentarios y cobranzas las publica la Cámara de Comercio Internacional; costes y condiciones concretas dependen de cada banco. Resumen didáctico, no verificado en línea en esta sesión._`,
    quiz: [
      C({ id: 'i-pagos-q1', dim: 'interpretacion', q: 'Un comprador nuevo, de un país que no conocés, pide un primer pedido de 55.000 € en cuenta abierta a 90 días. ¿Cuál es la respuesta más profesional?', opts: [['Proponer carta de crédito confirmada, o anticipo parcial y saldo contra documentos, para las primeras operaciones; y revisar condiciones cuando haya historial.', 'ok', 'Protege el cobro sin cerrar la puerta. Es una práctica habitual y el cliente serio la entiende.'], ['Aceptar: es la costumbre en su mercado.', 'no', 'Puede que lo sea, pero estás financiando y asegurando a un desconocido con tu margen.'], ['Rechazar el pedido.', 'no', 'Perdés una oportunidad que podía asegurarse.']] }),
    ],
  }),
  L({
    id: 'i-aduanas', unit: U3, title: 'Aduanas: clasificación, origen y valor', skills: ['arancel', 'coste-entregado'],
    body: `Que un producto pueda entrar en un país, y a qué coste, depende de tres preguntas. Las tres las responde un agente de aduanas, pero tenés que saber hacerlas.

## 1. ¿Qué es? (clasificación arancelaria)

Cada mercancía tiene un código numérico (el Sistema Armonizado es común a casi todo el mundo en sus primeros seis dígitos; la Unión Europea lo detalla más en su arancel, consultable en **TARIC**). Del código dependen el arancel, los contingentes y los requisitos.

Detalle importante para tus sectores: **el grado de elaboración cambia el código**. Café verde y café tostado, arroz cáscara y arroz blanco, atún entero, lomos y conservas: son códigos distintos y, a menudo, aranceles muy distintos. Es frecuente que la materia prima entre con arancel bajo o nulo y el producto elaborado con uno más alto.

## 2. ¿De dónde es? (origen)

El **origen** no es el país desde donde se embarca, sino donde el producto se obtuvo o tuvo su última transformación sustancial, según reglas específicas.

- **Origen preferencial:** si existe un acuerdo comercial y el producto cumple sus reglas de origen, puede pagar un arancel reducido o cero. Hace falta la **prueba de origen** que exija el acuerdo.
- Sin esa prueba válida, se paga el arancel general aunque el producto «sea» de ese país.

## 3. ¿Cuánto vale? (valor en aduana)

En la importación a la UE, la base suele ser el valor de la mercancía **puesta en frontera**: precio más flete y seguro hasta la entrada (aproximadamente, el valor CIF).

**Coste tras importación** = valor en aduana × (1 + arancel) + gastos de despacho y puerto

El **IVA de importación** se calcula sobre el valor más el arancel. Normalmente es recuperable: no es un coste, pero hay que adelantarlo (según el país, puede existir un régimen que evita ese adelanto).

## Además del arancel

Barreras **no arancelarias**: controles sanitarios y fitosanitarios, certificados de captura en productos de la pesca, límites de residuos, etiquetado en el idioma local, registros previos del producto o del establecimiento, contingentes y licencias. A menudo deciden más que el arancel si un negocio es viable.

! Aranceles, acuerdos y requisitos cambian. Todo porcentaje de esta plataforma es **simulado**. Para un caso real: código exacto, origen exacto y consulta en la fuente oficial o con el agente de aduanas, con fecha.`,
    quiz: [
      C({ id: 'i-adu-q1', dim: 'supuestos', q: 'Un proveedor asegura: «Nuestro producto entra en la UE con arancel cero porque nuestro país tiene acuerdo». ¿Qué comprobás?', opts: [['Que el producto, con su código exacto, está cubierto por el acuerdo, que cumple las reglas de origen y que el proveedor puede emitir la prueba de origen válida.', 'ok', 'Las tres condiciones. Si falla una, pagás el arancel general, y lo pagás vos como importador.'], ['Nada: el proveedor conoce su producto.', 'no', 'Quien responde ante la aduana es el importador.'], ['Solo que el barco salga de ese país.', 'no', 'El puerto de embarque no determina el origen.']] }),
    ],
  }),
  L({
    id: 'i-mercados', unit: U3, title: 'Elegir mercado, canal y socio',
    body: `## Evaluar un mercado

Una rejilla sencilla, igual para todos los candidatos:

| Criterio | Qué mirar |
|---|---|
| **Demanda** | Consumo del producto, tendencia, segmento de precio |
| **Acceso** | Arancel, requisitos sanitarios, registros, etiquetado |
| **Competencia** | Producción local, otros exportadores, precios en destino |
| **Logística** | Tránsito, coste por kg, frecuencia de salidas, cadena de frío si aplica |
| **Riesgo** | Divisa, estabilidad, facilidad de cobro |
| **Coste de entrada** | Adaptación de envase, certificaciones, viajes, muestras, ferias |

El mercado más grande no siempre es el mejor **primer** mercado. A menudo conviene empezar por uno cercano y parecido, aprender, y después ir a los lejanos.

## El precio no se calcula: se reconstruye hacia atrás

Partí del precio que el consumidor o el cliente final paga en destino, y restá: margen del minorista, margen del importador o distribuidor, impuestos, arancel, logística. Lo que queda es el precio máximo al que podés vender. Si ese precio no cubre tu coste más tu margen, el mercado no es viable con ese producto, por mucho que guste.

## Canales de entrada

| Canal | Qué hace | Control | Inversión y riesgo |
|---|---|---|---|
| **Importador-distribuidor** | Compra, importa y revende | Bajo | Bajos; él asume stock y cobro local |
| **Agente** | Vende en tu nombre a comisión; vos facturás | Medio | Vos asumís cobro y logística |
| **Venta directa a cadenas** | Suministrás a la distribución | Alto | Exigente en servicio y volumen |
| **Filial propia** | Empresa tuya en destino | Total | Altos |

## Elegir y evaluar al socio

Antes de firmar: quién es (registro, antigüedad, propietarios), qué marcas lleva (¿competidoras?), cobertura real, solvencia (informe comercial, referencias bancarias y de otros proveedores), y qué te pide (exclusividad, apoyo de marketing, plazo).

**Exclusividad:** es lo más valioso que podés dar. Si la concedés, que sea limitada en territorio y tiempo, y condicionada a objetivos de compra.

## Lo que el contrato debe decir

Producto y especificación, Incoterm y lugar, precio y moneda, medio y plazo de pago, calidad e inspección, plazos y penalizaciones, exclusividad y objetivos, duración y salida, **ley aplicable y forma de resolver disputas** (tribunales de dónde, o arbitraje). Lo que no esté escrito lo decidirá, llegado el caso, una ley que quizá no conocés.

! Cada país tiene reglas propias sobre agentes y distribuidores (por ejemplo, indemnizaciones al terminar la relación). Antes de firmar, asesoría legal local.`,
  }),
  L({
    id: 'i-cultura', unit: U3, title: 'Negociar y comunicar entre culturas',
    body: `Trabajás en un grupo internacional y en cuatro idiomas: ya sabés que la misma frase no significa lo mismo en todas partes. Lo que sigue son **tendencias a las que prestar atención, no reglas**: cada persona y cada empresa son un caso, y tratar a alguien según el estereotipo de su país es un error tan grande como ignorar las diferencias.

## Cuatro dimensiones que conviene observar

- **Directo o indirecto.** En algunos entornos un «no» se dice con claridad; en otros se expresa como «lo estudiaremos» o «es difícil». Aprender a oír el no indirecto evita esperar pedidos que nunca llegarán.
- **Tarea o relación.** Hay quien hace negocios para después conocerse, y quien necesita conocerse para hacer negocios. En el segundo caso, la primera reunión sin hablar de precio no es tiempo perdido: es la negociación.
- **Tiempo.** Puntualidad, plazos y ritmo de decisión varían. Preguntá cómo se toma la decisión y quién interviene, en lugar de suponerlo.
- **Jerarquía.** Quién puede decidir, y si conviene que tu interlocutor quede bien ante su jefe.

## Lo que funciona casi siempre

- **Confirmar por escrito** lo hablado: «Para asegurarme de que entendí bien…». Con cifras, unidades, moneda, Incoterm y fechas.
- **Escribir sencillo.** Frases cortas, sin modismos ni ironía. Muchas veces ambos usan un idioma que no es el propio.
- **Fechas sin ambigüedad:** «12 de marzo de 2027», no 03/12/27. Lo mismo con decimales y miles: 1.250 y 1,250 no significan lo mismo en todos los países.
- **Husos horarios y festivos:** indicá la zona en cada hora propuesta y consultá el calendario del otro país antes de fijar plazos.
- **Preguntar** cuando algo no encaja, antes de interpretar.

## En la negociación

- Averiguá qué valora la otra parte además del precio: seguridad de suministro, exclusividad, plazo, apoyo comercial, estabilidad.
- Concesiones siempre **a cambio de algo**, en cualquier cultura.
- Paciencia con los silencios: no hay que llenarlos bajando el precio.
- Lo acordado, al contrato. La confianza personal es valiosa y no sustituye al documento.

## Tu ventaja

Quien habla varios idiomas y conoce a las dos partes puede hacer algo que vale mucho: **traducir intenciones, no solo palabras**. «Cuando dicen X, lo que les preocupa es Y» es una frase que un CEO agradece.`,
    quiz: [
      C({ id: 'i-cult-q1', dim: 'razonamiento', q: 'Tras una reunión por videollamada con un posible distribuidor, este se despide con «muy interesante, lo estudiaremos con calma». ¿Qué hacés?', opts: [['Enviar ese mismo día un resumen escrito de lo hablado con los puntos abiertos, y proponer una fecha concreta para el siguiente paso.', 'ok', 'Convierte una frase ambigua en algo verificable: si no hay respuesta a una propuesta concreta, ya tenés información.'], ['Dar el acuerdo por hecho y avisar a producción.', 'no', 'Puede ser un sí cortés o un no indirecto: no lo sabés.'], ['Esperar a que llamen.', 'no', 'Sin seguimiento, lo más probable es que no pase nada.']] }),
    ],
  }),
]

/* ============ CASO: primer pedido de exportación ============ */
const imp = 55000, mg = 0.12, usd = imp * 1.08, fx1 = 1.14
const expo: Case = {
  id: 'int-primer-pedido', title: 'Primer pedido de un importador nuevo: pago y moneda', sector: 'pasta', tipo: 'Producto terminado · exportación', level: 2,
  summary: 'Un importador de fuera de Europa pide dos contenedores de pasta en cuenta abierta y en dólares. Poné cifras al riesgo de cobro y al de cambio, y respondé sin perder el pedido.',
  brief: `Un importador con el que nunca trabajaste, de un país fuera de la UE, quiere **dos contenedores de pasta**. Pide **factura en dólares** y **pago a 90 días en cuenta abierta**: «es lo normal en nuestro mercado».

Ventas quiere el pedido. El CEO te pregunta qué condiciones proponer.

! Datos **simulados**, incluidos los costes bancarios y de seguro.`,
  steps: [
    C({ id: 'ie-01', phase: 1, dim: 'razonamiento', data: [{ label: 'Importe del pedido', value: `${f(imp, 0)} € (FOB)` }, { label: 'Margen sobre ventas', value: '12 %' }, { label: 'Tipo de cambio hoy', value: '1 € = 1,08 USD' }], q: 'Con esas condiciones, ¿qué riesgos estarías asumiendo que no existen en una venta local a un cliente conocido?', opts: [['Riesgo de impago de un desconocido en otra jurisdicción y riesgo de cambio durante más de tres meses.', 'ok', 'Los dos son tuyos con cuenta abierta y factura en dólares. Además financiás 90 días.'], ['Solo el de transporte.', 'no', 'En FOB el riesgo del transporte principal es del comprador.'], ['Ninguno relevante: el pedido es firme.', 'no', 'Un pedido firme no es un cobro.']] }),
    N({ id: 'ie-02', phase: 4, dim: 'calculo', unit: '€', a: imp * mg, q: '¿Cuánto **margen** deja este pedido?', hints: ['Importe × margen.', 'Operación: 55000 × 12 %'], sol: [`${f(imp, 0)} × 12 % = **${f(imp * mg, 0)} €**`], keys: '55000 × 12% =', mental: '10 % son 5.500; 2 % son 1.100.' }),
    N({ id: 'ie-03', phase: 4, dim: 'interpretacion', unit: 'pedidos', a: 1 / mg, tol: 0.03, q: 'Si este pedido no se cobra, ¿cuántos **pedidos iguales** hay que vender y cobrar para recuperar lo perdido?', hints: ['Lo perdido es el importe completo; cada pedido aporta solo su margen.', 'Operación: 55000 ÷ 6600'], sol: [`${f(imp, 0)} ÷ ${f(imp * mg, 0)} = **${f(1 / mg, 1)} pedidos**`], keys: '55000 ÷ 6600 =', means: 'Arriesgás 55.000 € para ganar 6.600 €. Esa asimetría es la razón de ser de los medios de pago seguros.' }),
    N({ id: 'ie-04', phase: 5, dim: 'calculo', unit: '€', a: imp * 0.012, data: [{ label: 'Carta de crédito confirmada', value: 'coste total 1,2 % del importe' }, { label: 'Seguro de crédito', value: '0,5 % del importe, si la aseguradora acepta al cliente; cubre el 90 %' }], q: '¿Cuánto costaría cobrar con **carta de crédito confirmada**?', hints: ['Operación: 55000 × 1,2 %'], sol: [`${f(imp, 0)} × 1,2 % = **${f(imp * 0.012, 0)} €**`, `Es el ${f((0.012 / mg) * 100, 0)} % del margen del pedido`], keys: '55000 × 1,2% =', means: 'Pagar 660 € para no arriesgar 55.000 €: una décima parte del margen. Es un coste que se puede incluir en el precio o negociar con el cliente.' }),
    N({ id: 'ie-05', phase: 4, dim: 'unidades', unit: 'USD', a: usd, q: 'El cliente quiere la factura en dólares. ¿Qué **importe en USD** equivale hoy a 55.000 €?', hints: ['De euros a dólares se multiplica.', 'Operación: 55000 × 1,08'], sol: [`${f(imp, 0)} × 1,08 = **${f(usd, 0)} USD**`], keys: '55000 × 1,08 =', traps: [{ v: imp / 1.08, kind: 'unidades', msg: 'Dividiste. Un euro vale más de un dólar: el importe en dólares tiene que ser mayor.' }] }),
    N({ id: 'ie-06', phase: 5, dim: 'interpretacion', unit: '€', a: imp - usd / fx1, tol: 0.02, intro: 'Facturás 59.400 USD. Noventa días después, al cobrar, el cambio es 1 € = 1,14 USD.', q: '¿Cuántos **euros menos** de los previstos recibís?', hints: ['Convertí los dólares cobrados al cambio nuevo y compará con 55.000 €.', 'Operación: 55000 − 59400 ÷ 1,14'], sol: [`Cobro: ${f(usd, 0)} ÷ 1,14 = ${f(usd / fx1, 0)} €`, `Diferencia: 55.000 − ${f(usd / fx1, 0)} = **${f(imp - usd / fx1, 0)} €**`, `Es el ${f(((imp - usd / fx1) / (imp * mg)) * 100, 0)} % del margen`], keys: '55000 − 59400 ÷ 1,14 =', means: 'El euro se fortaleció un 5,6 % y se llevó casi la mitad del margen. No hubo impago ni reclamación: solo pasó el tiempo.' }),
    C({ id: 'ie-07', phase: 2, dim: 'supuestos', multi: true, q: '¿Qué averiguás sobre el cliente antes de proponer condiciones?', opts: [['Informe comercial y referencias de otros proveedores.', 'ok', 'Lo mínimo con un desconocido.'], ['Si la aseguradora de crédito le concede límite, y cuánto.', 'ok', 'Su respuesta ya es información sobre el cliente.'], ['Riesgo de su país: restricciones para pagar al exterior, sanciones, estabilidad.', 'ok', 'Un cliente solvente puede no poder pagar si su país limita las divisas.'], ['Requisitos de importación y etiquetado de la pasta en destino.', 'ok', 'Si la mercancía no puede entrar, tampoco se cobra.'], ['Su número de seguidores en redes sociales.', 'no', 'No dice nada de su solvencia.']] }),
    C({ id: 'ie-08', phase: 6, dim: 'interpretacion', q: '¿Qué condiciones de **pago** proponés para este primer pedido?', opts: [['Carta de crédito confirmada, o 30 % anticipado y el resto contra documentos; con revisión de condiciones tras dos o tres operaciones.', 'ok', 'Asegura el cobro y ofrece un camino hacia mejores condiciones. Consecuencia: algo de coste y papeleo para ambos.'], ['Cuenta abierta a 90 días, pero solo si el seguro de crédito lo cubre.', 'alt', 'Da al cliente lo que pide con el 90 % cubierto. Depende de que la aseguradora lo acepte; sigue quedando un 10 % y el riesgo de cambio.'], ['Cuenta abierta a 90 días sin más: no queremos perder el pedido.', 'no', 'Arriesgás 55.000 € por 6.600 € con alguien que no conocés.'], ['Solo pago anticipado del 100 %.', 'alt', 'Lo más seguro, pero muchos compradores serios no lo aceptan: ellos tampoco te conocen.']] }),
    C({ id: 'ie-09', phase: 6, dim: 'interpretacion', q: '¿Y sobre la **moneda**?', opts: [['Ofertar en euros; si el cliente necesita dólares, ofertar en dólares con validez corta y pedir a finanzas que asegure el cambio al confirmar el pedido.', 'ok', 'O el riesgo lo lleva el cliente, o se cubre. Las dos son gestiones conscientes.'], ['Aceptar dólares y añadir un pequeño colchón al precio.', 'alt', 'Mejor que nada, pero el tamaño del colchón es una apuesta: puede sobrar y hacerte perder el pedido, o faltar.'], ['Aceptar dólares sin más: el dólar suele subir.', 'no', 'Eso es una opinión sobre el mercado, no una gestión del riesgo.']] }),
    W({ id: 'ie-10', phase: 7, q: 'Escribí la **respuesta al importador** con tu propuesta. (Podés redactarla también en inglés desde la sección de correos.)', checklist: ['Agradece el pedido y muestra interés real.', 'Propone medio de pago concreto para las primeras operaciones.', 'Explica que es práctica habitual, sin mostrar desconfianza personal.', 'Indica moneda, Incoterm y validez.', 'Abre la puerta a revisar condiciones con el tiempo.'], model: `Estimado Sr. Rahman:

Gracias por su pedido de dos contenedores. Nos alegra iniciar esta colaboración.

Para las primeras operaciones con nuevos socios trabajamos con **carta de crédito irrevocable y confirmada**, o bien con un **30 % anticipado y el saldo contra documentos**. Es nuestra práctica habitual con todos los clientes nuevos; tras las primeras entregas revisamos con gusto las condiciones.

Nuestra oferta es de 55.000 EUR, FOB Génova, válida 15 días. Si prefiere factura en dólares, podemos cotizarla al cambio del día de la confirmación.

¿Le parece que lo comentemos esta semana?

Un cordial saludo,` }),
  ],
}

/* ============ CASO: importar con arancel y origen ============ */
const t = 24, fx = 1.08, pA = 5200, pB = 5650, dA = 0.24
const eA = pA / fx, eB = pB / fx
const impo: Case = {
  id: 'int-arancel-origen', title: 'Lomos de atún: el proveedor barato y el arancel', sector: 'atun', tipo: 'Semielaborado · importación', level: 2,
  summary: 'Dos orígenes para el mismo semielaborado. Uno es más barato en dólares; el otro entra con preferencia arancelaria. Calculá el coste tras importación y qué hay que comprobar.',
  brief: `Una conservera necesita **24 t de lomos de atún cocidos congelados**. Hay dos ofertas de calidad equivalente, de dos países distintos.

! Precios, aranceles y preferencias **simulados**. En un caso real, el arancel depende del código exacto, del origen, de los acuerdos vigentes y de posibles contingentes: se consulta en TARIC con fecha, o con el agente de aduanas.`,
  steps: [
    C({ id: 'ii-01', phase: 1, dim: 'razonamiento', data: [{ label: 'Proveedor A (país sin acuerdo)', value: `${f(pA, 0)} USD/t CIF · arancel 24 %` }, { label: 'Proveedor B (país con acuerdo preferencial)', value: `${f(pB, 0)} USD/t CIF · arancel 0 % con prueba de origen` }, { label: 'Tipo de cambio', value: '1 € = 1,08 USD' }], q: 'A es 450 USD/t más barato. ¿Alcanza con eso para elegirlo?', opts: [['No: hay que comparar el coste después de la importación, con arancel incluido.', 'ok', 'El precio CIF no es el coste puesto en fábrica.'], ['Sí: mismo producto, mismo Incoterm, menor precio.', 'no', 'Mismo Incoterm, pero distinto trato en frontera.'], ['Depende solo del flete.', 'no', 'Las dos ofertas son CIF: el flete ya está incluido.']] }),
    N({ id: 'ii-02', phase: 4, dim: 'unidades', unit: '€/t', a: eA, q: 'Valor en aduana de **A** en €/t.', hints: ['De USD a EUR: dividir entre 1,08.', `Operación: ${pA} ÷ 1,08`], sol: [`${f(pA, 0)} ÷ 1,08 = **${f(eA)} €/t**`], keys: `${pA} ÷ 1,08 =`, traps: [{ v: pA * fx, kind: 'unidades', msg: 'Multiplicaste. De dólares a euros se divide.' }] }),
    N({ id: 'ii-03', phase: 4, dim: 'supuestos', unit: '€/t', a: eA * (1 + dA), q: 'Coste de **A** tras aplicar el arancel del 24 %.', hints: ['El arancel se calcula sobre el valor en aduana.', `Operación: ${f(eA)} × 1,24`], sol: [`Arancel: ${f(eA)} × 24 % = ${f(eA * dA)} €/t`, `Coste: **${f(eA * (1 + dA))} €/t**`], keys: `${f(eA)} × 1,24 =` }),
    N({ id: 'ii-04', phase: 4, dim: 'unidades', unit: '€/t', a: eB, q: 'Coste de **B** (arancel 0 %) en €/t.', hints: [`Operación: ${pB} ÷ 1,08`], sol: [`${f(pB, 0)} ÷ 1,08 = **${f(eB)} €/t**`], keys: `${pB} ÷ 1,08 =` }),
    N({ id: 'ii-05', phase: 5, dim: 'calculo', unit: '€', a: (eA * (1 + dA) - eB) * t, tol: 0.01, q: '¿Cuánto **ahorra B** en el total de las 24 t?', hints: ['Diferencia por tonelada × 24.', `Operación: (${f(eA * (1 + dA))} − ${f(eB)}) × 24`], sol: [`Por tonelada: ${f(eA * (1 + dA))} − ${f(eB)} = ${f(eA * (1 + dA) - eB)} €`, `× 24 t = **${f((eA * (1 + dA) - eB) * t, 0)} €**`], keys: `(${f(eA * (1 + dA))} − ${f(eB)}) × 24 =`, means: 'El proveedor «caro» resulta bastante más barato puesto en fábrica. Pero todo ese ahorro depende de una condición.' }),
    C({ id: 'ii-06', phase: 2, dim: 'supuestos', multi: true, q: '¿Qué hay que **verificar** para que el arancel 0 % de B sea real?', opts: [['Que el código arancelario exacto de los lomos está cubierto por el acuerdo.', 'ok', 'Los acuerdos no cubren todos los productos por igual.'], ['Que el producto cumple las reglas de origen (por ejemplo, de dónde procede el pescado).', 'ok', 'En pesca, el origen de la materia prima suele ser determinante.'], ['Que el proveedor emite la prueba de origen válida para cada envío.', 'ok', 'Sin ella se paga el arancel general.'], ['Si hay un contingente y si queda cupo.', 'ok', 'Una preferencia puede estar limitada a un volumen anual.'], ['Certificados sanitarios y de captura exigidos.', 'ok', 'Sin ellos la mercancía no entra, con o sin arancel.'], ['El color del embalaje.', 'no', 'No afecta.']] }),
    N({ id: 'ii-07', phase: 5, dim: 'interpretacion', unit: '€', a: eB * dA * t, tol: 0.01, intro: 'Escenario: comprás a B, pero el certificado de origen llega con un defecto y la aduana **no acepta la preferencia**.', q: '¿Cuánto arancel inesperado pagás por las 24 t?', hints: ['24 % sobre el valor en aduana de B, por 24 t.', `Operación: ${f(eB)} × 24 % × 24`], sol: [`${f(eB)} × 24 % = ${f(eB * dA)} €/t`, `× 24 t = **${f(eB * dA * t, 0)} €**`], keys: `${f(eB)} × 24% × 24 =`, means: `En ese caso B sale ${f((eB * (1 + dA) - eA * (1 + dA)) * t, 0)} € más caro que A. Un documento decide qué proveedor era el bueno: por eso conviene pactar en el contrato quién asume el arancel si la prueba de origen falla.` }),
    C({ id: 'ii-08', phase: 3, dim: 'razonamiento', q: '¿A quién consultás el arancel aplicable y los requisitos antes de comprar?', opts: [['Al agente de aduanas, con el código y el origen exactos, dejando constancia de la fecha.', 'ok', 'Es su especialidad y la normativa cambia.'], ['Al proveedor.', 'no', 'Puede orientar, pero quien responde ante la aduana es el importador.'], ['A un foro de internet.', 'no', 'No es una fuente verificable.']] }),
    C({ id: 'ii-09', phase: 6, dim: 'interpretacion', q: '¿Qué recomendás?', opts: [['Comprar a B, con la preferencia confirmada por el agente de aduanas y una cláusula por la que B asume el arancel si su prueba de origen no es válida.', 'ok', 'Capturás el ahorro y cubrís el escenario malo por contrato.'], ['Repartir: una parte a B y otra a A, para no depender de un solo origen.', 'alt', 'Pagás más de media, pero diversificás suministro y riesgo documental. Razonable si el abastecimiento es crítico.'], ['Comprar a A: su precio es menor y no depende de papeles.', 'alt', 'Es más simple y previsible, pero renunciás a un ahorro grande. Solo tendría sentido si la preferencia de B no se puede asegurar.'], ['Comprar a B sin más comprobaciones.', 'no', 'El ahorro entero depende de un documento que no verificaste.']] }),
  ],
}

/* ============ CASO: elegir mercado ============ */
const exw = 1.1, vA = 200000, pAe = 1.45, lA = 0.09, vB = 150000, pBu = 1.95, lB = 0.21, fijo = 18000
const cA = (pAe - lA - exw) * vA, cuB = (fxx: number) => pBu / fxx - lB - exw, cB = cuB(1.08) * vB - fijo
const merc: Case = {
  id: 'int-dos-mercados', title: 'Dos mercados para tu arroz: ¿cuál primero?', sector: 'arroz', tipo: 'Producto terminado · expansión internacional', level: 3,
  summary: 'Un mercado europeo cercano y uno lejano con mejor precio, en dólares y con costes de entrada. Compará contribución, riesgo y esfuerzo, y recomendá por dónde empezar.',
  brief: `La empresa quiere exportar su **arroz envasado**. Hay capacidad y presupuesto para abrir **un** mercado este año. Hay dos candidatos.

! Datos **simulados**.`,
  steps: [
    N({ id: 'im-01', phase: 4, dim: 'calculo', unit: '€/año', a: cA, data: [{ label: 'Coste en fábrica (EXW)', value: `${f(exw)} €/kg` }, { label: 'Mercado A (país vecino de la UE)', value: `${f(vA, 0)} kg/año · ${f(pAe)} €/kg entregado · logística ${f(lA)} €/kg · pago 60 días · sin arancel` }], q: '¿Qué **contribución anual** dejaría el mercado A?', hints: ['(precio − logística − coste) × kilos.', `Operación: (${f(pAe)} − ${f(lA)} − ${f(exw)}) × ${vA}`], sol: [`Por kg: ${f(pAe)} − ${f(lA)} − ${f(exw)} = ${f(pAe - lA - exw)} €`, `× ${f(vA, 0)} = **${f(cA, 0)} €/año**`], keys: `(${f(pAe)} − ${f(lA)} − ${f(exw)}) × ${vA} =` }),
    N({ id: 'im-02', phase: 4, dim: 'unidades', unit: '€/kg', a: cuB(1.08), tol: 0.01, data: [{ label: 'Mercado B (ultramar)', value: `${f(vB, 0)} kg el primer año · ${f(pBu)} USD/kg CIF · flete y seguro ${f(lB)} €/kg · carta de crédito a la vista` }, { label: 'Tipo de cambio', value: '1 € = 1,08 USD' }, { label: 'Coste de entrada', value: `${f(fijo, 0)} € (registro del producto, etiquetado, muestras, viaje)` }], q: '¿Qué **contribución por kg** deja el mercado B?', hints: ['Primero el precio en euros; después restá flete y coste.', `Operación: ${f(pBu)} ÷ 1,08 − ${f(lB)} − ${f(exw)}`], sol: [`Precio: ${f(pBu)} ÷ 1,08 = ${f(pBu / 1.08, 3)} €/kg`, `− ${f(lB)} − ${f(exw)} = **${f(cuB(1.08), 3)} €/kg**`], keys: `${f(pBu)} ÷ 1,08 − ${f(lB)} − ${f(exw)} =`, means: `Casi el doble que en A (${f(pAe - lA - exw)} €/kg). Falta ver volumen, coste de entrada y riesgo.` }),
    N({ id: 'im-03', phase: 4, dim: 'supuestos', unit: '€', a: cB, tol: 0.01, q: '¿Qué contribución deja B el **primer año**, descontando el coste de entrada?', hints: ['Contribución por kg × kilos − coste de entrada.', `Operación: ${f(cuB(1.08), 3)} × ${vB} − ${fijo}`], sol: [`${f(cuB(1.08), 3)} × ${f(vB, 0)} = ${f(cuB(1.08) * vB, 0)} €`, `− ${f(fijo, 0)} = **${f(cB, 0)} €**`], keys: `${f(cuB(1.08), 3)} × ${vB} − ${fijo} =`, traps: [{ v: cuB(1.08) * vB, kind: 'supuesto', msg: 'Olvidaste el coste de entrada: registro, etiquetado y viajes existen solo porque abrís ese mercado.' }], means: `El primer año, A (${f(cA, 0)} €) y B (${f(cB, 0)} €) quedan muy parejos. El segundo año, B ya no paga la entrada.` }),
    N({ id: 'im-04', phase: 5, dim: 'interpretacion', unit: '€', a: cuB(1.18) * vB - fijo, tol: 0.02, intro: 'Escenario: el dólar se debilita y el cambio pasa a **1 € = 1,18 USD**, con el precio en dólares ya pactado para el año.', q: '¿Cuál sería entonces la contribución de B el primer año?', hints: ['Rehacé el precio en euros con 1,18.', `Operación: (${f(pBu)} ÷ 1,18 − ${f(lB)} − ${f(exw)}) × ${vB} − ${fijo}`], sol: [`Precio: ${f(pBu)} ÷ 1,18 = ${f(pBu / 1.18, 3)} €/kg`, `Contribución: ${f(cuB(1.18), 3)} €/kg × ${f(vB, 0)} − ${f(fijo, 0)} = **${f(cuB(1.18) * vB - fijo, 0)} €**`], keys: `(${f(pBu)} ÷ 1,18 − ${f(lB)} − ${f(exw)}) × ${vB} − ${fijo} =`, means: `Una variación del 9 % en la divisa quita unos ${f(cB - (cuB(1.18) * vB - fijo), 0)} €. A no tiene ese riesgo; B sí, salvo que se cubra o se revise el precio.` }),
    N({ id: 'im-05', phase: 5, dim: 'supuestos', unit: '€/año', a: vA * pAe * 0.06 * (60 / 360), tol: 0.01, q: 'En A se cobra a 60 días; en B, a la vista. ¿Cuánto cuesta al año **financiar el plazo de A** (6 % anual)?', hints: ['Ventas anuales × 6 % × 60 ÷ 360.', `Operación: ${vA} × ${f(pAe)} × 6 % × 60 ÷ 360`], sol: [`Ventas: ${f(vA * pAe, 0)} €`, `× 6 % × 60 ÷ 360 = **${f(vA * pAe * 0.06 * (60 / 360), 0)} €/año**`], keys: `${vA} × ${f(pAe)} × 6% × 60 ÷ 360 =`, means: 'Cada mercado tiene su coste oculto: en A, el plazo y el riesgo de cobro; en B, las comisiones de la carta de crédito y la divisa.' }),
    C({ id: 'im-06', phase: 2, dim: 'supuestos', multi: true, q: 'Los números están parejos. ¿Qué información falta para decidir?', opts: [['Requisitos de entrada en B: registro sanitario, etiquetado, plazos reales para obtenerlos.', 'ok', 'Pueden retrasar la primera venta muchos meses.'], ['Qué pide el distribuidor de B: exclusividad, objetivos, apoyo de marketing.', 'ok', 'Condiciona el coste real y la libertad futura.'], ['Potencial a tres años de cada mercado, no solo el primer año.', 'ok', 'Abrir un mercado es una inversión.'], ['Fiabilidad de las previsiones de volumen: ¿pedidos firmes o estimaciones?', 'ok', 'Toda la comparación depende de ellas.'], ['Capacidad interna: quién atenderá cada mercado, idiomas, husos horarios.', 'ok', 'El esfuerzo de gestión no aparece en la cuenta, pero existe.'], ['El clima medio del país.', 'no', 'Salvo que afecte al consumo o a la conservación, no decide.']] }),
    C({ id: 'im-07', phase: 6, dim: 'interpretacion', q: '¿Qué recomendás al CEO?', opts: [['Empezar por A este año, para ganar experiencia exportadora con poco riesgo, y preparar B en paralelo (registro y socio) para abrirlo el año próximo.', 'ok', 'Contribución similar el primer año, sin riesgo de divisa ni costes de entrada, y B no se pierde: se llega mejor preparado. Consecuencia: se retrasa el mercado de mayor margen.'], ['Empezar por B: el margen por kilo es casi el doble y desde el segundo año no hay coste de entrada.', 'alt', 'Defendible si el potencial de B está contrastado y la divisa se cubre o el precio se revisa. Exige más gestión y tolerar un primer año incierto.'], ['Abrir los dos a la vez.', 'alt', 'Maximiza el potencial, pero el supuesto de partida era que solo hay capacidad para uno: habría que cuestionarlo con dirección, no ignorarlo.'], ['Elegir B porque el precio en dólares es mayor que el de A en euros.', 'no', 'Compara monedas distintas y precios en puntos de entrega distintos.']], means: 'No hay una única respuesta correcta. Lo que distingue una buena recomendación es que explicita los supuestos (volúmenes, divisa, plazos de registro) y dice qué haría cambiar la decisión.' }),
    W({ id: 'im-08', phase: 7, q: 'Escribí la **recomendación al CEO** en cinco o seis líneas.', checklist: ['Recomendación en la primera línea.', 'Las dos cifras clave comparables (contribución del primer año).', 'El riesgo principal de cada mercado.', 'Qué supuestos sostienen la recomendación.', 'Qué haría cambiar la decisión y qué se necesita aprobar.'], model: `**Recomiendo abrir el mercado A este año y preparar B para el próximo.**

El primer año la contribución es similar: A unos ${f(cA, 0)} €; B unos ${f(cB, 0)} € tras ${f(fijo, 0)} € de costes de entrada. B deja casi el doble por kilo, pero cobra en dólares: con el cambio a 1,18 bajaría a unos ${f(cuB(1.18) * vB - fijo, 0)} €.

Riesgos: en A, el cobro a 60 días (unos ${f(vA * pAe * 0.06 * (60 / 360), 0)} € de financiación y riesgo de crédito). En B, divisa, plazo de registro y exclusividad del distribuidor.

Supuestos: volúmenes estimados por los clientes, no firmes; cambio 1,08.

Cambiaría la recomendación si B confirmara pedidos firmes y aceptara revisar precio según el cambio. Necesito tu aprobación para iniciar ya el registro en B (${f(fijo, 0)} €).` }),
  ],
}

export const CASES_INT: Case[] = [expo, impo, merc]
