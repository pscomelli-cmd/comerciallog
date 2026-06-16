# ComercialLog — Plataforma de práctica Comercial & Logística

Aplicación web interactiva para practicar conceptos de ámbito **comercial** y **logístico** con tres modos de práctica: quiz, ejercicios numéricos y flashcards con repaso espaciado (Leitner).

## Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7**
- Progreso en **localStorage** (sin backend)

## Instalación y arranque

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # Construir para producción
```

## Estructura del proyecto

```
frontend/src/
├── data/
│   ├── types.ts           # Tipos TypeScript de todo el contenido
│   ├── topics.ts          # Metadatos de los 14 temas
│   ├── comercial.ts       # Contenido del área Comercial
│   ├── logistica.ts       # Contenido del área Logística
│   └── index.ts           # Funciones de selección y filtrado
├── components/
│   ├── Layout.tsx          # Navegación superior + móvil
│   ├── ProgressBar.tsx     # Barra de progreso de sesión
│   ├── QuizMode.tsx        # Modo quiz (opción múltiple)
│   ├── ExerciseMode.tsx    # Modo ejercicio numérico
│   └── FlashcardMode.tsx   # Modo flashcard con Leitner
├── pages/
│   ├── Dashboard.tsx       # Inicio con stats y accesos rápidos
│   ├── PracticeSetup.tsx   # Selección área → tema → modo
│   ├── PracticeSession.tsx # Sesión activa
│   ├── Results.tsx         # Resumen de sesión
│   └── Statistics.tsx      # Progreso por tema y área
├── context/
│   ├── ThemeContext.tsx    # Modo claro/oscuro
│   └── ProgressContext.tsx
└── hooks/
    └── useProgress.ts     # Lógica de localStorage + Leitner
```

## Añadir nuevos ejercicios / preguntas

### 1. Añadir un quiz

Edita `src/data/comercial.ts` o `src/data/logistica.ts` y añade un objeto de tipo `QuizQuestion`:

```ts
{
  id: 'mi-tema-q99',            // único en todo el banco
  type: 'quiz',
  area: 'comercial',            // 'comercial' | 'logistica'
  topic: 'margenes-markup',     // ver lista en topics.ts
  difficulty: 'medio',          // 'facil' | 'medio' | 'dificil'
  question: '¿Pregunta?',
  options: [
    { id: 'a', text: 'Opción A' },
    { id: 'b', text: 'Opción B' },
    { id: 'c', text: 'Opción C' },
    { id: 'd', text: 'Opción D' },
  ],
  correctOptionId: 'b',
  explanation: 'Explicación de por qué B es correcto...',
},
```

### 2. Añadir un ejercicio numérico

```ts
{
  id: 'mi-tema-e99',
  type: 'ejercicio',
  area: 'logistica',
  topic: 'eoq',
  difficulty: 'dificil',
  title: 'Título corto del ejercicio',
  statement: 'Enunciado completo del problema.',
  data: {
    'Variable A': '100 ud',
    'Variable B': '50 €',
  },
  formula: 'Resultado = A × B',
  steps: [
    { description: 'Paso 1', formula: '100 × 50', result: '5.000' },
    { description: 'Paso 2', result: 'Resultado final' },
  ],
  answer: 5000,          // número exacto
  tolerance: 0.01,       // tolerancia: 0.01 = ±1 %
  unit: '€',
  hint: 'Pista para el alumno si falla.',
},
```

### 3. Añadir una flashcard

```ts
{
  id: 'mi-tema-f99',
  type: 'flashcard',
  area: 'comercial',
  topic: 'kpis-comerciales',
  difficulty: 'facil',
  front: 'Pregunta o término que aparece en el anverso',
  back: 'Respuesta o definición en el reverso',
  formula: 'Fórmula opcional (aparece destacada)',
  example: 'Ejemplo numérico opcional',
},
```

### 4. Añadir un nuevo tema

Edita `src/data/topics.ts` y añade un objeto `TopicMeta`. Luego añade el nuevo id al tipo `Topic` en `types.ts`.

## Sistema Leitner (flashcards)

Las flashcards siguen el algoritmo de Leitner con 5 cajas:

| Caja | Intervalo de repaso |
|------|---------------------|
| 1    | 1 hora              |
| 2    | 1 día               |
| 3    | 3 días              |
| 4    | 7 días              |
| 5    | 14 días             |

"La sabía" → sube de caja. "No la sabía" → vuelve a la caja 1.

## Temas disponibles

**Comercial:** Márgenes y Markup · Descuentos · IVA e Impuestos · Punto de Equilibrio · Comisiones · Previsión de Ventas · KPIs Comerciales

**Logística:** Rotación de Inventario · Stock de Seguridad · EOQ · Costes de Almacenamiento · Costes de Transporte · Contenedores y Palés · Incoterms · KPIs Logísticos
