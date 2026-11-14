import { useState } from 'react'

/** Botón que pide un segundo clic para confirmar, sin diálogos del navegador. */
export function ConfirmButton({ label, onConfirm, className = 'btn ghost' }: { label: string; onConfirm: () => void; className?: string }) {
  const [armed, setArmed] = useState(false)
  return armed
    ? <span className="row"><b className="small">¿Seguro? No se puede deshacer.</b><button className="btn small" onClick={() => { setArmed(false); onConfirm() }}>Sí, {label.toLowerCase()}</button><button className="btn small" onClick={() => setArmed(false)}>Cancelar</button></span>
    : <button className={className} onClick={() => setArmed(true)}>{label}</button>
}
