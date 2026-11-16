import type { Lesson } from '../lib/types.ts'
import { C, N } from './h.ts'

const S = (o: Omit<Lesson, 'track' | 'unit'>): Lesson => ({ track: 'sectores', unit: 'Particularidades por sector', ...o })
const G = (o: Omit<Lesson, 'track' | 'sector'> & { sector?: Lesson['sector'] }): Lesson => ({ track: 'logistica', sector: 'comun', ...o })
const M = (o: Omit<Lesson, 'track' | 'sector' | 'unit'>): Lesson => ({ track: 'comercial', sector: 'comun', unit: 'Gestión comercial y compras', ...o })

export const LESSONS_SECTORES: Lesson[] = [
  S({
    id: 's-arroz', title: 'Arroz: variedades, molinado, granel y envasado', sector: 'arroz', skills: ['arroz-rend', 'coste-entregado'],
    body: `## Producto

- **Tipos de grano:** largo (índica), medio y redondo (japónica), aromáticos (basmati, jazmín), vaporizado (_parboiled_), integral.
- **Orígenes:** Asia concentra la producción y la exportación; en Europa se cultiva sobre todo en Italia y España. El origen condiciona variedad, precio, tránsito y régimen arancelario.
- **Calidad comercial:** porcentaje de granos partidos, humedad, granos yesosos o dañados, pureza varietal, residuos.

## Transformación

arroz cáscara → (descascarillado) → arroz cargo o integral → (blanqueado y pulido) → arroz blanco → (clasificación) → enteros y partidos

De una tonelada de cáscara sale bastante menos de una tonelada de blanco entero: el resto es cascarilla, salvado y partidos. A diferencia del café, **los subproductos tienen valor** y se restan del coste.

## Cómo se vende

| | Granel (semielaborado) | Envasado (terminado) |
|---|---|---|
| Unidad | Toneladas, big bags, contenedores | Paquetes de 500 g, 1 kg, 5 kg; cajas y palés |
| Precio | Cercano al mercado; se negocia por lote o campaña | Tarifa, marca propia, promociones |
| Cliente | Industria, envasadores | Distribución, horeca, organismos públicos |
| Riesgo principal | Precio y calidad del lote | Servicio, margen, licitaciones a precio fijo |

## Particularidades

- **Mezclas:** se ajusta el porcentaje de partidos para cumplir una especificación al menor coste (media ponderada).
- **Stock:** una cosecha al año en cada origen: hay que cubrir muchos meses. Vigilar plagas y humedad.
- **Licitaciones:** frecuentes en ayuda alimentaria y restauración colectiva; precio fijo, plazos de pago largos.
- **Transporte:** producto denso: el camión se llena por **peso**.
- **Aranceles:** en la UE varían según el grado de elaboración y el origen. Verificá siempre en TARIC.`,
  }),
  S({
    id: 's-pasta', title: 'Pasta: sémola, formatos, marca y volumen', sector: 'pasta', skills: ['pasta-volumen', 'neto'],
    body: `## Materias primas

La pasta seca se elabora con **sémola de trigo duro** y agua (en algunos países la norma lo exige así; hay también pasta al huevo, integral, sin gluten, de legumbres). La sémola es ya un **semielaborado**: el trigo duro es la materia prima, y su precio y calidad (proteína, color) marcan el coste.

## Rendimientos y costes industriales

- Del trigo a la sémola hay una pérdida importante en la molienda (el resto son subproductos con valor).
- De la sémola a la pasta el rendimiento es cercano a 1:1: se añade agua y se elimina en el secado.
- Los costes que diferencian a un fabricante son industriales: **energía del secado**, velocidad de línea, **cambios de formato** (cada cambio de molde para la línea), tipo de molde (bronce o teflón) y tiempos de secado.

## Formatos: no todos cuestan ni viajan igual

- **Pasta larga** (spaghetti): densa, palés pesados. El camión se llena por **peso**.
- **Pasta corta** (fusilli, penne, farfalle): voluminosa. El camión se llena por **espacio** con muchos menos kilos.

Consecuencia: el coste de transporte **por kilo** de unos fusilli puede ser el doble que el de unos spaghetti en el mismo camión. Un precio «por kilo, igual para toda la gama» esconde márgenes distintos.

## Marca propia y marca del fabricante

| | Marca del fabricante | Marca propia (de la distribución) |
|---|---|---|
| Precio | Tarifa menos descuentos | Coste más margen, muy ajustado |
| Costes comerciales | Publicidad, promociones, rappels | Pocos |
| Volumen | Variable | Alto y estable mientras dura el contrato |
| Riesgo | Rotación en el lineal | Dependencia de un cliente; licitación periódica |
| Envase | Propio | Diseño del cliente: stock de envases que no sirve para otro |

## Promociones, capacidad y planificación

Una promoción multiplica el volumen durante pocas semanas. Preguntas obligadas: ¿la contribución total sube o baja?, ¿hay capacidad de línea?, ¿hay envases?, ¿hay que producir antes y almacenar? La pasta es poco perecedera, lo que permite fabricar con antelación, pero ocupa mucho espacio.`,
  }),
  S({
    id: 's-atun', title: 'Atún: especies, conservas y peso escurrido', sector: 'atun', skills: ['atun-escurrido', 'contribucion'],
    body: `## Especies comerciales

No todo el «atún» es igual, y la denominación de venta está regulada.

- **Listado** (_skipjack_): el más abundante y económico; base de la conserva estándar.
- **Rabil o atún claro** (_yellowfin_): carne más clara, mayor valor.
- **Atún blanco o bonito del norte** (_albacore_): gama alta.
- **Patudo** (_bigeye_) y otras.

## Presentaciones a lo largo de la cadena

| Tipo | Producto | Notas |
|---|---|---|
| Materia prima | Atún entero congelado | Se comercializa en dólares por tonelada, por especie y tamaño |
| Semielaborado | Lomos cocidos congelados | Listos para enlatar; ahorran mano de obra a la conservera |
| Terminado | Conservas en lata, tarro o bolsa | Tronco o bloque, trozos, migas; al natural, en aceite de oliva, de girasol, en escabeche |

## Peso neto y peso escurrido

- **Peso neto:** pescado + líquido de cobertura.
- **Peso escurrido:** solo el pescado, tras escurrir.

Dos latas de 160 g netos pueden llevar 112 g o 104 g de atún. **La comparación correcta de precios es por kg escurrido**, y a igualdad de especie, presentación y cobertura. El líquido también cuesta: el aceite de oliva, mucho más que el girasol o el agua.

## Rendimientos

Del atún entero a la carne limpia enlatable se pierde más de la mitad del peso (cabeza, espinas, piel, sangacho, agua de cocción). El rendimiento depende de la especie y del tamaño del pescado, y es el dato industrial clave de una conservera.

## Envases y formatos

Latas pequeñas para el consumidor (packs de 3 o 6), formatos grandes para hostelería, tarros de vidrio en gama alta, bolsas. El envase es una parte relevante del coste: el precio del acero o del aluminio también mueve el coste de una conserva.

## Trazabilidad y reclamaciones

Los clientes piden especie, zona de captura, arte de pesca, lote y, a menudo, certificaciones de pesca sostenible. Las reclamaciones típicas (peso escurrido, textura, color, cuerpos extraños, histamina) se gestionan por **lote**: sin número de lote no hay investigación posible.`,
  }),
  S({
    id: 's-salmon', title: 'Salmón: fresco, calibres, rendimiento y urgencia', sector: 'salmon', skills: ['salmon-rend', 'pct-var'],
    body: `## Producto

El salmón que se comercializa en Europa es mayoritariamente de acuicultura (Noruega, Escocia, Islas Feroe, Chile).

- **Entero eviscerado**, fresco en cajas con hielo, clasificado por **calibre** (peso por pieza: 2–3 kg, 3–4, 4–5, 5–6, 6+…). El precio por kilo cambia según el calibre.
- **Filetes** con distintos grados de recorte (con o sin piel, con o sin espinas, con o sin ventresca).
- **Porciones**, lomos, tacos, ahumado.
- **Fresco o congelado.**

## Rendimientos y mermas

Del entero al filete se pierde cabeza, espina, vísceras restantes y recortes. El rendimiento depende del **calibre** (los peces grandes rinden más), del **grado de recorte** que pida el cliente y del fileteado (manual o mecánico). Cada punto de rendimiento es dinero.

€/kg filete = €/kg entero ÷ rendimiento (y después se suman mano de obra y envase)

## Fresco frente a congelado

| | Fresco | Congelado |
|---|---|---|
| Vida útil | Días | Meses |
| Logística | Urgente, refrigerada (en torno a 0–4 °C), a veces aérea | Planificable, a −18 °C, marítima |
| Precio | Cambia cada semana | Más estable |
| Riesgo principal | Producto no vendido, rotura de frío | Coste de almacenaje, stock inmovilizado |

## Variaciones de precio

El precio en origen varía semana a semana según oferta, demanda y época del año (suele tensarse antes de Navidad y de otras fechas de alto consumo). El precio de referencia se publica en la moneda del país productor: hay también riesgo de divisa.

## Previsión de demanda y producto no vendido

En fresco, lo que no se vende a tiempo se liquida, se congela (pierde valor) o se tira. Por eso:

- Coste de **sobrar** = coste − valor de liquidación.
- Coste de **faltar** = margen perdido (+ daño comercial).

Cuando sobrar cuesta más que faltar, se compra algo por debajo de la previsión; cuando fallar al cliente es inaceptable, por encima, sabiendo lo que cuesta.

## Cadena de frío

El registro de temperatura acompaña al producto. Un retraso de 24 horas no es «un día tarde»: es un porcentaje de la vida comercial. En la recepción: temperatura, aspecto, fecha, y cualquier reserva **anotada antes de firmar**.`,
  }),
  S({
    id: 's-formula', title: 'Una misma fórmula, cinco productos distintos', sector: 'comun', skills: ['cafe-merma', 'salmon-rend', 'arroz-rend', 'atun-escurrido'],
    body: `La fórmula del rendimiento es siempre la misma:

**coste por kg útil = coste por kg comprado ÷ rendimiento**

Pero el dato que hay que poner, de dónde sale y qué supuestos esconde cambian con el producto.

| | Rendimiento orientativo | ¿De qué depende? | ¿Lo perdido vale algo? | ¿Quién da el dato? |
|---|---|---|---|---|
| **Café** (verde → tostado) | Alto (se pierde del orden de un sexto) | Grado de tueste, humedad | No: se evapora | Producción |
| **Arroz** (cáscara → blanco entero) | Medio | Variedad, calidad del cáscara | Sí: partidos, salvado, cascarilla | Molino |
| **Salmón** (entero → filete) | Medio | Calibre, recorte, fileteado | Algo: recortes, cabezas | Sala de elaborado |
| **Atún** (entero → carne limpia) | Bajo | Especie, tamaño | Algo: harinas, aceites | Conservera |
| **Pasta** (sémola → pasta) | Casi total | Roturas, arranques de línea | Sí: se reprocesa | Fábrica |

## Lo mismo pasa con otras fórmulas

- **Stock de seguridad:** en café verde cubre retrasos de barcos (semanas); en salmón fresco casi no existe (caduca); en pasta cubre promociones.
- **Coste de transporte por kg:** el arroz y los spaghetti llenan el camión por peso; los fusilli por espacio; el salmón fresco viaja con hielo y en frío, y parte de lo que pagás es hielo y caja.
- **Precio por kilo:** en atún hay que decir «escurrido»; en salmón, «entero» o «filete» y qué recorte; en café, «verde» o «tostado».
- **Coste de comprar de más:** financiación y espacio en café y arroz; el producto entero en salmón fresco.

> Antes de aplicar una fórmula, tres preguntas: **¿kilo de qué?, ¿rendimiento medido por quién?, ¿qué pasa con lo que sobra?**`,
    quiz: [
      N({ id: 's-formula-q1', dim: 'supuestos', unit: '€/kg', a: (420 - 60) / 560, q: 'Arroz cáscara a **420 €/t**. De cada tonelada salen **560 kg de blanco entero**, y los subproductos se venden por **60 €** (simulado). ¿Coste de materia prima por kg de blanco entero?', hints: ['Restá primero el valor de los subproductos.', 'Operación: (420 − 60) ÷ 560'], sol: ['Coste neto: 420 − 60 = 360 €', '360 ÷ 560 kg = **0,643 €/kg**'], keys: '(420 − 60) ÷ 560 =', traps: [{ v: 420 / 560, kind: 'supuesto', msg: 'Aplicaste la fórmula «como en el café», donde lo perdido no vale nada. En arroz los subproductos se venden y reducen el coste.' }], means: 'Misma fórmula de rendimiento, con un supuesto más: el valor de lo que no es producto principal.' }),
      C({ id: 's-formula-q2', dim: 'supuestos', q: 'Vas a calcular un stock de seguridad de **salmón fresco** con la misma fórmula que usás para **café verde** («10 días de consumo»). ¿Cuál es el problema?', opts: [['El salmón fresco tiene una vida útil de días: un stock de seguridad así caducaría. La seguridad se consigue con reposición frecuente y proveedores alternativos, no con stock.', 'ok', 'El supuesto de la fórmula (el producto aguanta almacenado) no se cumple.'], ['Ninguno: la fórmula es universal.', 'no', 'La fórmula sí; sus supuestos, no.'], ['Que el salmón es más caro.', 'no', 'El precio influye en el coste de inmovilizar, pero el problema aquí es la caducidad.']] }),
    ],
  }),
]

export const LESSONS_LOG: Lesson[] = [
  G({
    id: 'g-stock', unit: 'Stock y aprovisionamiento', title: 'Stock, cobertura, punto de pedido y stock de seguridad', skills: ['cobertura', 'punto-pedido'],
    body: `## Cuatro conceptos

- **Consumo (o demanda):** lo que sale por día o por semana.
- **Cobertura:** stock ÷ consumo. Para cuánto tiempo alcanza lo que tenés.
- **Plazo de aprovisionamiento:** tiempo desde que decidís pedir hasta que el producto está **disponible para usar** (pedido + producción del proveedor + tránsito + aduana + descarga + control de calidad).
- **Stock de seguridad:** colchón para cuando la realidad no coincide con el plan.

## Punto de pedido

punto de pedido = consumo diario × plazo de aprovisionamiento + stock de seguridad

Cuando el stock (más lo que ya está en camino) baja a ese nivel, hay que pedir.

## Los supuestos que esconde la fórmula

1. **Consumo estable.** Si hay estacionalidad o promociones, hay que usar el consumo previsto para ese periodo, no la media anual.
2. **Plazo fiable.** Si los embarques se retrasan con frecuencia, el plazo «de catálogo» es optimista.
3. **Se puede pedir cualquier cantidad en cualquier momento.** A menudo no: contenedores completos, pedidos mínimos, cosechas.
4. **El producto aguanta almacenado.** En fresco no es así.

## ¿Cuánto stock de seguridad?

No hay un número correcto universal: es una decisión que equilibra el **coste de tener** (caja inmovilizada, espacio, envejecimiento) con el **coste de no tener** (ventas perdidas, penalizaciones, urgencias). Una forma razonable de empezar: mirar los retrasos y picos de consumo reales del último año y decidir cuántos de ellos querés poder absorber.

! **Unidades de tiempo:** no mezcles días de producción (5 por semana) con días naturales (7). Los barcos y la caducidad cuentan días naturales.

## Costes de almacenar

Espacio (€ por palé y mes), manipulación (entradas y salidas), seguro, financiación del valor inmovilizado y **mermas** (caducidad, roturas, envejecimiento). Para una primera estimación, sumá el coste financiero y el del espacio.`,
  }),
  G({
    id: 'g-cargas', unit: 'Cargas y transporte', title: 'Cajas, palés, camiones y contenedores: peso frente a volumen', skills: ['conv-cajas', 'pasta-volumen'],
    body: `## Medidas habituales (orientativas; confirmá siempre con el transportista)

| Unidad | Referencia típica |
|---|---|
| **Europalé** | 80 × 120 cm |
| **Palé industrial o americano** | 100 × 120 cm |
| **Camión articulado (tráiler)** | 33 europalés en el suelo; del orden de 24 t de carga |
| **Contenedor de 20 pies** | Unos 33 m³; 11 europalés en el suelo; adecuado para carga densa |
| **Contenedor de 40 pies** | Unos 67 m³; 23–25 europalés; adecuado para carga voluminosa |
| **Contenedor frigorífico (_reefer_)** | Algo menos de espacio útil; requiere conexión eléctrica |

Los límites de peso reales dependen del vehículo, del país y de la ruta.

## Dos límites, y manda el primero que se alcanza

- **Límite de peso:** kg máximos ÷ kg por palé.
- **Límite de espacio:** huecos de palé (y altura, si se apilan).

Producto **denso** (arroz, spaghetti, conservas): se agota el peso y sobra espacio. Producto **voluminoso** (pasta corta, cápsulas): se agota el espacio y sobra peso.

## Por qué importa comercialmente

El transporte se paga por camión, por contenedor o por palé, no por kilo. El coste por kilo o por unidad resulta de dividir entre lo que realmente cabe. Por eso:

- Cambiar el tamaño de la caja puede cambiar las unidades por palé, y con ello el coste.
- Un pedido que no completa palé o camión paga «aire».
- Los pedidos mínimos y los múltiplos de palé existen para que la logística no se coma el margen.

## Modos de transporte

| Modo | Para qué | Tener en cuenta |
|---|---|---|
| **Carretera** | Europa, entregas a clientes | Carga completa o grupaje (por palé) |
| **Marítimo** | Importación y exportación de volumen | Semanas de tránsito, retrasos, gastos portuarios |
| **Refrigerado o congelado** | Salmón, productos frescos | Más caro; registro de temperatura |
| **Aéreo** | Fresco de alto valor a larga distancia, urgencias | Muy caro por kilo |

## Otros costes que aparecen

Manipulación (carga, descarga, picking por caja), almacenaje, **demoras** (cuando un contenedor o un camión esperan más de lo pactado), ocupaciones en terminal y mermas por daños. Las demoras portuarias pueden convertir un retraso documental en una factura importante.`,
  }),
  G({
    id: 'g-incoterms', unit: 'Comercio internacional', title: 'Incoterms: EXW, FCA, FOB, CFR y CIF',
    body: `Los Incoterms® son reglas de la Cámara de Comercio Internacional (versión vigente: **Incoterms® 2020**, en vigor desde el 1 de enero de 2020) que reparten entre vendedor y comprador tres cosas distintas:

1. **Costes:** quién paga cada tramo.
2. **Obligaciones:** quién contrata el transporte, quién despacha en aduana.
3. **Riesgo:** en qué punto pasa del vendedor al comprador la responsabilidad por pérdida o daño.

! Lo que sigue es un **resumen didáctico**. Lo que obliga es el contrato y el texto oficial de la regla pactada, con su lugar exacto («FOB Santos», «FCA almacén X»). Los Incoterms no regulan la transmisión de la propiedad, el pago ni las consecuencias del incumplimiento.

## Empezando por las dos primeras

**EXW (en fábrica).** El vendedor pone la mercancía a disposición en sus instalaciones. No carga el camión ni despacha la exportación. El riesgo pasa ahí. Mínima obligación para el vendedor; poco práctico en comercio internacional si el comprador no puede gestionar la exportación.

**FCA (franco transportista).** El vendedor entrega al transportista designado por el comprador, en el lugar acordado, **con la exportación despachada**. Si la entrega es en las instalaciones del vendedor, este carga. Sirve para cualquier modo de transporte.

## Las reglas marítimas

**FOB (franco a bordo).** El vendedor entrega la mercancía **a bordo del buque** en el puerto de embarque y despacha la exportación. A partir de ahí, costes y riesgo son del comprador, que contrata el flete.

**CFR (coste y flete).** Como FOB, pero el vendedor **contrata y paga el flete** hasta el puerto de destino. El riesgo, sin embargo, pasa al comprador **a bordo en origen**.

**CIF (coste, seguro y flete).** Como CFR, y además el vendedor contrata un **seguro** a favor del comprador (con una cobertura mínima, salvo que se pacte otra).

## Resumen

| | EXW | FCA | FOB | CFR | CIF |
|---|---|---|---|---|---|
| Carga en origen | Comprador | Vendedor (si es en sus instalaciones) | Vendedor | Vendedor | Vendedor |
| Despacho de exportación | Comprador | Vendedor | Vendedor | Vendedor | Vendedor |
| Transporte hasta puerto y carga a bordo | Comprador | Comprador | Vendedor | Vendedor | Vendedor |
| Flete marítimo | Comprador | Comprador | Comprador | **Vendedor** | **Vendedor** |
| Seguro | — | — | — | — | **Vendedor** |
| El riesgo pasa… | En fábrica | Al entregar al transportista | A bordo, en origen | A bordo, en origen | A bordo, en origen |
| Despacho de importación | Comprador | Comprador | Comprador | Comprador | Comprador |

## Lo que más se confunde

- En **CFR y CIF**, el vendedor paga hasta destino pero el riesgo es del comprador desde el embarque. Coste y riesgo no viajan juntos.
- FOB, CFR y CIF son para transporte **marítimo**. Para contenedores, la propia Cámara de Comercio Internacional recomienda sus equivalentes multimodales (FCA, CPT, CIP), aunque en la práctica FOB se sigue usando mucho.
- Para comparar ofertas con Incoterms distintos, llevá todas al mismo punto sumando los tramos que faltan.

_Fuente: Cámara de Comercio Internacional, Incoterms® 2020. Resumen redactado de memoria, no contrastado en línea en esta sesión; comprobá el texto oficial ante cualquier duda contractual._`,
    quiz: [
      C({ id: 'g-inco-q1', dim: 'interpretacion', q: 'Comprás café **FOB Santos**. El contenedor sufre daños por agua durante la travesía. ¿De quién es el riesgo?', opts: [['Del comprador: en FOB el riesgo pasa cuando la mercancía está a bordo en el puerto de embarque.', 'ok', 'Por eso, comprando FOB, el seguro de transporte lo contratás vos.'], ['Del vendedor, hasta que llegue a destino.', 'no', 'Eso correspondería a otras reglas (las del grupo D).'], ['De la naviera en todos los casos.', 'no', 'La responsabilidad del transportista es otra cuestión, con sus propios límites; el reparto entre vendedor y comprador lo marca el Incoterm.']] }),
      C({ id: 'g-inco-q2', dim: 'razonamiento', q: 'Tenés una oferta FOB y otra CIF del mismo café. Para compararlas…', opts: [['Sumo a la FOB el flete y el seguro que me cotice mi transitario, y comparo las dos en base CIF.', 'ok', 'Mismo punto de entrega: ya son comparables (falta aún mirar pago y calidad).'], ['Elijo la CIF: incluye más cosas.', 'no', 'Incluye más, pero también cuesta más: hay que cuantificar.'], ['Elijo la FOB: es más barata.', 'no', 'Es más barata porque le faltan tramos.']] }),
    ],
  }),
  G({
    id: 'g-docs', unit: 'Comercio internacional', title: 'Documentación y coordinación entre departamentos',
    body: `## Documentos habituales

Los exigibles en cada operación dependen del producto, del origen, del destino y del contrato. Los más frecuentes:

| Documento | Para qué sirve |
|---|---|
| **Contrato o confirmación de pedido** | Fija producto, precio, Incoterm, plazos y calidad |
| **Factura comercial** | Base del pago y de la valoración en aduana |
| **Lista de contenido (_packing list_)** | Bultos, pesos netos y brutos, lotes |
| **Conocimiento de embarque (B/L)** | Contrato de transporte marítimo y título para retirar la mercancía |
| **CMR** | Carta de porte en transporte internacional por carretera |
| **Certificado de origen** | Origen de la mercancía; puede dar acceso a aranceles preferenciales |
| **Certificado sanitario o fitosanitario** | Exigido para muchos alimentos |
| **Certificados de calidad, peso, análisis** | Según contrato |
| **Certificados específicos** | Ecológico, captura (pesca), etc. |
| **Declaración aduanera** | Exportación en origen, importación en destino |

Un error en un documento (un peso que no coincide, un nombre mal escrito) puede bloquear el despacho y generar demoras que se pagan por día.

## Quién sabe qué

| Necesitás saber… | Preguntá a… |
|---|---|
| Flete, tránsito, gastos portuarios, ETA | Logística o el transitario |
| Aranceles, requisitos de importación | Agente de aduanas |
| Merma, rendimiento, capacidad, plazos de fabricación | Producción y planificación |
| Especificaciones, certificaciones, reclamaciones | Calidad |
| Tipo de cambio, coste financiero, límite de crédito, coberturas | Finanzas |
| Precio y disponibilidad de materia prima | Compras |
| Qué quiere exactamente el cliente | Ventas, o el propio cliente |

## Seguimiento de una entrega

Hitos que conviene controlar: confirmación del pedido → producción o disponibilidad → reserva de transporte → carga → documentos → tránsito → llegada → despacho → entrega → conformidad. En cada hito: fecha prevista, fecha real y responsable.

> Como asistente de dirección tu ventaja es ver toda la cadena. Un resumen de una línea por operación («dónde está, qué falta, quién lo tiene») evita la mayoría de las sorpresas.`,
  }),
]

export const LESSONS_COM: Lesson[] = [
  M({
    id: 'm-ofertas', title: 'Preparar una oferta y responder una licitación',
    body: `## Antes de dar un precio: la lista de comprobación

- **Producto:** ¿especificación completa? (calidad, formato, peso, envase, etiquetado, certificaciones)
- **Cantidad:** ¿total y por entrega? ¿firme o estimada?
- **Entrega:** ¿dónde, con qué Incoterm, con qué frecuencia, desde cuándo?
- **Pago:** ¿plazo y medio? ¿hay límite de crédito?
- **Duración:** ¿hasta cuándo vale el precio? ¿hay revisión?
- **Costes:** ¿tengo materia prima con precio actual, merma, transformación, envase, transporte y financiación?
- **Capacidad:** ¿producción puede hacerlo en esas fechas?

Si falta algo, **decilo y pedilo**. Una oferta con un supuesto declarado («precio válido para entregas por camión completo») es profesional; una oferta con un supuesto oculto es un problema futuro.

## Estructura del cálculo

coste entregado → + coste financiero → ÷ (1 − margen) → precio → comprobar contra mercado y contra el mínimo aceptable

Tené siempre dos cifras: **precio objetivo** y **precio mínimo** (por debajo del cual no interesa).

## Licitaciones

1. Leé el pliego entero: criterios de adjudicación (¿solo precio?), especificaciones, lugares de entrega, penalizaciones, garantías, plazo de pago, revisión de precios.
2. Anotá lo que el pliego fija y lo que deja abierto. Usá el periodo de consultas.
3. Calculá con el escenario de costes de **todo el periodo**, no con el de hoy.
4. Asegurá la materia prima (precio cerrado condicionado a adjudicación) o valorá el riesgo.
5. Revisá la documentación administrativa con tiempo: muchas ofertas se excluyen por un papel.

! Las reglas de la contratación pública dependen de cada país y de cada pliego. No des por universal una condición que viste en otra licitación.`,
  }),
  M({
    id: 'm-proveedores', title: 'Comparar proveedores sobre una base equivalente',
    body: `Comparar es **igualar primero y restar después**. Orden recomendado:

| Paso | Pregunta | Ajuste |
|---|---|---|
| 1. Producto | ¿Es la misma calidad y especificación? | Si no, no son comparables: pedí oferta sobre la misma especificación o valorá la diferencia |
| 2. Peso y formato | ¿Mismo contenido útil? (escurrido, neto, unidades por caja) | Pasá a precio por unidad útil |
| 3. Unidad y moneda | ¿¢/lb, USD/t, €/kg? | Convertí a una sola |
| 4. Punto de entrega | ¿EXW, FOB, CIF, entregado? | Sumá los tramos que faltan |
| 5. Pago | ¿Contado, 30, 60, 90 días? | Valorá el plazo al coste financiero |
| 6. Entrega | ¿Plazo, lote mínimo, fiabilidad? | Coste del stock adicional o del riesgo |

Al final, una tabla con una fila por proveedor y una columna por paso. La última columna es el **coste equivalente**.

## Lo que no entra en la tabla

Fiabilidad, capacidad de respuesta, concentración del riesgo en un solo proveedor, sostenibilidad. No se suman en euros, pero se mencionan en la recomendación.

## Señales de que falta algo

- Un precio mucho más bajo que el resto: casi siempre hay una diferencia de calidad, peso, Incoterm o validez.
- Ofertas sin fecha de validez.
- Descripciones genéricas («atún en aceite», «arábica Brasil») sin especificación.`,
    quiz: [
      C({ id: 'm-prov-q1', dim: 'supuestos', multi: true, q: 'Recibís: «Proveedor X: arroz largo, 0,82 €/kg» y «Proveedor Y: arroz largo, 790 €/t». ¿Qué necesitás preguntar antes de comparar?', opts: [['Porcentaje de partidos y resto de la especificación.', 'ok', 'Puede ser la mayor diferencia de valor.'], ['Punto de entrega e Incoterm de cada una.', 'ok', 'Uno puede ser entregado y el otro en origen.'], ['Granel o envasado, y en qué formato.', 'ok', 'Un precio por kg envasado y otro por tonelada a granel no son el mismo producto.'], ['Plazo de pago y validez.', 'ok', 'Forman parte del precio real.'], ['Antigüedad de la empresa proveedora.', 'no', 'Puede interesar, pero no para igualar las ofertas.']] }),
    ],
  }),
  M({
    id: 'm-negociar', title: 'Negociar y evaluar peticiones de clientes importantes',
    body: `## Antes de negociar

- Tu **precio mínimo** y lo que cuesta cada concesión posible (un día de plazo, un punto de descuento, una entrega adicional).
- Qué querés pedir a cambio.
- Qué alternativa tenés si no hay acuerdo, y cuál tiene el cliente.

## Tabla de concesiones (ejemplo simulado: cliente de 500.000 € al año)

| Concesión | Coste anual aproximado |
|---|---|
| 1 % de descuento | 5.000 € |
| +30 días de plazo (al 6 %) | 2.500 € |
| Rappel del 2 % al superar el objetivo | 10.000 € |
| Entrega semanal en vez de quincenal (26 entregas más a 60 €) | 1.560 € |

Con la tabla delante, «30 días más» deja de ser un favor y pasa a ser medio punto de descuento.

## Cuando un cliente importante pide algo

1. **Entender** qué pide exactamente y por qué (el motivo a veces permite otra solución más barata).
2. **Cuantificar** el impacto en contribución, caja y operaciones.
3. **Comprobar** viabilidad con producción y logística.
4. **Valorar** al cliente: contribución actual, potencial, riesgo de perderlo, precedente para otros.
5. **Proponer**: sí, sí con condiciones, o alternativa. Rara vez un no a secas.

## Errores frecuentes

- Conceder en la reunión para evitar la incomodidad.
- Negociar solo precio.
- Dar algo sin pedir nada.
- Olvidar que lo concedido una vez se convierte en el punto de partida de la próxima negociación.

> «Entiendo lo que necesitás. Déjame calcular el impacto y te respondo mañana con una propuesta» es una frase que gana negociaciones.`,
  }),
  M({
    id: 'm-ceo', title: 'Presentar una recomendación breve al CEO',
    body: `Dirección tiene poco tiempo y decide sobre muchas cosas. Una buena recomendación le ahorra trabajo: llega con la respuesta, no con el problema.

## Estructura en cinco líneas

1. **Recomendación:** qué proponés hacer. En la primera línea.
2. **Por qué:** el argumento principal y la cifra clave.
3. **Alternativas:** qué otras opciones hay y por qué no las elegís.
4. **Supuestos y riesgos:** de qué depende tu recomendación; qué datos son estimados o están pendientes.
5. **Qué necesitás:** una decisión, una aprobación, un plazo.

## Buenas prácticas

- **Números redondos** y con unidad: «unos 7.600 €», no «7.651,84».
- Una sola cifra clave por frase.
- Separá **hechos**, **cálculos** y **supuestos**.
- Si hay varias decisiones razonables, decilo, y explicá de qué depende elegir una u otra.
- El detalle del cálculo, en un anexo o en la hoja, disponible si lo piden.

## Ejemplo (simulado)

> **Propongo aceptar el pedido de 40.000 paquetes a 2,52 €, con pago a 60 días.** Deja un margen del 18 % (unos 18.000 €). La alternativa de 90 días que pide el cliente costaría unos 500 € más de financiación: aceptable si a cambio se compromete a un segundo pedido. Supuestos: cambio a 1,08 y merma del 16 %; el café aún no está comprado, por lo que el margen está expuesto hasta que compras fije precio. Necesito tu visto bueno hoy: la oferta del proveedor vence mañana.

## Antes de enviar

¿Puede decidir con solo leer esto? ¿Están claras las unidades? ¿He dicho qué no sé?`,
  }),
]
