// Comprobación de coherencia del contenido: ids únicos, respuestas finitas, pistas y soluciones presentes.
import { CASES, LESSONS } from '../src/content/index.ts'
import { SKILLS } from '../src/content/skills.ts'
import { check, f } from '../src/lib/num.ts'
import type { Step } from '../src/lib/types.ts'

let errors = 0
const fail = (m: string) => { console.error('✗ ' + m); errors++ }
const ids = new Set<string>()
function checkStep(s: Step, where: string, gen = false) {
  if (ids.has(s.id)) fail(`id duplicado ${s.id}`); ids.add(s.id)
  const txt = JSON.stringify(s)
  if (/NaN|undefined|Infinity/.test(txt)) fail(`${where}/${s.id}: texto con NaN/undefined`)
  if (s.kind === 'num') {
    if (!isFinite(s.a)) fail(`${where}/${s.id}: respuesta no finita`)
    if (!s.hints.length || !s.sol.length) fail(`${where}/${s.id}: sin pistas o solución`)
    if (!check(s, f(s.a, 6)).ok) fail(`${where}/${s.id}: la respuesta correcta no se acepta`)
    if (!gen) for (const t of s.traps ?? []) if (check({ ...s, traps: [] }, String(t.v).replace('.', ',')).ok) fail(`${where}/${s.id}: una trampa (${t.v}) coincide con la respuesta ${s.a}`)
  } else if (s.kind === 'choice') {
    if (!s.opts.some((o) => o.g === 'ok')) fail(`${where}/${s.id}: sin opción correcta`)
  }
}
for (const c of CASES) c.steps.forEach((s) => checkStep(s, c.id))
for (const l of LESSONS) {
  l.quiz?.forEach((s) => checkStep(s, l.id))
  for (const k of l.skills ?? []) if (!SKILLS.some((x) => x.id === k)) fail(`${l.id}: habilidad desconocida ${k}`)
}
for (const k of SKILLS) for (const lv of [1, 2, 3]) for (let i = 0; i < 300; i++) {
  const s = k.gen(lv); ids.delete(s.id); checkStep(s, `skill ${k.id} L${lv}`, true); ids.delete(s.id)
}
const cafe = CASES.filter((c) => c.sector === 'cafe').length
console.log(`${CASES.length} casos (${cafe} de café = ${Math.round((cafe / CASES.length) * 100)} %), ${LESSONS.length} lecciones, ${SKILLS.length} habilidades generativas, ${CASES.reduce((n, c) => n + c.steps.length, 0)} pasos de caso.`)
if (process.argv.includes('--dump')) for (const c of CASES) for (const s of c.steps) if (s.kind === 'num') console.log(c.id, s.id, f(s.a, 4), s.unit)
if (errors) { console.error(`${errors} errores`); process.exit(1) } else console.log('Contenido coherente ✓')
