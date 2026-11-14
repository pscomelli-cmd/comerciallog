import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export type Build = (scene: THREE.Group) => { center: [number, number, number]; radius: number }

const mat = (color: number, opts: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...opts })
const CARTON = 0xc9a26b, WOOD = 0x9a6b3f, JUTE = 0xb8935a, STEEL = 0x7d8791, FILL = 0x3f7f5f

/** Lienzo 3D: girar arrastrando, acercar con rueda o pellizco. Unidades en metros. */
export function Scene3D({ build, deps, height = 320 }: { build: Build; deps: unknown[]; height?: number }) {
  const box = useRef<HTMLDivElement>(null)
  const api = useRef<{ renderer: THREE.WebGLRenderer; rig: THREE.Group; view: { center: [number, number, number]; radius: number } } | null>(null)
  const [fail, setFail] = useState(false)
  const [vr, setVr] = useState(false)

  useEffect(() => {
    const el = box.current!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { setFail(true); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.xr.enabled = true
    el.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 1.5))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(4, 9, 6); scene.add(sun)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 400)
    const rig = new THREE.Group(); rig.add(camera); scene.add(rig)
    const content = new THREE.Group(); scene.add(content)
    const view = build(content)
    const grid = new THREE.GridHelper(Math.ceil(view.radius * 4), Math.ceil(view.radius * 4), 0x9a8f83, 0xb9afa3)
    ;(grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.45; scene.add(grid)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(...view.center)
    camera.position.set(view.center[0] + view.radius * 1.25, view.center[1] + view.radius * 0.95, view.center[2] + view.radius * 1.7)
    controls.enableDamping = true; controls.maxPolarAngle = Math.PI / 2 - 0.02
    controls.minDistance = view.radius * 0.35; controls.maxDistance = view.radius * 6
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix() }
    resize(); const ro = new ResizeObserver(resize); ro.observe(el)
    renderer.setAnimationLoop(() => { if (!renderer.xr.isPresenting) controls.update(); renderer.render(scene, camera) })
    api.current = { renderer, rig, view }
    const xr = (navigator as Navigator & { xr?: { isSessionSupported(m: string): Promise<boolean> } }).xr
    xr?.isSessionSupported('immersive-vr').then(setVr).catch(() => setVr(false))
    return () => {
      renderer.setAnimationLoop(null); ro.disconnect(); controls.dispose()
      scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose(); const mm = m.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(mm)) mm.forEach((x) => x.dispose()); else mm?.dispose() })
      renderer.dispose(); renderer.domElement.remove(); api.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const enterVr = async () => {
    const a = api.current; if (!a) return
    try {
      const xr = (navigator as unknown as { xr: { requestSession(m: string, o: object): Promise<XRSession> } }).xr
      const session = await xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor'] })
      // En realidad virtual quedás de pie junto a la carga, a escala real (1 unidad = 1 metro).
      a.rig.position.set(a.view.center[0], 0, a.view.center[2] + a.view.radius * 1.1)
      session.addEventListener('end', () => a.rig.position.set(0, 0, 0))
      await a.renderer.xr.setSession(session)
    } catch { setVr(false) }
  }
  const full = () => { void box.current?.requestFullscreen?.().catch(() => {}) }

  if (fail) return <div className="note warn">Este navegador no puede mostrar gráficos 3D (WebGL no disponible). Los resultados numéricos de arriba siguen siendo válidos.</div>
  return <div className="scene3d">
    <div ref={box} className="canvas3d" style={{ height }} />
    <div className="row"><span className="muted small">Arrastrá para girar · rueda o pellizco para acercar · dos dedos para desplazar. Escala real en metros.</span>
      <button className="btn small" onClick={full}>Pantalla completa</button>
      {vr && <button className="btn small primary" onClick={() => void enterVr()}>Entrar en realidad virtual</button>}</div>
  </div>
}

function instanced(geo: THREE.BufferGeometry, material: THREE.Material, pos: [number, number, number][], parent: THREE.Group) {
  if (!pos.length) return
  const m = new THREE.InstancedMesh(geo, material, pos.length), t = new THREE.Matrix4()
  pos.forEach((p, i) => { t.makeTranslation(p[0], p[1], p[2]); m.setMatrixAt(i, t) })
  parent.add(m)
}
function outline(w: number, h: number, d: number, at: [number, number, number], parent: THREE.Group, color = 0x6f655d) {
  const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), new THREE.LineBasicMaterial({ color }))
  l.position.set(...at); parent.add(l)
}

/** Reparto esquemático de las cajas sobre un europalé de 1,2 × 0,8 m. */
export function palletLayout(cpp: number) {
  const perLayer = cpp <= 4 ? cpp : cpp <= 12 ? Math.ceil(cpp / 2) : cpp <= 30 ? Math.ceil(cpp / 3) : Math.ceil(cpp / 5)
  const nx = Math.max(1, Math.ceil(Math.sqrt(perLayer * 1.5))), nz = Math.max(1, Math.ceil(perLayer / nx))
  const layers = Math.ceil(cpp / (nx * nz))
  return { nx, nz, layers, bx: 1.2 / nx, bz: 0.8 / nz, bh: Math.min(0.4, 1.3 / layers) }
}

/** Palés con sus cajas; el último palé muestra en hueco las cajas que faltan para completarlo. */
export function PalletScene({ cajas, cpp }: { cajas: number; cpp: number }) {
  const ok = cajas > 0 && cpp > 0 && cajas <= 4000 && cpp <= 200
  const pal = ok ? Math.ceil(cajas / cpp) : 0, shown = Math.min(pal, 12)
  const build: Build = (g) => {
    const L = palletLayout(cpp), full: [number, number, number][] = [], ghost: [number, number, number][] = [], bases: [number, number, number][] = []
    for (let p = 0; p < shown; p++) {
      const ox = p * 1.55, n = p === pal - 1 ? cajas - cpp * (pal - 1) : cpp
      bases.push([ox, 0.072, 0])
      for (let i = 0; i < cpp; i++) {
        const layer = Math.floor(i / (L.nx * L.nz)), r = i % (L.nx * L.nz), ix = r % L.nx, iz = Math.floor(r / L.nx)
        const at: [number, number, number] = [ox - 0.6 + L.bx * (ix + 0.5), 0.144 + L.bh * (layer + 0.5), -0.4 + L.bz * (iz + 0.5)]
        ;(i < n ? full : ghost).push(at)
      }
    }
    instanced(new THREE.BoxGeometry(1.2, 0.144, 0.8), mat(WOOD), bases, g)
    const bg = new THREE.BoxGeometry(L.bx * 0.94, L.bh * 0.94, L.bz * 0.94)
    instanced(bg, mat(CARTON), full, g)
    instanced(bg, mat(0xa3322a, { transparent: true, opacity: 0.22, depthWrite: false }), ghost, g)
    const w = (shown - 1) * 1.55
    return { center: [w / 2, 0.6, 0], radius: Math.max(1.6, w / 2 + 1.2) }
  }
  if (!ok) return <p className="muted small">Introducí cajas y cajas por palé para ver la escena.</p>
  return <><Scene3D build={build} deps={[cajas, cpp]} />
    <p className="small"><b>{pal} palé{pal === 1 ? '' : 's'}</b> para {cajas} cajas a {cpp} por palé. En rojo translúcido, los huecos del último palé: espacio que se paga y no se usa.{pal > shown ? ` Se dibujan los primeros ${shown}.` : ''} <span className="muted">El reparto de cajas es esquemático.</span></p></>
}

/** Remolque de 13,6 m con 33 huecos de europalé: llenos, vacíos y qué límite manda. */
export function TruckScene({ kgPale, huecos = 33, max = 24000, alto = 1.4 }: { kgPale: number; huecos?: number; max?: number; alto?: number }) {
  const ok = kgPale > 0 && huecos > 0 && huecos <= 66
  const porPeso = ok ? Math.floor(max / kgPale) : 0, n = Math.min(huecos, porPeso)
  const build: Build = (g) => {
    const rows = Math.ceil(huecos / 3), len = rows * 1.21 + 0.3, full: [number, number, number][] = [], empty: [number, number, number][] = []
    const floor = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 2.5), mat(STEEL)); floor.position.set(len / 2, 1.14, 0); g.add(floor)
    for (const x of [1.2, len - 2.6, len - 1.3]) for (const z of [-1.05, 1.05]) { const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20), mat(0x2a2420)); wh.rotation.x = Math.PI / 2; wh.position.set(x, 0.5, z); g.add(wh) }
    outline(len, 2.7, 2.5, [len / 2, 1.2 + 1.35, 0], g)
    for (let i = 0; i < huecos; i++) { const at: [number, number, number] = [0.75 + Math.floor(i / 3) * 1.21, 1.2, -0.81 + (i % 3) * 0.81]; (i < n ? full : empty).push(at) }
    instanced(new THREE.BoxGeometry(1.16, alto, 0.77).translate(0, alto / 2, 0), mat(porPeso < huecos ? 0xa8541c : FILL), full, g)
    instanced(new THREE.BoxGeometry(1.16, 0.03, 0.77).translate(0, 0.02, 0), mat(0xa3322a, { transparent: true, opacity: 0.45 }), empty, g)
    return { center: [len / 2, 1.6, 0], radius: len / 2 + 0.6 }
  }
  if (!ok) return <p className="muted small">Introducí el peso por palé para ver la escena.</p>
  return <><Scene3D build={build} deps={[kgPale, huecos, max, alto]} />
    <p className="small"><b>{n} de {huecos} huecos ocupados</b>. {porPeso < huecos ? `Limita el peso: con ${n} palés ya van ${(n * kgPale).toLocaleString('es-ES')} kg de ${max.toLocaleString('es-ES')}. Los huecos en rojo viajan vacíos.` : `Limita el espacio: el camión va lleno con ${(n * kgPale).toLocaleString('es-ES')} kg, y sobran ${(max - n * kgPale).toLocaleString('es-ES')} kg de capacidad.`}</p></>
}

/** Contenedor de 20 pies con sacos de café verde. Medidas interiores y del saco orientativas. */
export function ContainerScene({ sacos, kgSaco }: { sacos: number; kgSaco: number }) {
  const ok = sacos > 0 && sacos <= 600 && kgSaco > 0
  const L = 5.9, W = 2.35, H = 2.39, sx = 0.95, sy = 0.16, sz = 0.58, perLayer = Math.floor(L / sx) * Math.floor(W / sz), cap = perLayer * Math.floor(H / sy)
  const n = Math.min(sacos, cap)
  const build: Build = (g) => {
    const nx = Math.floor(L / sx), nz = Math.floor(W / sz), pos: [number, number, number][] = []
    for (let i = 0; i < n; i++) { const layer = Math.floor(i / perLayer), r = i % perLayer; pos.push([sx * ((r % nx) + 0.5) + 0.1, sy * (layer + 0.5) + 0.02, -W / 2 + sz * (Math.floor(r / nx) + 0.5) + (W - nz * sz) / 2]) }
    const geo = new THREE.SphereGeometry(0.5, 12, 8).scale(sx * 1.02, sy * 1.25, sz * 1.02)
    instanced(geo, mat(JUTE), pos, g)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(L, 0.04, W), mat(STEEL)); floor.position.set(L / 2, -0.02, 0); g.add(floor)
    outline(L, H, W, [L / 2, H / 2, 0], g, 0x5b3a29)
    return { center: [L / 2, 1, 0], radius: 3.6 }
  }
  if (!ok) return <p className="muted small">Introducí el número de sacos (hasta 600) y su peso.</p>
  return <><Scene3D build={build} deps={[sacos, kgSaco]} />
    <p className="small"><b>{n} sacos · {(n * kgSaco).toLocaleString('es-ES')} kg</b> en {Math.ceil(n / perLayer)} capas ({Math.round((Math.ceil(n / perLayer) * sy / H) * 100)} % de la altura).{sacos > cap ? ` En este esquema no caben más de ${cap} sacos.` : ''} <span className="muted">Medidas orientativas: la estiba y la carga reales dependen del origen, del saco y de la naviera.</span></p></>
}
