import type { TopicMeta } from './types';

export const TOPICS: TopicMeta[] = [
  // ── Comercial ────────────────────────────────────────────────────────────
  {
    id: 'margenes-markup',
    area: 'comercial',
    label: 'Márgenes y Markup',
    description: 'Margen sobre coste vs. sobre precio de venta, cálculo de PVP',
    icon: '💰',
  },
  {
    id: 'descuentos',
    area: 'comercial',
    label: 'Descuentos',
    description: 'Descuentos en cadena, por volumen y pronto pago',
    icon: '🏷️',
  },
  {
    id: 'iva-impuestos',
    area: 'comercial',
    label: 'IVA e Impuestos',
    description: 'Precios con y sin IVA, tipos impositivos',
    icon: '🧾',
  },
  {
    id: 'break-even',
    area: 'comercial',
    label: 'Punto de Equilibrio',
    description: 'Cálculo del break-even en unidades y en euros',
    icon: '⚖️',
  },
  {
    id: 'comisiones',
    area: 'comercial',
    label: 'Comisiones',
    description: 'Comisión fija, escalonada y sobre margen',
    icon: '🤝',
  },
  {
    id: 'prevision-ventas',
    area: 'comercial',
    label: 'Previsión de Ventas',
    description: 'Media móvil, tendencias y objetivos',
    icon: '📈',
  },
  {
    id: 'kpis-comerciales',
    area: 'comercial',
    label: 'KPIs Comerciales',
    description: 'Ticket medio, tasa de conversión, LTV, CAC',
    icon: '📊',
  },
  // ── Logística ────────────────────────────────────────────────────────────
  {
    id: 'rotacion-inventario',
    area: 'logistica',
    label: 'Rotación de Inventario',
    description: 'Días de inventario, tasa de rotación',
    icon: '🔄',
  },
  {
    id: 'stock-seguridad',
    area: 'logistica',
    label: 'Stock de Seguridad',
    description: 'Stock de seguridad y punto de pedido',
    icon: '🛡️',
  },
  {
    id: 'eoq',
    area: 'logistica',
    label: 'EOQ (Cantidad Económica)',
    description: 'Lote económico de pedido, coste total de inventario',
    icon: '📦',
  },
  {
    id: 'costes-almacenamiento',
    area: 'logistica',
    label: 'Costes de Almacenamiento',
    description: 'Coste de posesión, obsolescencia, espacio',
    icon: '🏭',
  },
  {
    id: 'costes-transporte',
    area: 'logistica',
    label: 'Costes de Transporte',
    description: 'Coste por unidad, por envío, tarifas',
    icon: '🚚',
  },
  {
    id: 'contenedores-pales',
    area: 'logistica',
    label: 'Contenedores y Palés',
    description: 'Capacidad volumétrica, peso, factor de estiba',
    icon: '🗂️',
  },
  {
    id: 'incoterms',
    area: 'logistica',
    label: 'Incoterms',
    description: 'Transmisión de costes y riesgo en comercio internacional',
    icon: '🌍',
  },
  {
    id: 'kpis-logisticos',
    area: 'logistica',
    label: 'KPIs Logísticos',
    description: 'OTIF, nivel de servicio, lead time, fill rate',
    icon: '📉',
  },
];

export const getTopicsByArea = (area: 'comercial' | 'logistica') =>
  TOPICS.filter((t) => t.area === area);

export const getTopicMeta = (id: string) => TOPICS.find((t) => t.id === id);
