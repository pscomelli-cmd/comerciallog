# ComercialLog

Plataforma interactiva en español para entrenar gestión comercial, compras, logística y supply chain agroalimentaria. Sectores: **café** (recorrido principal, la mitad de los casos), arroz, pasta, atún y salmón, distinguiendo materia prima, semielaborado y producto terminado.

## Qué incluye

- **Diagnóstico inicial**: 10 preguntas, sin tiempo ni nota.
- **Bases de matemática comercial**: unidades, proporciones, porcentajes, mezclas, ventas netas, margen frente a recargo, coste entregado, contribución, financiación.
- **Recorrido de café**: producto, lectura de ofertas, referencia + diferencial, precio fijo o a fijar, coberturas, coste puesto en almacén, merma de tueste, canales, logística y calidad.
- **Arroz, pasta, atún y salmón**: particularidades y por qué la misma fórmula necesita datos distintos.
- **Logística y comercio internacional**: stock, punto de pedido, peso frente a volumen, Incoterms (EXW, FCA, FOB, CFR, CIF), documentación.
- **12 casos** en siete fases (comprender, qué falta, a quién consultar, calcular, comparar, decidir, comunicar), con datos progresivos y evaluación por dimensión.
- **25 ejercicios generativos** con dificultad adaptativa y repetición espaciada.
- **Calculadoras**, fórmulas de **Excel en italiano**, **correos modelo** en español, italiano, inglés y portugués, **glosario**.
- **Cargas en 3D** (three.js): palés, camión, contenedor de café, merma de tueste, almacén con punto de pedido, cámara de salmón, ruta de Incoterms y latas de atún en corte; integradas en lecciones y casos. Incluye un botón de realidad virtual (WebXR) que solo aparece en dispositivos compatibles y no se ha probado con un visor.
- **Mis casos**: casos propios anonimizados, separando datos aportados, resultados calculados, supuestos y pendientes.

Cada ejercicio: una pregunta por vez, pistas graduales, solución solo tras un intento, diagnóstico del tipo de error (cálculo, unidades, interpretación, supuesto), resolución escrita, teclas de calculadora, cálculo mental y significado comercial del resultado.

## Uso

```bash
npm install
npm run dev      # desarrollo
npm run check    # comprueba la coherencia del contenido (respuestas, ids, trampas)
npm run build    # genera dist/ (sitio estático)
```

Incluye `manifest.webmanifest` e iconos, de modo que en el teléfono se puede añadir a la pantalla de inicio. `dist/` es estático y usa rutas con `#`: funciona en GitHub Pages (workflow incluido, se ejecuta al llegar a `main`), Vercel o cualquier servidor de archivos.

## Dónde se guarda el progreso

En el `localStorage` del navegador (clave `comerciallog.v1`). En el sitio estático no hay servidor ni cuentas: no se sincroniza entre dispositivos y se pierde si se borran los datos del sitio. Cuando la página se publica dentro de claude.ai (`scripts/single-file.py` genera el HTML único), el progreso se sincroniza además en un espacio privado del usuario. La pantalla «Mi progreso» permite descargar y restaurar una copia en JSON.

## Sobre los datos

- Todos los precios, costes, tipos de cambio, mermas y tarifas de los ejercicios son **simulados**. No son cotizaciones reales, actuales ni históricas.
- Los rendimientos y medidas «orientativos» son órdenes de magnitud didácticos: el dato válido es el de cada operación.
- El resumen de Incoterms® 2020 (Cámara de Comercio Internacional) y las menciones normativas son didácticos y no se contrastaron en línea al redactarlos; lo que obliga es el contrato y el texto oficial.

## Estructura

```
src/lib/         tipos, comprobación numérica y diagnóstico de errores, guardado y repaso espaciado
src/components/  tarjeta de ejercicio, recorrido de casos, práctica, calculadora
src/content/     lecciones, casos, generadores, glosario, Excel, correos (los números se calculan en código)
src/pages/       pantallas
scripts/         comprobación de contenido
```
