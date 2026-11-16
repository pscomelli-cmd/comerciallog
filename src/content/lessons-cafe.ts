import type { Lesson } from '../lib/types.ts'
import { C } from './h.ts'

const L = (o: Omit<Lesson, 'track' | 'sector'>): Lesson => ({ track: 'cafe', sector: 'cafe', ...o })
const U1 = '1 · Producto y cadena de valor', U2 = '2 · Compras y formación de precios', U3 = '3 · Costes y transformación', U4 = '4 · Ventas', U5 = '5 · Logística y calidad'

export const LESSONS_CAFE: Lesson[] = [
  L({
    id: 'k-cadena', unit: U1, title: 'Del cafeto a la taza: productos y eslabones',
    body: `## La cadena

productor → beneficio (procesado en origen) → exportador → importador o trader → tostador → distribución (supermercado, horeca, tienda, online) → consumidor

No todos los eslabones existen siempre: un tostador grande puede comprar directamente en origen; uno pequeño compra al importador sacos sueltos ya nacionalizados.

## Los productos

| Producto | Tipo | Cómo se comercializa |
|---|---|---|
| **Café verde** | Materia prima | Sacos o granel, por contenedor, precio ligado al mercado |
| **Tostado en grano** | Semielaborado o terminado | A granel para horeca u otros envasadores; en paquete para el lineal |
| **Molido** | Terminado | Paquetes; pierde frescura más rápido que el grano |
| **Soluble** | Terminado (o semielaborado a granel) | Tarros, sobres, o a granel para industria |
| **Cápsulas** | Terminado | Por unidades; precio por kg muy superior |

## Por qué importa distinguirlos

- En el **verde**, el precio cambia cada día y casi todo el coste es la materia prima.
- En las **cápsulas**, el café puede ser una parte menor del coste: pesan el envase, la maquinaria y la marca.
- El **soluble** concentra mucho café verde por kilo de producto: la convención del sector es de unos 2,6 kg de verde por kg de soluble, frente a unos 1,19 kg por kg de tostado (factores de conversión usados por la Organización Internacional del Café; no verificados en línea en esta sesión).

> Cada vez que veas un precio de café, preguntá: ¿de qué producto, en qué punto de la cadena y en qué unidad?`,
  }),
  L({
    id: 'k-especies', unit: U1, title: 'Arábica y robusta, orígenes y cosechas',
    body: `## Dos especies, dos mercados

| | Arábica | Robusta (canephora) |
|---|---|---|
| Perfil en taza | Más acidez y aroma, menos amargor | Más cuerpo y amargor, más crema en espresso |
| Cafeína | Menor | Aproximadamente el doble |
| Cultivo | Altitud, más sensible a clima y plagas | Zonas bajas, más resistente y productiva |
| Precio | Normalmente superior | Normalmente inferior |
| Uso típico | Cafés de filtro, mezclas de gama alta | Mezclas de espresso, soluble |
| Referencia de mercado | Futuros en Nueva York, en **¢/lb** | Futuros en Londres, en **USD/t** |

! No son intercambiables comercialmente ni se cotizan igual. Nunca mezcles sus referencias ni sus unidades en un mismo cálculo sin convertir.

## Orígenes principales (orientativo)

- **Brasil:** mayor productor mundial; sobre todo arábica natural, y también robusta (conilon).
- **Vietnam:** mayor productor de robusta.
- **Colombia, Centroamérica, Perú:** arábicas lavados.
- **Etiopía, Kenia:** arábicas de perfil aromático.
- **Uganda, India, Indonesia:** robusta y arábica.

## Cosechas y estacionalidad

El café es un cultivo anual: cada origen tiene su época de cosecha (por ejemplo, Brasil a mitad de año; Vietnam y Centroamérica hacia final y principio de año; las fechas exactas varían por zona y campaña). Consecuencias comerciales:

- La disponibilidad y los diferenciales cambian a lo largo del año.
- «Cosecha nueva» y «cosecha vieja» no valen lo mismo: el verde envejece.
- Heladas o sequías en Brasil mueven el mercado mundial de arábica.

> Para planificar compras conviene tener un calendario de cosechas y embarques por origen. Pedíselo a compras o a tu importador: es información de trabajo, no de cultura general.`,
  }),
  L({
    id: 'k-calidad', unit: U1, title: 'Calidad, especificaciones, beneficio y certificaciones',
    body: `## Comercial y de especialidad

- **Café comercial:** se compra por descripción estándar (origen, tipo, número de defectos, tamaño de grano). Lo importante es la **consistencia** y el precio.
- **Café de especialidad:** lotes identificados, con puntuación en cata (habitualmente se habla de 80 puntos o más sobre 100 en la escala de la Specialty Coffee Association). Se paga con primas altas y poco ligadas a la bolsa.

## Qué dice una especificación de café verde

- Especie, origen y, a veces, región o finca
- Cosecha
- Proceso de beneficio
- Tamaño de grano (criba) y número de defectos
- Humedad
- Perfil de taza y ausencia de defectos de sabor
- Envase y peso del saco

## Procesos de beneficio y por qué importan al vender

| Proceso | Qué se hace | Efecto habitual |
|---|---|---|
| **Natural (seco)** | Se seca la cereza entera | Más cuerpo y dulzor |
| **Lavado (húmedo)** | Se despulpa, fermenta y lava | Taza más limpia y ácida |
| **Honey / semilavado** | Se despulpa y se seca con parte del mucílago | Intermedio |

No es un detalle técnico: el proceso cambia el perfil, el precio y la consistencia. Sustituir un lavado por un natural en una mezcla puede cambiar el producto que recibe el cliente.

## Trazabilidad y certificaciones: qué acreditan y qué no

Una certificación acredita que una cadena auditada **cumple una norma concreta** (prácticas agrícolas, condiciones sociales, precio mínimo, producción ecológica, según el sello). Para vender un producto como certificado, toda la cadena, incluido tu tostador, debe estar certificada y mantener la trazabilidad.

Lo que **no** acreditan por sí solas: la calidad en taza, que el lote esté libre de defectos, ni el cumplimiento de otras normas distintas de la suya.

! En la Unión Europea existe además normativa sobre productos libres de deforestación que afecta al café y exige información de trazabilidad hasta la parcela. Sus fechas de aplicación se han modificado varias veces: **no las he podido verificar en esta sesión**. Consultá el estado vigente en EUR-Lex o con tu responsable de calidad antes de afirmar nada a un cliente.`,
    quiz: [
      C({ id: 'k-calidad-q1', dim: 'interpretacion', q: 'Un cliente pregunta si tu café con sello ecológico «es de mejor calidad». ¿Qué respondés?', opts: [['El sello acredita el método de producción, no la calidad en taza: son dos cosas distintas, y le puedo dar la ficha de calidad aparte.', 'ok', 'Preciso y honesto. La calidad se demuestra con la especificación y las muestras.'], ['Sí, lo ecológico siempre es mejor.', 'no', 'No es lo que acredita la certificación.'], ['No tiene nada que ver, es solo marketing.', 'no', 'La certificación sí garantiza algo verificable: el cumplimiento de una norma auditada.']] }),
    ],
  }),
  L({
    id: 'k-oferta', unit: U2, title: 'Cómo leer una oferta de café verde', skills: ['cafe-clb', 'cafe-robusta'],
    body: `Una oferta de café verde suele caber en dos líneas. Cada palabra cuenta.

> _Ejemplo simulado:_ «Brasil arábica natural, NY 2/3, criba 17/18, buena taza, cosecha actual. 320 sacos de 60 kg. Embarque octubre. FOB Santos. Dic +12 ¢/lb, a fijar por el comprador. Pago contra documentos.»

| Elemento | Qué mirar |
|---|---|
| **Descripción** | Especie, origen, proceso, grado, criba, cosecha. ¿Coincide con tu especificación? |
| **Cantidad y envase** | Número de sacos y **peso del saco** (60 kg es habitual; en otros orígenes 69 o 70 kg; también big bags o granel) |
| **Embarque o entrega** | ¿Mes de embarque en origen o entrega en destino? Sumá el tránsito |
| **Incoterm y lugar** | FOB puerto de origen, CIF/CFR puerto de destino, o entregado en almacén |
| **Precio** | ¿Fijo o diferencial sobre una referencia? ¿Qué mes de referencia? ¿En qué unidad y moneda? |
| **Pago** | Contado contra documentos, plazo, anticipo |
| **Calidad** | ¿Sujeto a aprobación de muestra? |
| **Validez** | Las ofertas de café suelen valer horas o pocos días |

## Unidades de cotización

- **Arábica:** centavos de dólar por libra (¢/lb). 1 ¢/lb = 22,046 USD/t.
- **Robusta:** dólares por tonelada métrica (USD/t).
- Los importadores europeos suelen ofertar café ya nacionalizado en **€/kg** o **€/t**.

## Conversión a €/kg

Arábica: ¢/lb ÷ 100 ÷ 0,4536 ÷ (USD por €)

Robusta: USD/t ÷ 1.000 ÷ (USD por €)

> **Tipo de cambio:** si la cotización es «1 € = 1,08 USD», para pasar de dólares a euros se **divide** entre 1,08. Comprobación: el número en euros debe ser menor que en dólares.

Las especificaciones de los contratos de futuros (tamaño, meses, calidades entregables) las publica el mercado donde cotizan (ICE). Consultalas en su web: no las doy aquí como dato verificado.`,
  }),
  L({
    id: 'k-precio', unit: U2, title: 'Referencia, diferencial y precio físico', skills: ['cafe-dif'],
    body: `## La fórmula

**precio físico = referencia de mercado + diferencial**

- La **referencia** es el precio del contrato de futuros de un mes determinado. Se mueve continuamente y es igual para todos.
- El **diferencial** refleja lo específico de ese café: origen, calidad, disponibilidad, lugar y fecha de entrega, y el margen del vendedor. Puede ser positivo (prima) o negativo (descuento). Es lo que realmente negociás.

## Precio fijo o pendiente de fijación

- **Precio fijo (_outright_):** se pacta una cifra cerrada. Sabés tu coste desde hoy.
- **Precio a fijar:** se pacta hoy el diferencial y la referencia se toma más adelante, cuando una de las partes (según el contrato) decide fijar, antes de una fecha límite.

Con precio a fijar, **tu coste sigue abierto**. Si ya vendiste tostado a precio fijo, una subida del mercado te quita margen hasta el día que fijes.

## El tipo de cambio es un segundo precio

Comprás en dólares y vendés en euros. Aunque el café no se mueva, un euro más débil encarece tu compra. Son dos riesgos distintos y se gestionan por separado.

## Ejemplo (simulado)

Referencia 300 ¢/lb, diferencial +18 → 318 ¢/lb → × 22,046 = 7.011 USD/t → 7,011 USD/kg → ÷ 1,08 = 6,49 €/kg FOB.

- Si la referencia sube a 345: (345 + 18) → 7,41 €/kg. **+0,92 €/kg** sin que cambie nada de tu café.
- Si el euro baja a 1,02 con referencia 300: 7,011 ÷ 1,02 = 6,87 €/kg. **+0,38 €/kg**.`,
  }),
  L({
    id: 'k-cobertura', unit: U2, title: 'Futuros y coberturas: gestionar el riesgo, no adivinar el mercado',
    body: `Esta es una introducción conceptual. No vas a operar futuros, pero necesitás entender qué hace compras o finanzas y por qué te piden información.

## Qué es un futuro

Un contrato estandarizado para comprar o vender una cantidad de café en una fecha futura a un precio pactado hoy. Casi nunca termina en entrega física: se usa como **referencia de precio** y como **herramienta de cobertura**.

## Exposición

Tenés exposición cuando un movimiento del precio cambia tu resultado:

| Situación | Te perjudica |
|---|---|
| Vendiste a precio fijo y aún no compraste (o no fijaste) | Que el mercado **suba** |
| Compraste a precio fijo y aún no vendiste (stock) | Que el mercado **baje** |
| Compra fija y venta fija por el mismo volumen | Nada: el margen está cerrado |

## Cubrir

Cubrir es tomar una posición que compense esa exposición. Idea simplificada: si tenés stock comprado y temés una bajada, vendés futuros; si el mercado baja, lo que pierde el stock lo gana la posición en futuros, y al revés. El objetivo es que el margen dependa de tu actividad comercial y no del mercado.

Lo que la cobertura **no** hace: no elimina el riesgo del diferencial, ni el de calidad, ni el de que el cliente no retire el café. Y tiene costes y exigencias de caja (garantías) que gestiona finanzas.

## Cubrir frente a especular

- **Cubrir:** existe una exposición real del negocio y la reducís. Renunciás a ganar a cambio de no perder.
- **Especular:** tomás una posición sin exposición que compensar (o mayor que ella), esperando ganar con el movimiento.

La misma operación puede ser una u otra: fijar la compra de un contenedor ya vendido es cubrir; fijar tres «porque va a subir» es especular con dos.

> **Tu papel:** informar pronto. Cada precio fijo que comprometés con un cliente crea una exposición. Si compras y finanzas no lo saben, no pueden cubrirla.

! Contenido formativo general. La política de riesgos de cada empresa, los instrumentos y sus límites los define la dirección.`,
    quiz: [
      C({ id: 'k-cob-q1', dim: 'razonamiento', q: 'Tenés 3 contenedores de café verde comprados a precio fijo y todavía sin vender. El mercado cae un 10 %. ¿Qué pasa?', opts: [['Tu stock vale menos que lo que pagaste: los competidores que compren hoy podrán vender más barato.', 'ok', 'Es la exposición del que tiene stock a precio fijo sin venta cerrada.'], ['Nada: ya lo pagaste, el precio no te afecta.', 'no', 'El coste es histórico, pero el precio de venta que el mercado acepta baja con la referencia.'], ['Ganás, porque el café es más barato.', 'no', 'Ganaría quien tuviera ventas cerradas y compras pendientes.']] }),
      C({ id: 'k-cob-q2', dim: 'interpretacion', q: '¿Cuál de estas decisiones es una cobertura?', opts: [['Asegurar el tipo de cambio de los dólares que tendrás que pagar por una compra ya firmada, cuya venta está pactada en euros.', 'ok', 'Hay una exposición real (pago en USD, ingreso en EUR) y la operación la cierra.'], ['Comprar dólares porque creés que van a subir.', 'no', 'Sin una obligación en dólares detrás, es una apuesta.'], ['Retrasar una compra necesaria esperando que el precio baje.', 'no', 'Mantener abierta una exposición por una opinión sobre el mercado es especular.']] }),
    ],
  }),
  L({
    id: 'k-landed', unit: U3, title: 'Coste del café verde puesto en almacén',
    body: `Del precio FOB en origen al café disponible en tu almacén hay una lista de costes. No todos aplican siempre: dependen del Incoterm, la ruta y el país.

| Concepto | Quién informa | Unidad habitual |
|---|---|---|
| Precio del café (FOB) | Proveedor | ¢/lb o USD/t |
| Flete marítimo | Transitario | USD o € por contenedor |
| Seguro de transporte | Transitario o aseguradora | % del valor o importe fijo |
| Gastos de terminal en destino | Transitario | € por contenedor |
| Despacho de aduana, inspecciones | Agente de aduanas | € por expediente |
| Aranceles e impuestos | Agente de aduanas (TARIC) | % del valor; depende de producto y origen |
| Transporte al almacén y descarga | Logística | € por viaje |
| Almacenaje | Almacén | € por t y mes |
| Financiación del stock | Finanzas | % anual |

## Método

1. Pasá todo a la **misma moneda** y a **importes totales del embarque**.
2. Sumá.
3. Dividí entre los **kg netos realmente recibidos**.

Los costes por contenedor (flete, despacho) se reparten entre los kilos cargados: un contenedor con 19,2 t soporta menos coste por kilo que uno con 15 t.

## Ejemplo simulado

19.200 kg a 6,04 €/kg CIF = 115.968 € · gastos en destino 2.688 € → 118.656 € ÷ 19.200 kg = **6,18 €/kg**

> **Pérdida de peso en tránsito:** el café puede perder algo de humedad durante el viaje y el contrato suele fijar una franquicia de peso. Si recibís menos kilos de los facturados, el coste por kilo sube. Revisá el informe de pesaje.`,
  }),
  L({
    id: 'k-tueste', unit: U3, title: 'Merma de tueste y coste por kilo tostado', skills: ['cafe-merma', 'cafe-sacos'],
    body: `Al tostar, el café pierde peso: sobre todo agua, y algo de materia orgánica y cascarilla. Esa pérdida es la **merma de tueste**.

- Orientativamente se sitúa entre el 12 % y el 20 %: menor en tuestes claros, mayor en oscuros.
- Depende de la humedad inicial del verde y del perfil de tueste.
- El dato válido es el que mide **tu** producción para cada producto.

## Las dos fórmulas

**Kilos:** kg tostado = kg verde × (1 − merma)

**Coste:** €/kg tostado = €/kg verde ÷ (1 − merma)

## El error típico

Con merma del 16 % y verde a 6,18 €/kg:

- Correcto: 6,18 ÷ 0,84 = **7,36 €/kg**
- Incorrecto: 6,18 × 1,16 = 7,17 €/kg

¿Por qué? El 16 % se calcula sobre el peso **inicial** (verde). Visto desde el tostado, que es menor, la misma pérdida representa más: 16 ÷ 84 = 19 %. Es la misma trampa que margen y recargo.

## Planificar hacia atrás

Para entregar 10.000 kg de tostado:

kg verde = 10.000 ÷ 0,84 = 11.905 kg → ÷ 60 kg por saco = 198,4 → **199 sacos**

## La misma lógica en otros sectores

| Sector | «Merma» | Particularidad |
|---|---|---|
| Café | Tueste | Lo perdido se evapora: no tiene valor |
| Arroz | Molinado | Los subproductos se venden: restan coste |
| Salmón | Fileteado | Varía con el calibre; recortes con algo de valor |
| Atún | Cocción y limpieza | Rendimiento bajo; depende de especie y tamaño |
| Pasta | Secado y roturas | Muy pequeña; el recorte suele reprocesarse |`,
  }),
  L({
    id: 'k-canales', unit: U3, title: 'De la mezcla al precio por canal', skills: ['media-pond', 'precio-margen'],
    body: `## Escandallo de un café tostado (estructura)

1. **Mezcla verde** → media ponderada de los componentes, cada uno puesto en almacén.
2. **÷ (1 − merma)** → materia prima por kg tostado.
3. **+ tueste** (energía, mano de obra, amortización) por kg.
4. **+ molienda**, si es molido.
5. **+ envasado**: material (bolsa, válvula, cápsula, caja) y mano de obra, por unidad.
6. **+ distribución**: transporte al cliente, por kg, por palé o por entrega.
7. = **Coste total** por unidad de venta.
8. **÷ (1 − margen objetivo)** = precio.

! Los pasos 1 a 4 están en €/kg; el 5 y el 6 suelen estar en € por unidad o por palé. Convertí a la unidad de venta antes de sumar.

## Por qué el margen cambia según el canal

| Canal | Qué compra | Cómo se forma el precio | Costes propios |
|---|---|---|---|
| **Otros tostadores o industria** | Verde o tostado a granel | Muy ligado al mercado | Pocos; volumen alto, margen bajo |
| **Distribuidores** | Tostado envasado | Tarifa menos descuento | Su margen sale de tu precio |
| **Supermercados** | Paquetes y cápsulas, marca propia o del fabricante | Negociación anual, promociones | Rappels, logística exigente, penalizaciones |
| **Horeca** | Grano en kilo | Precio por kg alto | Máquinas en depósito, servicio técnico, reparto, riesgo de cobro |

Un precio por kilo alto en horeca no significa más beneficio: hay que restar la máquina, las visitas y los impagos. Compará canales por **contribución**, no por precio.

## Repercutir una subida de materia prima

Si el café verde es el 70 % del coste y sube un 15 %, tu coste sube 0,70 × 15 % = 10,5 %. Esa es la cifra que podés justificar al cliente, no el 15 %.`,
    quiz: [
      C({ id: 'k-canales-q1', dim: 'interpretacion', q: 'El café verde representa el 60 % de tu coste. Sube un 20 %. ¿Cuánto sube tu coste total, si lo demás no cambia?', opts: [['12 %', 'ok', '0,60 × 20 % = 12 %.'], ['20 %', 'no', 'Solo sube la parte del coste que es café verde.'], ['60 %', 'no', 'Ese es el peso del verde en el coste, no la subida.']] }),
    ],
  }),
  L({
    id: 'k-ventas', unit: U4, title: 'Vender café: propuesta, negociación y seguimiento',
    body: `## Comparar ofertas equivalentes (también desde el lado del cliente)

Tu cliente va a comparar tu oferta con otras. Asegurate de que compara lo mismo: mezcla y proporción, grano o molido, formato, vida útil, entrega, plazo de pago, servicio incluido. Si tu oferta incluye algo que las otras no (máquina, formación, entregas semanales), hacelo visible y ponele valor.

## Las cinco palancas de una negociación

Nunca negocies solo el precio. Hay cinco variables y cada una tiene un coste que podés calcular:

| Palanca | Qué pide el cliente | Qué calcular antes de responder |
|---|---|---|
| **Volumen** | Mejor precio por más kilos | ¿Compromiso firme o intención? ¿Qué ahorro real te genera? |
| **Calidad** | Otra mezcla, otro origen | Nuevo coste de mezcla; ¿cambia el producto? |
| **Entrega** | Más frecuencia, menos cantidad | Coste por entrega y por palé incompleto |
| **Pago** | Más días | Coste financiero y riesgo |
| **Revisión de precio** | Precio fijo más tiempo | Exposición a materia prima y divisa; ¿se puede cubrir? |

> Regla: **no concedas una condición cuyo impacto no conozcas.** «Lo calculo y te confirmo mañana» es una respuesta profesional.

Y si concedés, intercambiá: plazo por volumen, precio por duración de contrato, frecuencia por pedido mínimo.

## Estructura de una propuesta comercial

1. Qué entendiste que necesita el cliente.
2. Producto y especificación (mezcla, formato, certificaciones).
3. Precio, unidad e Incoterm o lugar de entrega.
4. Condiciones: volumen, entregas, pago.
5. Validez de la oferta y mecanismo de revisión del precio.
6. Próximo paso y fecha.

## Seguimiento de una cuenta

Cada mes, por cliente: kilos, venta neta, contribución, cumplimiento del volumen pactado, saldo vencido, incidencias. Con eso sabés si el acuerdo funciona antes de la renovación.`,
  }),
  L({
    id: 'k-logistica', unit: U5, title: 'Sacos, cargas, almacenamiento y frescura', skills: ['cobertura'],
    body: `## Presentaciones del café verde

- **Sacos** de yute o sisal: 60 kg es el más extendido; en algunos orígenes se usan 69 o 70 kg. A veces con bolsa interior de protección para cafés de calidad.
- **Big bags** de aproximadamente una tonelada.
- **Granel** en contenedor con funda interior.

Un contenedor de 20 pies carga orientativamente unas 19 t en sacos y algo más a granel. La cifra exacta depende del origen, el saco y la naviera: confirmala.

## Enemigos del café verde

- **Humedad:** el verde se comercializa habitualmente en torno al 10–12 % de humedad. Si absorbe más, hay riesgo de moho; si se seca demasiado, pierde calidad. La condensación dentro del contenedor es un riesgo conocido.
- **Olores:** el café absorbe olores con facilidad. No se almacena ni se transporta junto a productos olorosos o químicos, ni en contenedores con residuos de cargas anteriores.
- **Tiempo:** el verde aguanta meses, pero envejece: pierde aroma y la taza se apaga.
- **Plagas** y daños en los sacos.

## El café tostado: frescura y rotación

El tostado es mucho más delicado. Desprende gas tras el tueste (por eso los envases llevan válvula) y se oxida: el molido, más rápido que el grano. De ahí:

- **Primero en caducar, primero en salir.**
- Tostar según la demanda, no llenar el almacén de tostado.
- En horeca y especialidad, la fecha de tueste es un argumento de venta.

## Continuidad de suministro

Tránsito largo (semanas desde origen) + embarques que se retrasan = necesidad de **stock de seguridad** de verde o de una fuente alternativa (importador con café disponible en Europa).

Compará siempre: **cobertura en días** frente a **días hasta la próxima llegada disponible** (llegada del barco + descarga + control de calidad).

## Documentación, muestras y reclamaciones

- **Muestras:** de oferta, de preembarque y de llegada. La aprobación debe quedar por escrito.
- **Documentos habituales** (según origen y contrato): factura, lista de contenido, conocimiento de embarque, certificado de origen, certificado fitosanitario, certificados de peso y calidad, certificado ecológico u otros si aplica.
- **Reclamaciones:** tienen plazo y procedimiento definidos en el contrato. Hacen falta evidencias: muestras, fotos, informe de pesaje, lote. Avisá en cuanto se detecte el problema; no cuando ya se ha tostado el café.`,
  }),
]
