import type { ChoiceStep, Grade, NumStep, Opt, WriteStep } from '../lib/types.ts'
export const N = (o: Omit<NumStep, 'kind'>): NumStep => ({ kind: 'num', ...o })
export const C = (o: Omit<ChoiceStep, 'kind' | 'opts'> & { opts: [string, Grade, string][] }): ChoiceStep =>
  ({ kind: 'choice', ...o, opts: o.opts.map(([t, g, fb]): Opt => ({ t, g, fb })) })
export const W = (o: Omit<WriteStep, 'kind'>): WriteStep => ({ kind: 'write', ...o })
