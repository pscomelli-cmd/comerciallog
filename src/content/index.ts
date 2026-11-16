import type { Case, Lesson } from '../lib/types.ts'
import { CASES_CAFE } from './cases-cafe.ts'
import { CASES_OTROS } from './cases-otros.ts'
import { CASES_CAFE2 } from './cases-cafe2.ts'
import { CASES_INT, LESSONS_INT } from './internacional.ts'
import { LESSONS_BASES } from './lessons-bases.ts'
import { LESSONS_CAFE } from './lessons-cafe.ts'
import { LESSONS_COM, LESSONS_LOG, LESSONS_SECTORES } from './lessons-otros.ts'

const order = ['cafe-ofertas', 'cajas-pales', 'atun-ofertas', 'cafe-fijacion', 'arroz-licitacion', 'cafe-retraso', 'pasta-promo', 'cafe-reclamacion', 'salmon-prevision', 'incoterms-oferta', 'int-primer-pedido', 'int-arancel-origen', 'cafe-horeca', 'int-dos-mercados', 'cafe-integrador']
export const CASES: Case[] = [...CASES_CAFE, ...CASES_CAFE2, ...CASES_OTROS, ...CASES_INT].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
export const LESSONS: Lesson[] = [...LESSONS_BASES, ...LESSONS_CAFE, ...LESSONS_SECTORES, ...LESSONS_LOG, ...LESSONS_INT, ...LESSONS_COM]
export const TRACKS: Record<Lesson['track'], { title: string; desc: string }> = {
  bases: { title: 'Bases de matemática comercial', desc: 'Unidades, porcentajes, mezclas, ventas netas, margen y recargo, coste entregado, contribución y caja.' },
  cafe: { title: 'Recorrido especial de café', desc: 'Del café verde a la propuesta comercial: producto, precios, coberturas, costes, canales y logística.' },
  sectores: { title: 'Arroz, pasta, atún y salmón', desc: 'Qué cambia en cada sector y por qué la misma fórmula necesita datos distintos.' },
  logistica: { title: 'Logística y comercio internacional', desc: 'Stock, cargas, peso y volumen, Incoterms, documentación.' },
  internacional: { title: 'Negocios internacionales', desc: 'La mentalidad internacional: riesgos, divisas, medios de pago, aduanas y origen, elección de mercados y socios, y negociación entre culturas.' },
  comercial: { title: 'Gestión comercial y compras', desc: 'Ofertas, licitaciones, comparación de proveedores, negociación y recomendaciones a dirección.' },
}
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id)
export const caseById = (id: string) => CASES.find((c) => c.id === id)
