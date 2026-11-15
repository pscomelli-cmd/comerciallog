import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { f, g } from '../lib/num.ts'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export type Build = (scene: THREE.Group) => { center: [number, number, number]; radius: number }

const mat = (color: number, opts: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...opts })
const CARTON = 0xc9a26b, WOOD = 0x9a6b3f, JUTE = 0xb8935a, STEEL = 0x7d8791, FILL = 0x3f7f5f

/** Lienzo 3D: girar arrastrando, acercar con rueda o pellizco. Unidades en metros. */
export function Scene3D({ build, deps, height = 320 }: { build: Build; deps: unknown[]; height?: number }) {
  const box = useRef<HTMLDivElement>(null)
  const api = useRef<{ renderer: THREE.WebGLRenderer; rig: THREE.Group; content: THREE.Group; camera: THREE.PerspectiveCamera; controls: OrbitControls; grid?: THREE.GridHelper; scene: THREE.Scene; radius: number; view: { center: [number, number, number]; radius: number } } | null>(null)
  const [fail, setFail] = useState(false)
  const [vr, setVr] = useState(false)

  // Se crea una sola vez; el contenido se redibuja aparte para no perder el punto de vista.
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
    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 600)
    const rig = new THREE.Group(); rig.add(camera); scene.add(rig)
    const content = new THREE.Group(); scene.add(content)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.maxPolarAngle = Math.PI / 2 - 0.02
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix() }
    resize(); const ro = new ResizeObserver(resize); ro.observe(el)
    renderer.setAnimationLoop(() => { if (!renderer.xr.isPresenting) controls.update(); renderer.render(scene, camera) })
    api.current = { renderer, rig, content, camera, controls, scene, radius: 0, view: { center: [0, 0, 0], radius: 1 } }
    const xr = (navigator as Navigator & { xr?: { isSessionSupported(m: string): Promise<boolean> } }).xr
    xr?.isSessionSupported('immersive-vr').then(setVr).catch(() => setVr(false))
    return () => {
      renderer.setAnimationLoop(null); ro.disconnect(); controls.dispose(); clear(scene)
      renderer.dispose(); renderer.domElement.remove(); api.current = null
    }
  }, [])

  useEffect(() => {
    const a = api.current; if (!a) return
    clear(a.content); a.content.clear()
    const view = build(a.content); a.view = view
    // Solo se recoloca la cámara cuando cambia el tamaño de la escena, no en cada ajuste.
    if (Math.abs(view.radius - a.radius) > 0.01) {
      a.radius = view.radius
      if (a.grid) { a.scene.remove(a.grid); a.grid.geometry.dispose(); (a.grid.material as THREE.Material).dispose() }
      const n = Math.ceil(view.radius * 4)
      a.grid = new THREE.GridHelper(n, n, 0x9a8f83, 0xb9afa3); const gm = a.grid.material as THREE.Material; gm.transparent = true; gm.opacity = 0.45; a.scene.add(a.grid)
      a.controls.target.set(...view.center)
      a.camera.position.set(view.center[0] + view.radius * 1.25, view.center[1] + view.radius * 0.95, view.center[2] + view.radius * 1.7)
      a.controls.minDistance = view.radius * 0.35; a.controls.maxDistance = view.radius * 6
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

function clear(root: THREE.Object3D) {
  root.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose(); const mm = m.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(mm)) mm.forEach((x) => x.dispose()); else mm?.dispose() })
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
    <p className="small"><b>{n} de {huecos} huecos ocupados</b>. {porPeso < huecos ? `Limita el peso: con ${n} palés ya van ${f(n * kgPale, 0)} kg de ${f(max, 0)}. Los huecos en rojo viajan vacíos.` : `Limita el espacio: el camión va lleno con ${f(n * kgPale, 0)} kg, y sobran ${f(max - n * kgPale, 0)} kg de capacidad.`}</p></>
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
    <p className="small"><b>{n} sacos · {f(n * kgSaco, 0)} kg</b> en {Math.ceil(n / perLayer)} capas ({Math.round((Math.ceil(n / perLayer) * sy / H) * 100)} % de la altura).{sacos > cap ? ` En este esquema no caben más de ${cap} sacos.` : ''} <span className="muted">Medidas orientativas: la estiba y la carga reales dependen del origen, del saco y de la naviera.</span></p></>
}

const GOOD = 0x3f7f5f, AMBER = 0xd39a2c, RED = 0xa3322a
const fmt = (n: number) => f(n, 0)

/** Almacén con estanterías: cada palé se colorea según sea stock normal, zona de punto de pedido o stock de seguridad. */
export function WarehouseScene({ stock, cons, plazo, ss, kgPale, dia }: { stock: number; cons: number; plazo: number; ss: number; kgPale: number; dia: number }) {
  const ok = stock > 0 && cons > 0 && kgPale > 0 && plazo >= 0 && ss >= 0
  const CAP = 120, rop = cons * plazo + ss, queda = Math.max(0, stock - cons * dia)
  const total = Math.min(CAP, Math.ceil(stock / kgPale)), hay = Math.min(CAP, Math.ceil(queda / kgPale))
  const build: Build = (g) => {
    const NX = 10, NZ = 4, by: Record<number, [number, number, number][]> = { [GOOD]: [], [AMBER]: [], [RED]: [] }, gone: [number, number, number][] = [], shelves: [number, number, number][] = []
    for (let z = 0; z < NZ; z++) for (let l = 0; l < 3; l++) shelves.push([(NX - 1) * 0.7, l * 1.7 - 0.03, z * 2.6])
    for (let i = 0; i < total; i++) {
      const z = i % NZ, r = Math.floor(i / NZ), x = r % NX, l = Math.floor(r / NX)
      const at: [number, number, number] = [x * 1.4, l * 1.7, z * 2.6]
      if (i >= hay) gone.push(at); else by[i * kgPale < ss ? RED : i * kgPale < rop ? AMBER : GOOD].push(at)
    }
    instanced(new THREE.BoxGeometry(NX * 1.4, 0.06, 1.0), mat(STEEL), shelves, g)
    const pg = new THREE.BoxGeometry(1.15, 1.25, 0.8).translate(0, 0.625, 0)
    for (const c of [GOOD, AMBER, RED]) instanced(pg, mat(c), by[c], g)
    instanced(new THREE.BoxGeometry(1.15, 0.04, 0.8).translate(0, 0.02, 0), mat(0x6f655d, { transparent: true, opacity: 0.35 }), gone, g)
    return { center: [(NX - 1) * 0.7, 2, (NZ - 1) * 1.3], radius: 9 }
  }
  if (!ok) return <p className="muted small">Completá stock, consumo, plazo y peso por palé para ver el almacén.</p>
  const estado = queda <= 0 ? ['Rotura de stock: no queda producto.', 'bad'] : queda <= ss ? ['Estás consumiendo el stock de seguridad.', 'bad'] : queda <= rop ? ['Por debajo del punto de pedido: el pedido ya tendría que estar lanzado.', 'mid'] : ['Por encima del punto de pedido.', 'ok']
  return <><Scene3D build={build} deps={[stock, cons, plazo, ss, kgPale, dia]} height={340} />
    <p className="small"><span className={'dot ' + estado[1]} /> <b>Día {dia}:</b> quedan {fmt(queda)} kg ({hay} palés). {estado[0]} Punto de pedido: {fmt(rop)} kg. Si pedís hoy, la mercancía llega el día {dia + plazo}; el stock se agota el día {Math.floor(stock / cons)}.
      {Math.ceil(stock / kgPale) > CAP && <span className="muted"> Se dibujan como máximo {CAP} palés.</span>}</p>
    <p className="small muted"><span className="k calc">Verde</span> stock normal · <span className="k supuesto">Ámbar</span> hay que haber pedido · <span className="k pendiente">Rojo</span> stock de seguridad · en gris, huecos ya consumidos.</p></>
}

/** Cámara de fresco: las cajas cambian de color a medida que se agota la vida útil. */
export function ColdRoomScene({ kg, venta, vida, coste, liq, dia }: { kg: number; venta: number; vida: number; coste: number; liq: number; dia: number }) {
  const ok = kg > 0 && venta >= 0 && vida > 0
  const KGC = 20, CAP = 200, total = Math.min(CAP, Math.ceil(kg / KGC)), queda = Math.max(0, kg - venta * Math.min(dia, vida)), hay = Math.min(CAP, Math.ceil(queda / KGC))
  const f = Math.min(1, dia / vida), caducado = dia > vida
  const color = caducado ? 0x5a5a5a : new THREE.Color(GOOD).lerp(new THREE.Color(f < 0.5 ? AMBER : RED), f < 0.5 ? f * 2 : (f - 0.5) * 2).getHex()
  const build: Build = (g) => {
    const NX = 8, NZ = 5, on: [number, number, number][] = [], off: [number, number, number][] = []
    for (let i = 0; i < total; i++) { const x = i % NX, z = Math.floor(i / NX) % NZ, l = Math.floor(i / (NX * NZ)); (i < hay ? on : off).push([x * 0.85, l * 0.27, z * 0.65]) }
    const bg = new THREE.BoxGeometry(0.8, 0.25, 0.6).translate(0, 0.125, 0)
    instanced(bg, mat(color), on, g)
    instanced(new THREE.BoxGeometry(0.8, 0.02, 0.6).translate(0, 0.01, 0), mat(0x6f655d, { transparent: true, opacity: 0.3 }), off.filter((p) => p[1] === 0), g)
    outline(NX * 0.85 + 0.6, 2.6, NZ * 0.65 + 0.6, [(NX - 1) * 0.425, 1.3, (NZ - 1) * 0.325], g, 0x1f5f99)
    return { center: [(NX - 1) * 0.425, 0.8, (NZ - 1) * 0.325], radius: 4.6 }
  }
  if (!ok) return <p className="muted small">Completá los kilos comprados, la venta diaria y la vida útil.</p>
  const sobrante = Math.max(0, kg - venta * vida)
  return <><Scene3D build={build} deps={[kg, venta, vida, dia]} />
    <p className="small"><b>Día {dia} de {vida}:</b> quedan {fmt(queda)} kg sin vender ({hay} cajas de {KGC} kg). {caducado ? `Vida útil agotada: esos ${fmt(queda)} kg ya no se pueden vender como frescos.` : `Vida útil consumida: ${Math.round(f * 100)} %.`}</p>
    <p className="small">{sobrante > 0 ? <>A este ritmo sobrarán <b>{fmt(sobrante)} kg</b>. Si se liquidan a {g(liq)} €/kg, la pérdida es de <b>{fmt(sobrante * (coste - liq))} €</b>.</> : <>A este ritmo se vende todo el día {Math.ceil(kg / venta)}, antes de que caduque.</>} <span className="muted">Cada caja representa {KGC} kg; el color pasa de verde a rojo según se acerca la caducidad.</span></p></>
}

/** La merma de tueste a la vista: cada bloque son 60 kg. Los huecos son el peso que se evapora. */
export function RoastScene({ sacos, merma, gramos }: { sacos: number; merma: number; gramos: number }) {
  const ok = sacos > 0 && sacos <= 400 && merma >= 0 && merma < 100 && gramos > 0
  const verde = sacos * 60, tost = verde * (1 - merma / 100), bloques = Math.round(tost / 60), paquetes = Math.floor(tost / (gramos / 1000)), PP = 960
  const pales = Math.ceil(paquetes / PP)
  const build: Build = (g) => {
    const NX = 20, pos = (i: number, z: number, sx = 0.62, sy = 0.42): [number, number, number] => [(i % NX) * sx, Math.floor(i / NX) % 5 * sy, z + Math.floor(i / (NX * 5)) * 0.62]
    const a: [number, number, number][] = [], b: [number, number, number][] = [], gh: [number, number, number][] = [], c: [number, number, number][] = []
    for (let i = 0; i < sacos; i++) { a.push(pos(i, 0)); (i < bloques ? b : gh).push(pos(i, 4)) }
    for (let i = 0; i < Math.min(pales, 40); i++) c.push([(i % 10) * 1.35, 0, 8 + Math.floor(i / 10) * 1])
    const bg = new THREE.BoxGeometry(0.58, 0.38, 0.56).translate(0, 0.19, 0)
    instanced(new THREE.SphereGeometry(0.5, 10, 8).scale(0.6, 0.4, 0.58).translate(0, 0.2, 0), mat(0x7a8f5a), a, g)
    instanced(bg, mat(0x5b3a29), b, g)
    instanced(bg, mat(RED, { transparent: true, opacity: 0.18, depthWrite: false }), gh, g)
    instanced(new THREE.BoxGeometry(1.2, 1.3, 0.8).translate(0, 0.65, 0), mat(CARTON), c, g)
    return { center: [6, 0.8, 4.5], radius: 9.5 }
  }
  if (!ok) return <p className="muted small">Introducí los sacos (hasta 400), la merma y el formato del paquete.</p>
  return <><Scene3D build={build} deps={[sacos, merma, gramos]} height={340} />
    <p className="small"><b>Fila 1, café verde:</b> {sacos} sacos = {fmt(verde)} kg. <b>Fila 2, café tostado:</b> {fmt(tost)} kg; los {sacos - bloques} bloques en rojo translúcido son los {fmt(verde - tost)} kg que se evaporan. <b>Fila 3, envasado:</b> {fmt(paquetes)} paquetes de {gramos} g en {pales} palé{pales === 1 ? '' : 's'} (a {PP} paquetes por palé, simulado).</p>
    <p className="small muted">Pagaste y transportaste toda la fila 1; solo vendés la fila 2. Por eso el coste por kilo tostado se obtiene dividiendo entre {g(1 - merma / 100)}, no sumando un {merma} %.</p></>
}
