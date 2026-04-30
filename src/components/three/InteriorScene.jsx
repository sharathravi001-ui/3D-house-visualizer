import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

/* ─── Thin material helper ─── */
function M({ color, roughness = 0.8, metalness = 0, opacity = 1 }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      transparent={opacity < 1}
      opacity={opacity}
    />
  )
}

/* ─── Box shorthand ─── */
function Box({ pos, size, children }) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      {children}
    </mesh>
  )
}

/* ─── Room shell (walls, floor, ceiling) ─── */
function RoomShell({ room }) {
  const { w, d, h, floorColor, wallColor, ceilingColor, accentWall } = room
  const t = 0.18  // wall thickness

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <M color={floorColor} roughness={0.65} />
      </mesh>
      {/* Floor gloss overlay for hardwood feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <M color={floorColor} roughness={0.35} metalness={0.05} opacity={0.4} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[w, d]} />
        <M color={ceilingColor} roughness={0.9} />
      </mesh>

      {/* Back wall (accent) */}
      <mesh position={[0, h / 2, -d / 2]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <M color={accentWall} roughness={0.85} />
      </mesh>

      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, h / 2, d / 2]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <M color={wallColor} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-w / 2, h / 2, 0]} receiveShadow>
        <planeGeometry args={[d, h]} />
        <M color={wallColor} roughness={0.85} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[w / 2, h / 2, 0]} receiveShadow>
        <planeGeometry args={[d, h]} />
        <M color={wallColor} roughness={0.85} />
      </mesh>

      {/* Baseboard */}
      {[
        [0, d / 2 - t / 2, [w, 0.4, t]],
        [0, -d / 2 + t / 2, [w, 0.4, t]],
        [-w / 2 + t / 2, 0, [t, 0.4, d]],
        [w / 2 - t / 2, 0, [t, 0.4, d]],
      ].map(([x, z, size], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <boxGeometry args={size} />
          <M color="#F5F0E8" roughness={0.5} />
        </mesh>
      ))}

      {/* Window opening (rear wall center) */}
      <mesh position={[0, h * 0.55, -d / 2 - 0.01]}>
        <planeGeometry args={[Math.min(w * 0.45, 6), 4.5]} />
        <meshStandardMaterial color="#7BA7BC" roughness={0.05} transparent opacity={0.55} />
      </mesh>
      {/* Window frame */}
      <mesh position={[0, h * 0.55, -d / 2 + 0.02]}>
        <boxGeometry args={[Math.min(w * 0.45, 6) + 0.3, 4.8, 0.18]} />
        <M color="#F5F0E8" roughness={0.5} />
      </mesh>

      {/* Ceiling light fixture */}
      <mesh position={[0, h - 0.15, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
        <M color="#E8E0D0" roughness={0.3} />
      </mesh>
    </>
  )
}

/* ─── Living Room Furniture ─── */
function LivingFurniture({ w, d }) {
  return (
    <>
      {/* Area rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]}>
        <planeGeometry args={[10, 8]} />
        <M color="#8B7355" roughness={1} />
      </mesh>

      {/* Sofa */}
      <group position={[0, 0, -d / 2 + 3.5]}>
        <Box pos={[0, 1.25, 0]} size={[8, 2.5, 3.5]}>
          <M color="#5D4037" roughness={0.85} />
        </Box>
        {/* Back cushions */}
        <Box pos={[0, 2.8, -1.4]} size={[8, 1.4, 0.7]}>
          <M color="#6D4C41" roughness={0.85} />
        </Box>
        {/* Arms */}
        <Box pos={[-4.2, 1.8, 0]} size={[0.6, 3, 3.5]}>
          <M color="#5D4037" roughness={0.85} />
        </Box>
        <Box pos={[4.2, 1.8, 0]} size={[0.6, 3, 3.5]}>
          <M color="#5D4037" roughness={0.85} />
        </Box>
        {/* Seat cushions */}
        {[-2.5, 0, 2.5].map((x, i) => (
          <Box key={i} pos={[x, 2.6, 0.2]} size={[2.4, 0.4, 3]}>
            <M color="#795548" roughness={0.75} />
          </Box>
        ))}
        {/* Throw pillows */}
        <Box pos={[-2.5, 3.1, -0.5]} size={[1.5, 1.5, 0.4]}>
          <M color="#C8A882" roughness={0.8} />
        </Box>
        <Box pos={[2.5, 3.1, -0.5]} size={[1.5, 1.5, 0.4]}>
          <M color="#8D6E63" roughness={0.8} />
        </Box>
      </group>

      {/* Coffee table */}
      <Box pos={[0, 1, 2.5]} size={[5, 0.2, 2.5]}>
        <M color="#4E342E" roughness={0.4} metalness={0.05} />
      </Box>
      {/* Table legs */}
      {[[-2, 1], [2, 1], [-2, -1], [2, -1]].map(([x, z], i) => (
        <Box key={i} pos={[x, 0.5, 2.5 + z * 0.4]} size={[0.2, 1, 0.2]}>
          <M color="#3E2723" roughness={0.6} />
        </Box>
      ))}

      {/* TV unit */}
      <Box pos={[0, 0.8, -d / 2 + 0.3]} size={[9, 1.6, 0.6]}>
        <M color="#212121" roughness={0.3} metalness={0.1} />
      </Box>
      {/* TV screen */}
      <Box pos={[0, 3.5, -d / 2 + 0.25]} size={[6.5, 3.8, 0.12]}>
        <M color="#0A0A0A" roughness={0.05} metalness={0.2} />
      </Box>

      {/* Accent chairs */}
      {[-5.5, 5.5].map((x, i) => (
        <group key={i} position={[x, 0, 3]}>
          <Box pos={[0, 1.1, 0]} size={[2.5, 2.2, 2.5]}>
            <M color="#BF8C6A" roughness={0.8} />
          </Box>
          <Box pos={[0, 2.5, -1.1]} size={[2.5, 0.8, 0.4]}>
            <M color="#BF8C6A" roughness={0.8} />
          </Box>
        </group>
      ))}

      {/* Floor lamp */}
      <group position={[-w / 2 + 2, 0, -d / 2 + 3]}>
        <Box pos={[0, 4, 0]} size={[0.08, 8, 0.08]}>
          <M color="#9E9E9E" roughness={0.4} metalness={0.5} />
        </Box>
        <Box pos={[0, 7.8, 0]} size={[1.2, 1, 1.2]}>
          <M color="#F5F5DC" roughness={0.3} />
        </Box>
      </group>
    </>
  )
}

/* ─── Kitchen Furniture ─── */
function KitchenFurniture({ w, d }) {
  const cW = 0.8  // cabinet depth
  const cH = 3   // lower cabinet height
  return (
    <>
      {/* Lower cabinets — back wall */}
      <Box pos={[0, cH / 2, -d / 2 + cW / 2]} size={[w - 1, cH, cW]}>
        <M color="#F5F0E8" roughness={0.6} />
      </Box>
      {/* Countertop */}
      <Box pos={[0, cH + 0.1, -d / 2 + cW / 2 + 0.05]} size={[w - 1, 0.2, cW + 0.15]}>
        <M color="#E0E0E0" roughness={0.25} metalness={0.05} />
      </Box>
      {/* Upper cabinets */}
      <Box pos={[0, cH + 2.5, -d / 2 + cW * 0.3]} size={[w - 2, 2.5, cW * 0.65]}>
        <M color="#F5F0E8" roughness={0.6} />
      </Box>

      {/* Lower cabinets — side wall (right) */}
      <Box pos={[w / 2 - cW / 2, cH / 2, 0]} size={[cW, cH, d - 1]}>
        <M color="#F5F0E8" roughness={0.6} />
      </Box>
      <Box pos={[w / 2 - cW / 2 - 0.05, cH + 0.1, 0]} size={[cW + 0.15, 0.2, d - 1]}>
        <M color="#E0E0E0" roughness={0.25} metalness={0.05} />
      </Box>
      <Box pos={[w / 2 - cW * 0.3, cH + 2.5, 0]} size={[cW * 0.65, 2.5, d - 2]}>
        <M color="#F5F0E8" roughness={0.6} />
      </Box>

      {/* Island */}
      <Box pos={[0, cH / 2, 2]} size={[5.5, cH, 2.8]}>
        <M color="#F0F0F0" roughness={0.55} />
      </Box>
      <Box pos={[0, cH + 0.1, 2]} size={[5.5, 0.2, 2.8]}>
        <M color="#D0D0D0" roughness={0.2} metalness={0.1} />
      </Box>
      {/* Island pendants */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <group key={i} position={[x, 0, 2]}>
          <Box pos={[0, 7, 0]} size={[0.05, 2, 0.05]}>
            <M color="#9E9E9E" roughness={0.4} metalness={0.6} />
          </Box>
          <Box pos={[0, 6, 0]} size={[0.5, 0.6, 0.5]}>
            <M color="#CFB27A" roughness={0.3} metalness={0.3} />
          </Box>
        </group>
      ))}

      {/* Fridge */}
      <Box pos={[-w / 2 + 1.2, 4.2, -d / 2 + 1]} size={[2.4, 8, 2]}>
        <M color="#E8E8E8" roughness={0.3} metalness={0.15} />
      </Box>
      {/* Stove */}
      <Box pos={[3, cH / 2, -d / 2 + cW / 2]} size={[2.5, cH, cW]}>
        <M color="#2C2C2C" roughness={0.35} metalness={0.2} />
      </Box>
    </>
  )
}

/* ─── Dining Furniture ─── */
function DiningFurniture({ w, d }) {
  return (
    <>
      {/* Table */}
      <Box pos={[0, 2.5, 0]} size={[6, 0.2, 3]}>
        <M color="#5D4037" roughness={0.45} metalness={0.05} />
      </Box>
      {/* Table legs */}
      {[[-2.5, -1], [2.5, -1], [-2.5, 1], [2.5, 1]].map(([x, z], i) => (
        <Box key={i} pos={[x, 1.25, z]} size={[0.2, 2.5, 0.2]}>
          <M color="#4E342E" roughness={0.5} />
        </Box>
      ))}
      {/* Chairs */}
      {[
        [-3.5, 0, 0],
        [3.5, 0, Math.PI],
        [0, -2.2, Math.PI / 2],
        [0, 2.2, -Math.PI / 2],
        [-2.5, -2.2, Math.PI / 2],
        [2.5, -2.2, Math.PI / 2],
      ].map(([x, z, rot], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, rot, 0]}>
          <Box pos={[0, 1.2, 0]} size={[1.8, 2.4, 1.8]}>
            <M color="#BF8C6A" roughness={0.8} />
          </Box>
          <Box pos={[0, 2.8, -0.8]} size={[1.8, 1.6, 0.3]}>
            <M color="#BF8C6A" roughness={0.8} />
          </Box>
        </group>
      ))}
      {/* Chandelier */}
      <group position={[0, 0, 0]}>
        <Box pos={[0, 7.5, 0]} size={[0.08, 1.5, 0.08]}>
          <M color="#9E9E9E" roughness={0.3} metalness={0.6} />
        </Box>
        <Box pos={[0, 6.7, 0]} size={[3.5, 0.2, 3.5]}>
          <M color="#CFB27A" roughness={0.3} metalness={0.4} />
        </Box>
        {[[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].map(([x, z], i) => (
          <Box key={i} pos={[x, 6.4, z]} size={[0.3, 0.8, 0.3]}>
            <M color="#FFF8E1" roughness={0.2} metalness={0.1} />
          </Box>
        ))}
      </group>
    </>
  )
}

/* ─── Master Bedroom Furniture ─── */
function MasterFurniture({ w, d }) {
  return (
    <>
      {/* Area rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[10, 8]} />
        <M color="#6D4C41" roughness={1} />
      </mesh>

      {/* Bed frame */}
      <group position={[0, 0, -d / 2 + 4.5]}>
        {/* Mattress */}
        <Box pos={[0, 2.2, 0]} size={[7, 1.4, 8]}>
          <M color="#FAFAF8" roughness={0.8} />
        </Box>
        {/* Headboard */}
        <Box pos={[0, 3.5, -3.8]} size={[7, 3, 0.5]}>
          <M color="#5D4037" roughness={0.7} />
        </Box>
        {/* Bed base */}
        <Box pos={[0, 1, 0]} size={[7.2, 2, 8.2]}>
          <M color="#4E342E" roughness={0.8} />
        </Box>
        {/* Pillows */}
        {[-1.5, 1.5].map((x, i) => (
          <Box key={i} pos={[x, 3.15, -2.8]} size={[2.5, 0.8, 1.5]}>
            <M color="#FFFFFF" roughness={0.7} />
          </Box>
        ))}
        {/* Duvet */}
        <Box pos={[0, 3.05, 0.5]} size={[6.8, 0.5, 5]}>
          <M color="#C8B8A0" roughness={0.85} />
        </Box>
      </group>

      {/* Nightstands */}
      {[-4.5, 4.5].map((x, i) => (
        <group key={i} position={[x, 0, -d / 2 + 4.5]}>
          <Box pos={[0, 1.8, 0]} size={[2, 3.6, 2]}>
            <M color="#4E342E" roughness={0.65} />
          </Box>
          {/* Lamp */}
          <Box pos={[0, 4, 0]} size={[0.12, 2, 0.12]}>
            <M color="#9E9E9E" roughness={0.3} metalness={0.5} />
          </Box>
          <Box pos={[0, 4.8, 0]} size={[1.2, 1.5, 1.2]}>
            <M color="#FFF8DC" roughness={0.3} />
          </Box>
        </group>
      ))}

      {/* Dresser */}
      <Box pos={[w / 2 - 2, 2.5, 0]} size={[3.5, 5, 1.8]}>
        <M color="#4E342E" roughness={0.65} />
      </Box>
      {/* Mirror above dresser */}
      <Box pos={[w / 2 - 2, 6, -0.8]} size={[3.5, 4, 0.1]}>
        <M color="#B0BEC5" roughness={0.05} metalness={0.4} />
      </Box>

      {/* Accent chair */}
      <group position={[-w / 2 + 2.5, 0, d / 2 - 3]}>
        <Box pos={[0, 1.3, 0]} size={[2.5, 2.6, 2.5]}>
          <M color="#8D6E63" roughness={0.8} />
        </Box>
        <Box pos={[0, 2.8, -1.1]} size={[2.5, 1.2, 0.4]}>
          <M color="#8D6E63" roughness={0.8} />
        </Box>
      </group>
    </>
  )
}

/* ─── Generic Bedroom Furniture ─── */
function BedroomFurniture({ w, d }) {
  return (
    <>
      {/* Bed */}
      <group position={[0, 0, -d / 2 + 4]}>
        <Box pos={[0, 2.1, 0]} size={[5.5, 1.4, 6.5]}>
          <M color="#FAFAF8" roughness={0.8} />
        </Box>
        <Box pos={[0, 3.2, -3]} size={[5.5, 2.4, 0.4]}>
          <M color="#5D4037" roughness={0.7} />
        </Box>
        <Box pos={[0, 0.9, 0]} size={[5.7, 1.8, 6.7]}>
          <M color="#4E342E" roughness={0.8} />
        </Box>
        {/* Duvet */}
        <Box pos={[0, 2.95, 0.5]} size={[5.3, 0.45, 4]}>
          <M color="#B8C8D8" roughness={0.85} />
        </Box>
        {/* Pillow */}
        <Box pos={[0, 2.95, -2]} size={[4, 0.7, 1.2]}>
          <M color="#FFFFFF" roughness={0.7} />
        </Box>
      </group>

      {/* Desk */}
      <group position={[w / 2 - 2.5, 0, d / 2 - 2]}>
        <Box pos={[0, 2.5, 0]} size={[4, 0.2, 2]}>
          <M color="#795548" roughness={0.5} />
        </Box>
        {[[-1.6, -0.8], [1.6, -0.8], [-1.6, 0.8], [1.6, 0.8]].map(([x, z], i) => (
          <Box key={i} pos={[x, 1.25, z]} size={[0.15, 2.5, 0.15]}>
            <M color="#5D4037" roughness={0.6} />
          </Box>
        ))}
        {/* Chair */}
        <group position={[0, 0, 1.5]}>
          <Box pos={[0, 1.8, 0]} size={[2, 0.2, 2]}>
            <M color="#37474F" roughness={0.7} />
          </Box>
          <Box pos={[0, 2.5, -0.8]} size={[2, 1.5, 0.2]}>
            <M color="#37474F" roughness={0.7} />
          </Box>
          <Box pos={[0, 0.9, 0]} size={[0.15, 1.8, 0.15]}>
            <M color="#455A64" roughness={0.4} metalness={0.3} />
          </Box>
        </group>
      </group>

      {/* Bookshelf */}
      <Box pos={[-w / 2 + 1.5, 4, 0]} size={[2.5, 8, 1]}>
        <M color="#6D4C41" roughness={0.7} />
      </Box>
    </>
  )
}

/* ─── Furniture switcher ─── */
function RoomFurniture({ room }) {
  const { w, d, furniture } = room
  switch (furniture) {
    case 'living':  return <LivingFurniture w={w} d={d} />
    case 'kitchen': return <KitchenFurniture w={w} d={d} />
    case 'dining':  return <DiningFurniture w={w} d={d} />
    case 'master':  return <MasterFurniture w={w} d={d} />
    case 'bedroom': return <BedroomFurniture w={w} d={d} />
    default:        return null
  }
}

/* ─── Lights in room ─── */
function RoomLights({ room }) {
  const { w, d, h } = room
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, h - 0.5, 0]} intensity={60} distance={30} color="#FFF5E0" castShadow />
      <pointLight position={[w / 3, h * 0.6, d / 3]} intensity={20} distance={20} color="#FFF8F0" />
      <pointLight position={[-w / 3, h * 0.6, -d / 3]} intensity={15} distance={20} color="#FFF8F0" />
      {/* Window light */}
      <pointLight position={[0, h * 0.5, -d / 2 + 0.5]} intensity={25} distance={15} color="#C8E0FF" />
    </>
  )
}

/* ─── Main export ─── */
export default function InteriorScene({ room }) {
  const camZ = room.d / 2 - 1.5
  const camY = room.h * 0.45

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, camY, camZ], fov: 65, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <RoomLights room={room} />
        <RoomShell room={room} />
        <RoomFurniture room={room} />
        <OrbitControls
          target={[0, room.h * 0.45, 0]}
          minDistance={2}
          maxDistance={room.d * 0.85}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={0.05}
          enablePan={false}
          rotateSpeed={0.4}
        />
      </Suspense>
    </Canvas>
  )
}
