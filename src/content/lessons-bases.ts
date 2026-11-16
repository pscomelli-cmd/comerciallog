import type { Lesson } from '../lib/types.ts'
import { C } from './h.ts'

const L = (o: Omit<Lesson, 'track'>): Lesson => ({ track: 'bases', ...o })

export const LESSONS_BASES: Lesson[] = [
  L({
    id: 'b-tipos', unit: '0 · Antes de empezar', title: 'Materia prima, semielaborado y producto terminado', sector: 'comun',
    body: `Los cinco sectores de esta plataforma no funcionan igual, y dentro de cada uno tampoco es lo mismo vender un saco que un paquete. Esta distinción va a aparecer en todos los casos.

| | Materia prima | Semielaborado | Producto terminado |
|---|---|---|---|
| **Café** | Café verde en sacos | Tostado a granel para otro envasador | Paquetes, cápsulas, soluble en tarro |
| **Arroz** | Arroz cáscara | Arroz cargo o blanco a granel | Paquetes de 1 kg, vasitos cocidos |
| **Pasta** | Trigo duro | Sémola | Pasta envasada |
| **Atún** | Atún entero congelado | Lomos cocidos congelados | Conservas |
| **Salmón** | Salmón entero | Filetes, lomos | Porciones envasadas, ahumado |

## Qué cambia de una columna a otra

- **Formación del precio.** La materia prima sigue al mercado (a veces a una referencia cotizada, como en el café). El producto terminado se vende con tarifa, promociones y negociación anual.
- **Estructura de costes.** En materia prima casi todo el coste es la compra y la logística. En terminado pesan transformación, envase, marca y distribución.
- **Riesgos.** Materia prima: precio, divisa, calidad del lote. Terminado: caducidad, promociones, devoluciones, penalizaciones de servicio.
- **Unidades.** Toneladas y contenedores frente a unidades, cajas y palés.
- **Clientes.** Industria e importadores frente a distribución, supermercados y horeca.

> Regla práctica: antes de calcular, preguntate **qué estoy vendiendo exactamente y en qué punto de la cadena**. La misma fórmula necesita datos distintos según la respuesta.`,
    quiz: [
      C({ id: 'b-tipos-q1', dim: 'razonamiento', q: 'Una subida fuerte del arábica en el mercado, ¿a quién afecta **antes y con más intensidad**?', opts: [['Al importador de café verde.', 'ok', 'Casi todo su coste es la materia prima y su precio de venta sigue al mercado día a día.'], ['Al fabricante de cápsulas.', 'no', 'Le afecta, pero el café es una parte menor del coste de una cápsula y su tarifa se revisa con menos frecuencia.'], ['A los dos por igual.', 'no', 'El peso de la materia prima en el coste es muy distinto.']] }),
    ],
  }),
  L({
    id: 'b-unidades', unit: '1 · Unidades y proporciones', title: 'Gramos, kilos, toneladas, cajas y palés', sector: 'comun', skills: ['conv-peso', 'conv-cajas'],
    body: `Casi todos los errores graves en un cálculo comercial son errores de **unidades**, no de aritmética. Vale la pena ir despacio.

## Peso

- 1 kg = 1.000 g
- 1 t (tonelada métrica) = 1.000 kg
- 1 lb (libra) = 0,4536 kg → 1 kg ≈ 2,2046 lb

Para pasar de una unidad **pequeña a una grande**, se divide (500 g = 0,5 kg). De **grande a pequeña**, se multiplica (19,2 t = 19.200 kg).

## Precios por unidad de peso

Con los precios ocurre al revés que con los pesos: si 1 kg cuesta 6 €, 1 t cuesta 6.000 € (se multiplica), y 6.000 €/t son 6 €/kg (se divide).

> **Comprobación de sentido:** una tonelada pesa más que un kilo, así que tiene que costar más. Si te sale lo contrario, la conversión está invertida.

## La cadena logística

unidad → caja → palé → camión o contenedor

Cada eslabón tiene su «unidades por…». Y cada vez que pasás al eslabón siguiente, **se redondea hacia arriba**: 14 cajas en palés de 6 cajas son 3 palés, no 2,33.

## Cómo escribir un cálculo para no perderse

Escribí siempre la unidad al lado del número:

50 cajas × 12 paquetes/caja × 0,5 kg/paquete = 300 kg

Las unidades «se cancelan» como en una fracción (cajas con cajas, paquetes con paquetes). Si al final no queda la unidad que buscabas, el planteamiento está mal aunque la cuenta esté bien.`,
  }),
  L({
    id: 'b-proporciones', unit: '1 · Unidades y proporciones', title: 'Proporciones y regla de tres', sector: 'arroz', skills: ['regla3'],
    body: `Dos cantidades son **proporcionales** cuando al doble de una le corresponde el doble de la otra: kilos y euros a un precio fijo, paquetes y kilos, cajas y unidades.

## El método del valor unitario

En lugar de memorizar «multiplico en cruz», pasá siempre por **el valor de 1**:

1. 18 t de arroz cuestan 14.400 €.
2. 1 t cuesta 14.400 ÷ 18 = 800 €.
3. 25 t cuestan 25 × 800 = 20.000 €.

## Cuándo NO vale

La regla de tres supone que la relación se mantiene. En el trabajo real muchas veces no es así:

- **Fletes:** un camión cuesta casi lo mismo con 20 t que con 24 t. El coste por tonelada no es constante.
- **Descuentos por volumen:** el precio unitario baja con la cantidad.
- **Redondeos:** 1,2 palés se pagan como 2.

! Antes de extrapolar, preguntate: ¿el coste es **por unidad** (proporcional) o **por viaje, por pedido o por lote** (fijo)? Mezclarlos es el supuesto equivocado más frecuente.`,
  }),
  L({
    id: 'b-porcentajes', unit: '2 · Porcentajes', title: 'Porcentajes: qué son y cómo calcularlos', sector: 'comun', skills: ['pct-de', 'pct-var', 'pct-inverso'],
    body: `Un porcentaje es una fracción con denominador 100. «8 %» significa «8 de cada 100», es decir, 0,08.

## Las tres operaciones

**1. Porcentaje de una cantidad.** El 8 % de 2.500 € = 2.500 × 0,08 = 200 €.

**2. Aumentar o disminuir.** Subir un 8 % es multiplicar por 1,08. Bajar un 8 % es multiplicar por 0,92. Conviene pensar así, en un solo paso, porque después se pueden encadenar.

**3. Variación entre dos valores.** (nuevo − anterior) ÷ anterior. De 7,20 a 8,10 €/kg: 0,90 ÷ 7,20 = 12,5 %.

## La pregunta clave: ¿porcentaje de qué?

Todo porcentaje tiene una **base**. La mayoría de los errores vienen de usar la base equivocada:

- La variación se calcula sobre el valor **inicial**.
- Una subida del 20 % seguida de una bajada del 20 % **no** te devuelve al punto de partida: 100 → 120 → 96. La segunda se calcula sobre 120.
- Para deshacer una subida del 20 % hay que **dividir entre 1,20**, no restar el 20 %.

## Cálculo mental

- 10 %: correr la coma un lugar. 1 %: dos lugares.
- 5 % = mitad del 10 %. 25 % = la cuarta parte. 50 % = la mitad.
- 15 % = 10 % + 5 %. 2,5 % = la mitad del 5 %.
- Truco de simetría: el 8 % de 25 es lo mismo que el 25 % de 8 (= 2).

> **Puntos porcentuales:** si un margen pasa del 20 % al 25 %, ha subido 5 **puntos**, que es un 25 % de aumento. Decí cuál de las dos cosas querés decir.`,
  }),
  L({
    id: 'b-mezclas', unit: '2 · Porcentajes', title: 'Medias ponderadas y coste de mezclas', sector: 'cafe', skills: ['media-pond'],
    body: `Cuando se mezclan productos con precios distintos, el coste de la mezcla **no** es el promedio de los precios: depende de cuánto hay de cada uno.

## Ejemplo (datos simulados)

Mezcla de café: 70 % arábica a 6,40 €/kg y 30 % robusta a 4,50 €/kg.

- Promedio simple: (6,40 + 4,50) ÷ 2 = 5,45 €/kg → **incorrecto** (supone mitad y mitad).
- Media ponderada: 0,70 × 6,40 + 0,30 × 4,50 = 4,48 + 1,35 = **5,83 €/kg**.

## Con cantidades en vez de porcentajes

Coste total ÷ kilos totales:

(700 kg × 6,40 + 300 kg × 4,50) ÷ 1.000 kg = 5,83 €/kg

## Comprobaciones

- El resultado **siempre** queda entre el precio más bajo y el más alto.
- Queda más cerca del componente que más pesa.
- Los porcentajes de la receta deben sumar 100.

## Dónde aparece

- Mezclas de café, arroces con distinto porcentaje de partidos, sémolas.
- **Precio medio de compra** cuando llenás un almacén con lotes a precios distintos.
- **Margen medio de un cliente** que compra varios productos: se pondera por ventas, no se promedian los márgenes.`,
  }),
  L({
    id: 'b-ventas', unit: '3 · De la factura al beneficio', title: 'Facturación, ventas netas, descuentos y rappels', sector: 'pasta', skills: ['neto'],
    body: `El precio de tarifa casi nunca es lo que la empresa ingresa. Entre uno y otro hay una escalera que conviene saber bajar.

| Escalón | Qué es |
|---|---|
| **Venta bruta** | Unidades × precio de tarifa |
| − Descuentos en factura | Comerciales, por volumen, promocionales |
| = **Venta neta facturada** | Lo que figura en la factura |
| − Rappels | Descuento por alcanzar un volumen en un periodo; se liquida después |
| − Otras aportaciones | Folletos, cabeceras, logística inversa, pronto pago… |
| = **Venta neta-neta** | Lo que realmente ingresa la empresa |

## Cómo se encadenan

Los descuentos sucesivos se **multiplican**, no se suman, salvo que el contrato diga que todos se calculan sobre la tarifa:

100.000 € × (1 − 0,05) × (1 − 0,02) = 93.100 €

Sumando (5 + 2 = 7 %) saldría 93.000 €. La diferencia parece pequeña; en un contrato anual no lo es.

! Leé en el acuerdo **sobre qué base** se calcula cada condición (tarifa, neto en factura, compras totales) y **cuándo** se liquida. No lo supongas.

## Ingreso no es lo mismo que cobro

El rappel reduce el ingreso desde el momento de la venta (hay que provisionarlo), aunque el dinero salga meses después. Y una factura emitida no es dinero en el banco hasta que se cobra. Lo vemos en la lección de plazos de pago.`,
  }),
  L({
    id: 'b-margen', unit: '3 · De la factura al beneficio', title: 'Margen sobre ventas frente a recargo sobre coste', sector: 'comun', skills: ['margen', 'precio-margen', 'recargo-margen'],
    body: `Es la confusión más cara de la gestión comercial. Los dos miden el mismo beneficio, pero lo dividen entre bases distintas.

Ejemplo: coste 8 €, precio 10 €, beneficio 2 €.

| | Fórmula | Resultado |
|---|---|---|
| **Margen sobre ventas** | beneficio ÷ **precio** | 2 ÷ 10 = 20 % |
| **Recargo sobre coste** | beneficio ÷ **coste** | 2 ÷ 8 = 25 % |

El recargo siempre es mayor que el margen, porque el coste es menor que el precio.

## Del coste al precio

- Con **margen** objetivo: precio = coste ÷ (1 − margen). Para un 20 %: 8 ÷ 0,80 = 10 €.
- Con **recargo**: precio = coste × (1 + recargo). Con un 20 %: 8 × 1,20 = 9,60 € → margen real del 16,7 %.

## Tabla para memorizar

| Recargo | Margen |
|---|---|
| 11,1 % | 10 % |
| 25 % | 20 % |
| 33,3 % | 25 % |
| 50 % | 33,3 % |
| 100 % | 50 % |

Conversión: margen = recargo ÷ (1 + recargo) · recargo = margen ÷ (1 − margen).

> Un margen sobre ventas nunca puede llegar al 100 % (el coste tendría que ser cero). Un recargo sí puede superarlo. Si alguien habla de un «margen del 150 %», está hablando de recargo.

## En la práctica

Cuando un cliente, un proveedor o un compañero diga «un 30 %», preguntá: **¿sobre coste o sobre venta?** Y en tus propios documentos, escribilo siempre.`,
  }),
  L({
    id: 'b-coste', unit: '3 · De la factura al beneficio', title: 'Coste de compra, coste entregado y contribución', sector: 'comun', skills: ['coste-entregado', 'contribucion'],
    body: `## Coste de compra frente a coste total entregado

El precio que figura en la oferta del proveedor es el principio, no el final. El **coste total entregado** (en inglés, _landed cost_) suma todo lo necesario para tener el producto disponible en tu almacén:

- Precio de compra
- Transporte principal y seguro
- Gastos de puerto, aduana y aranceles si los hay
- Transporte interior, descarga, almacenaje
- Mermas (de proceso, de manipulación, caducidad)
- Coste financiero del plazo

Dos ofertas solo se comparan en el **mismo punto de entrega**. La más barata en origen puede ser la más cara puesta en casa.

## Contribución

La **contribución** es lo que queda del precio de venta neto después de restar los costes variables (los que solo existen si existe esa venta).

- **Por kilo o por unidad:** precio neto − coste variable unitario.
- **Por pedido:** contribución unitaria × unidades − costes propios del pedido (envío, preparación).
- **Por cliente:** suma de sus pedidos − costes propios del cliente (rappel, visitas, promociones, devoluciones, coste financiero de su plazo).

La contribución sirve para **decidir**: un pedido con contribución positiva ayuda a pagar los costes fijos; uno con contribución negativa empeora el resultado aunque «haga volumen».

## Cuatro palabras que no hay que mezclar

| Concepto | Qué es |
|---|---|
| **Ingreso** | Lo vendido (neto), cuando se vende |
| **Coste** | Lo consumido para vender |
| **Beneficio** | Ingresos − costes |
| **Caja** | Dinero que entra y sale, cuando entra y sale |

Una operación puede dar beneficio y dejarte sin caja (cobrás tarde), o generar caja sin beneficio (cobrás un anticipo).`,
  }),
  L({
    id: 'b-pago', unit: '4 · Cobros y caja', title: 'Condiciones de pago, financiación y riesgo de impago', sector: 'comun', skills: ['financiacion'],
    body: `## El plazo cuesta dinero

Si pagás al proveedor el día 0 y cobrás del cliente el día 90, durante 90 días ese dinero lo pone tu empresa: de su caja o de un crédito. Coste aproximado:

importe × tipo de interés anual × días ÷ 360

Ejemplo (simulado): 100.000 € a 90 días al 6 % anual → 100.000 × 0,06 × 90 ÷ 360 = 1.500 € (1,5 % de la venta).

> **Atajo:** dividí el tipo anual entre 12 para saber cuánto cuesta cada mes de plazo. Al 6 %, cada 30 días cuestan 0,5 %.

## Qué días cuentan

Lo que hay que financiar es el periodo entre que **sale** el dinero y **vuelve**:

días de stock + días de cobro al cliente − días de pago al proveedor

Por eso el café verde importado (pago al embarque, semanas de tránsito, stock, tueste, 60 días de cobro) inmoviliza mucha más caja que revender una conserva comprada a 60 días.

## Negociar el plazo

Conceder 30 días más equivale a un descuento. Calculalo antes de decir que sí, y compará: ¿preferís dar 30 días o un 0,5 % de descuento por pronto pago? Depende de lo que le cueste el dinero a tu empresa y de cómo esté la caja.

## Riesgo de impago

Si el margen es del 10 %, **un impago de 10.000 € obliga a vender 100.000 € más** solo para recuperar lo perdido. Herramientas habituales (su disponibilidad y coste dependen de cada empresa y cliente):

- Límite de crédito por cliente y seguimiento de vencimientos.
- Seguro de crédito.
- Pago anticipado, contra documentos o con garantía bancaria en operaciones internacionales.

! El comercial no decide el crédito, pero sí es quien primero detecta señales: retrasos, pedidos inusualmente grandes, cambios de interlocutor. Avisá a finanzas.`,
  }),
]
