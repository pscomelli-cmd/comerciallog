import type { ReactNode } from 'react'

/** Negritas, código y cursiva dentro de una línea. */
export function inline(t: string): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*|`[^`]+`|_[^_]+_)/g).map((p, i) =>
    p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong>
    : p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code>
    : p.startsWith('_') && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : p)
}

/**
 * Mini-markdown para el contenido: párrafos, "## " subtítulos, "- " listas,
 * tablas con |, "> " nota y "! " advertencia.
 */
export function Rich({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/)
  return <div className="rich">{blocks.map((b, i) => {
    const lines = b.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) return null
    if (lines[0].startsWith('## ')) return <h3 key={i}>{inline(lines[0].slice(3))}</h3>
    if (lines.every((l) => l.startsWith('- '))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>
    if (lines.every((l) => /^\d+\. /.test(l))) return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ''))}</li>)}</ol>
    if (lines[0].startsWith('|')) {
      const rows = lines.map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
      return <div className="tablewrap" key={i}><table><thead><tr>{rows[0].map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead>
        <tbody>{rows.slice(1).map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{inline(c)}</td>)}</tr>)}</tbody></table></div>
    }
    if (lines[0].startsWith('> ')) return <div className="note" key={i}>{inline(lines.map((l) => l.replace(/^> ?/, '')).join(' '))}</div>
    if (lines[0].startsWith('! ')) return <div className="note warn" key={i}>{inline(lines.map((l) => l.replace(/^! ?/, '')).join(' '))}</div>
    return <p key={i}>{inline(lines.join(' '))}</p>
  })}</div>
}
