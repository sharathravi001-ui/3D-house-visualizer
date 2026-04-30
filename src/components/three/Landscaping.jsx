import { useMemo } from 'react'
import * as THREE from 'three'

function Tree({ x, z, trunkH = 7, foliageR = 3.5, seed = 1 }) {
  const layers = 3
  return (
    <group position={[x, 0, z]}>
      {/* Trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, trunkH, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.95} />
      </mesh>
      {/* Foliage layers */}
      {Array.from({ length: layers }).map((_, i) => {
        const ratio = 1 - i * 0.25
        const yOff = trunkH + i * (foliageR * 0.6)
        return (
          <mesh key={i} position={[0, yOff, 0]} castShadow>
            <coneGeometry args={[foliageR * ratio, foliageR * 1.4 * ratio, 7]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#2E7D32' : '#388E3C'} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

function RoundTree({ x, z, h = 12, r = 4 }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, h / 3, 8]} />
        <meshStandardMaterial color="#4E342E" roughness={0.95} />
      </mesh>
      <mesh position={[0, h * 0.6, 0]} castShadow>
        <sphereGeometry args={[r, 10, 8]} />
        <meshStandardMaterial color="#388E3C" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, h * 0.7, 0.8]} castShadow>
        <sphereGeometry args={[r * 0.7, 8, 7]} />
        <meshStandardMaterial color="#43A047" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Bush({ x, z, r = 1.5 }) {
  return (
    <group position={[x, r * 0.5, z]}>
      <mesh castShadow>
        <sphereGeometry args={[r, 7, 6]} />
        <meshStandardMaterial color="#33691E" roughness={0.95} />
      </mesh>
      <mesh position={[r * 0.6, -r * 0.1, 0]} castShadow>
        <sphereGeometry args={[r * 0.75, 7, 6]} />
        <meshStandardMaterial color="#558B2F" roughness={0.95} />
      </mesh>
    </group>
  )
}

/* Concrete step/slab */
function Slab({ x, y, z, w, d, h = 0.25, color = '#C0B8A8' }) {
  return (
    <mesh position={[x, y, z]} receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  )
}

export default function Landscaping({ lot, house }) {
  const lw = lot.width   // e.g. 33.9
  const ld = lot.depth   // e.g. 142.9
  const hw = house.width
  const hd = house.depth

  // lot center = [0,0,0]; front at z=+ld/2, back at z=-ld/2
  const frontZ = ld / 2
  const backZ  = -ld / 2

  // House front face is at z = houseZ + hd/2
  // We'll place house center at z = frontZ - 22 (22ft setback)
  const houseZ  = frontZ - 22 - hd / 2   // center of house
  const houseFrontZ = houseZ + hd / 2    // front face of house
  const garageLeftX = -(hw / 2 - house.garageW / 2)

  return (
    <group>
      {/* ── Lot ground (grass) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[lw, ld]} />
        <meshStandardMaterial color="#4CAF50" roughness={1} />
      </mesh>

      {/* ── Sidewalk at street (front of lot) ── */}
      <mesh position={[0, 0.02, frontZ - 2]} receiveShadow>
        <boxGeometry args={[lw, 0.08, 4]} />
        <meshStandardMaterial color="#BDBDBD" roughness={0.9} />
      </mesh>

      {/* ── Driveway: from sidewalk to garage ── */}
      <mesh position={[garageLeftX, 0.04, (frontZ + houseFrontZ) / 2]} receiveShadow>
        <boxGeometry args={[house.garageW - 0.5, 0.1, frontZ - houseFrontZ]} />
        <meshStandardMaterial color="#9E9E9E" roughness={0.85} />
      </mesh>

      {/* ── Front walkway: from sidewalk to front door ── */}
      <mesh position={[7.5, 0.04, (frontZ - 2 + houseFrontZ + house.porchD) / 2]} receiveShadow>
        <boxGeometry args={[2.5, 0.1, frontZ - 2 - (houseFrontZ + house.porchD)]} />
        <meshStandardMaterial color="#C0B8A8" roughness={0.9} />
      </mesh>

      {/* Porch step */}
      <Slab x={7.5} y={0.12} z={houseFrontZ + house.porchD + 0.6} w={3} d={1.2} />

      {/* ── Front lawn / garden strip along house ── */}
      <mesh position={[0, 0.04, houseFrontZ + 4]} receiveShadow>
        <boxGeometry args={[hw, 0.1, 8]} />
        <meshStandardMaterial color="#388E3C" roughness={1} />
      </mesh>

      {/* ── Foundation bushes ── */}
      {[
        [garageLeftX - 2, houseFrontZ + 0.5],
        [garageLeftX + house.garageW / 2 + 2, houseFrontZ + 0.5],
        [5, houseFrontZ + 0.5],
        [10, houseFrontZ + 0.5],
        [11.5, houseFrontZ + 2],
        [-11, houseFrontZ + 2],
        [-8, houseFrontZ + 2],
      ].map(([x, z], i) => (
        <Bush key={i} x={x} z={z} r={1.2 + (i % 3) * 0.3} />
      ))}

      {/* ── Front yard trees ── */}
      <RoundTree x={-10} z={frontZ - 12} h={14} r={4.5} />
      <Tree x={12} z={frontZ - 10} trunkH={8} foliageR={3.5} />

      {/* ── Side yard trees ── */}
      <RoundTree x={-lw / 2 + 3} z={houseZ - 5} h={18} r={6} />
      <RoundTree x={-lw / 2 + 3} z={houseZ + 8} h={16} r={5} />
      <Tree x={lw / 2 - 3} z={houseZ} trunkH={9} foliageR={4} />

      {/* ── Back yard trees ── */}
      <RoundTree x={-8}  z={backZ + 20} h={22} r={7} />
      <RoundTree x={5}   z={backZ + 15} h={20} r={6} />
      <Tree      x={10}  z={backZ + 18} trunkH={10} foliageR={4.5} />
      <RoundTree x={-2}  z={backZ + 30} h={18} r={6} />

      {/* ── Back patio ── */}
      <mesh position={[0, 0.04, houseZ - hd / 2 - 8]} receiveShadow>
        <boxGeometry args={[18, 0.12, 16]} />
        <meshStandardMaterial color="#BCAAA4" roughness={0.85} />
      </mesh>

      {/* ── Fence posts along side lot lines (sampled) ── */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-lw / 2 + 0.05, 2, frontZ - 25 - i * 9]} castShadow>
          <boxGeometry args={[0.12, 4, 0.12]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.95} />
        </mesh>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[lw / 2 - 0.05, 2, frontZ - 25 - i * 9]} castShadow>
          <boxGeometry args={[0.12, 4, 0.12]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}
