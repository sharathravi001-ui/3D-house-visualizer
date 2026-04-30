import { useMemo } from 'react'
import * as THREE from 'three'

/* ── Material helpers ── */
function mat(color, roughness = 0.85, metalness = 0) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
}

/* ── Gable Roof (ExtrudeGeometry prism) ── */
function GableRoof({ houseW, houseD, peakH, overhang, y }) {
  const geo = useMemo(() => {
    const w = houseW + overhang * 2
    const d = houseD + overhang * 2
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, 0)
    shape.lineTo(w / 2, 0)
    shape.lineTo(0, peakH)
    shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false })
    g.translate(0, 0, -d / 2)
    return g
  }, [houseW, houseD, peakH, overhang])

  return (
    <mesh geometry={geo} position={[0, y, 0]} castShadow receiveShadow>
      {mat('#1C1C1C', 0.92)}
    </mesh>
  )
}

/* ── Single window unit ── */
function Window({ w = 3, h = 4, pos, rot = [0, 0, 0] }) {
  return (
    <group position={pos} rotation={rot}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[w + 0.25, h + 0.25, 0.15]} />
        {mat('#F5F0E8', 0.5)}
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[w, h, 0.05]} />
        <meshStandardMaterial
          color="#7BA7BC"
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.72}
        />
      </mesh>
      {/* Mullion */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.08, h, 0.06]} />
        {mat('#F5F0E8', 0.5)}
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[w, 0.08, 0.06]} />
        {mat('#F5F0E8', 0.5)}
      </mesh>
    </group>
  )
}

/* ── Garage door panel ── */
function GarageDoor({ w = 8.5, h = 7.5, pos }) {
  const panels = 4
  const ph = h / panels
  return (
    <group position={pos}>
      {Array.from({ length: panels }).map((_, i) => (
        <group key={i} position={[0, i * ph + ph / 2 - h / 2, 0]}>
          <mesh>
            <boxGeometry args={[w, ph - 0.06, 0.18]} />
            {mat('#D8D8D8', 0.6)}
          </mesh>
          {/* Panel inset */}
          <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[w - 0.5, ph - 0.25, 0.05]} />
            {mat('#C8C8C8', 0.7)}
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ── Column (porch) ── */
function Column({ x, y0, height }) {
  return (
    <mesh position={[x, y0 + height / 2, 0]} castShadow>
      <cylinderGeometry args={[0.25, 0.28, height, 8]} />
      {mat('#FAFAF5', 0.55)}
    </mesh>
  )
}

/* ── Main HouseExterior component ── */
export default function HouseExterior({ model }) {
  const h = model.house
  const totalH = h.floor1H + h.floor2H  // 18 ft

  // House is centered at X=0; front face at Z = +houseD/2
  const hFrontZ = h.depth / 2

  // Garage occupies left portion of front face
  const garageOffX = -(h.width / 2 - h.garageW / 2)  // left-biased
  const garageFrontZ = hFrontZ + (h.garageD - h.depth) / 2  // garage protrudes slightly

  return (
    <group>
      {/* ── Foundation strip ── */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[h.width + 0.4, 1, h.depth + 0.4]} />
        {mat('#8B7355', 0.95)}
      </mesh>

      {/* ── Stone water-table base (first 3.5ft) ── */}
      <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[h.width, 3.5, h.depth]} />
        {mat('#8B7A6A', 0.95)}
      </mesh>

      {/* ── Main floor body (above stone base) ── */}
      <mesh position={[0, 3.5 + (h.floor1H - 3.5) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[h.width, h.floor1H - 3.5, h.depth]} />
        {mat('#C4A882', 0.92)}
      </mesh>

      {/* ── Second floor ── */}
      <mesh position={[0, h.floor1H + h.floor2H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[h.width, h.floor2H, h.depth]} />
        {mat('#D4B896', 0.9)}
      </mesh>

      {/* ── Garage protrusion (front, lower section) ── */}
      <mesh position={[garageOffX, h.garageH / 2, hFrontZ - h.garageD / 2 + h.depth / 2 + (h.garageD - h.depth) / 2]} castShadow receiveShadow>
        <boxGeometry args={[h.garageW, h.garageH, 0.01]} />
        {mat('#C4A882', 0.92)}
      </mesh>

      {/* ── Garage flat roof (since garage is lower than house) ── */}
      <mesh position={[garageOffX, h.garageH + 0.1, hFrontZ + (h.garageD - h.depth) / 2]} castShadow receiveShadow>
        <boxGeometry args={[h.garageW, 0.2, 0.01]} />
        {mat('#1C1C1C', 0.95)}
      </mesh>

      {/* ── Main gable roof ── */}
      <GableRoof
        houseW={h.width}
        houseD={h.depth}
        peakH={h.roofPeak}
        overhang={h.overhang}
        y={totalH}
      />

      {/* ── Roof fascia (trim under eaves) ── */}
      <mesh position={[0, totalH - 0.15, 0]}>
        <boxGeometry args={[h.width + h.overhang * 2, 0.3, h.depth + h.overhang * 2]} />
        {mat('#F5F0E8', 0.6)}
      </mesh>

      {/* ══ WINDOWS — Front face (facing +Z) ══ */}
      {/* Floor 1: Two windows right of garage */}
      <Window w={3} h={4} pos={[5, 4.5, hFrontZ + 0.01]} />
      <Window w={3} h={4} pos={[9.5, 4.5, hFrontZ + 0.01]} />
      {/* Floor 2: Three windows across front */}
      <Window w={3} h={4.5} pos={[-7, 13.5, hFrontZ + 0.01]} />
      <Window w={3.5} h={4.5} pos={[2, 13.5, hFrontZ + 0.01]} />
      <Window w={3} h={4.5} pos={[9, 13.5, hFrontZ + 0.01]} />

      {/* ══ WINDOWS — Side face (left, -X) ══ */}
      <Window w={3} h={4} pos={[-h.width / 2 - 0.01, 4.5, 8]} rot={[0, -Math.PI / 2, 0]} />
      <Window w={3} h={4} pos={[-h.width / 2 - 0.01, 4.5, -4]} rot={[0, -Math.PI / 2, 0]} />
      <Window w={3} h={4.5} pos={[-h.width / 2 - 0.01, 13.5, 6]} rot={[0, -Math.PI / 2, 0]} />
      <Window w={3} h={4.5} pos={[-h.width / 2 - 0.01, 13.5, -5]} rot={[0, -Math.PI / 2, 0]} />

      {/* ══ WINDOWS — Side face (right, +X) ══ */}
      <Window w={3} h={4} pos={[h.width / 2 + 0.01, 4.5, 5]} rot={[0, Math.PI / 2, 0]} />
      <Window w={3} h={4} pos={[h.width / 2 + 0.01, 4.5, -5]} rot={[0, Math.PI / 2, 0]} />
      <Window w={3} h={4.5} pos={[h.width / 2 + 0.01, 13.5, 5]} rot={[0, Math.PI / 2, 0]} />
      <Window w={3} h={4.5} pos={[h.width / 2 + 0.01, 13.5, -5]} rot={[0, Math.PI / 2, 0]} />

      {/* ══ WINDOWS — Rear face ══ */}
      <Window w={4} h={4.5} pos={[-5, 4.5, -hFrontZ - 0.01]} rot={[0, Math.PI, 0]} />
      <Window w={4} h={4.5} pos={[5, 4.5, -hFrontZ - 0.01]} rot={[0, Math.PI, 0]} />
      <Window w={3} h={4.5} pos={[-6, 13.5, -hFrontZ - 0.01]} rot={[0, Math.PI, 0]} />
      <Window w={3} h={4.5} pos={[2, 13.5, -hFrontZ - 0.01]} rot={[0, Math.PI, 0]} />
      <Window w={3} h={4.5} pos={[8, 13.5, -hFrontZ - 0.01]} rot={[0, Math.PI, 0]} />

      {/* ══ GARAGE DOORS (two panels side by side) ══ */}
      <GarageDoor w={8.5} h={7.5} pos={[garageOffX - 4.5, 3.75, hFrontZ + 0.2]} />
      <GarageDoor w={8.5} h={7.5} pos={[garageOffX + 4.5, 3.75, hFrontZ + 0.2]} />

      {/* ══ FRONT DOOR ══ */}
      <group position={[7.5, 4, hFrontZ + 0.15]}>
        {/* Door frame */}
        <mesh>
          <boxGeometry args={[3.2, 7.4, 0.2]} />
          {mat('#F5F0E8', 0.55)}
        </mesh>
        {/* Door panel */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[2.8, 7, 0.1]} />
          {mat('#1A1A2E', 0.7)}
        </mesh>
        {/* Transom window */}
        <mesh position={[0, 4.2, 0.15]}>
          <boxGeometry args={[2.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#7BA7BC" roughness={0.05} transparent opacity={0.75} />
        </mesh>
        {/* Door handle */}
        <mesh position={[-0.7, 0, 0.22]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
          {mat('#C8A84B', 0.3, 0.8)}
        </mesh>
      </group>

      {/* ══ COVERED PORCH ══ */}
      {/* Porch slab */}
      <mesh position={[7.5, 0.1, hFrontZ + h.porchD / 2 + 0.3]} receiveShadow>
        <boxGeometry args={[h.porchW, 0.2, h.porchD]} />
        {mat('#C8C0B0', 0.9)}
      </mesh>
      {/* Porch roof (flat lid) */}
      <mesh position={[7.5, h.porchH, hFrontZ + h.porchD / 2 + 0.3]} castShadow>
        <boxGeometry args={[h.porchW + 0.4, 0.25, h.porchD + 0.4]} />
        {mat('#2C2C2C', 0.9)}
      </mesh>
      {/* Porch columns */}
      {[-3.5, 3.5].map(x => (
        <Column key={x} x={7.5 + x} y0={0.2} height={h.porchH - 0.2} />
      ))}

      {/* ══ CHIMNEY ══ */}
      <mesh position={[-5, totalH + 3, -5]} castShadow>
        <boxGeometry args={[2.5, 6, 2.5]} />
        {mat('#8B7A6A', 0.95)}
      </mesh>
      <mesh position={[-5, totalH + 6.1, -5]}>
        <boxGeometry args={[2.8, 0.2, 2.8]} />
        {mat('#555', 0.9)}
      </mesh>

      {/* ══ CORNER TRIM BOARDS ══ */}
      {[
        [-h.width / 2, h.depth / 2],
        [h.width / 2, h.depth / 2],
        [-h.width / 2, -h.depth / 2],
        [h.width / 2, -h.depth / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, totalH / 2, z]}>
          <boxGeometry args={[0.35, totalH, 0.35]} />
          {mat('#F5F0E8', 0.6)}
        </mesh>
      ))}
    </group>
  )
}
