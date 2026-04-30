import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, ContactShadows } from '@react-three/drei'
import HouseExterior from './HouseExterior'
import Landscaping from './Landscaping'

function HouseGroup({ model }) {
  const ld = model.lot.depth
  const frontZ = ld / 2
  const hd = model.house.depth
  const houseZ = frontZ - 22 - hd / 2  // consistent with Landscaping.jsx

  return (
    <group position={[0, 0, houseZ]}>
      <HouseExterior model={model} />
    </group>
  )
}

function Scene({ model }) {
  const ld = model.lot.depth
  const lw = model.lot.width
  const hd = model.house.depth
  const frontZ = ld / 2
  const houseZ = frontZ - 22 - hd / 2
  const houseFrontZ = houseZ + hd / 2

  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 40, 50]}
        inclination={0.49}
        azimuth={0.25}
        turbidity={5}
        rayleigh={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <hemisphereLight skyColor="#87CEEB" groundColor="#4CAF50" intensity={0.4} />
      <directionalLight
        position={[60, 80, 60]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      {/* House */}
      <HouseGroup model={model} />

      {/* Landscaping */}
      <Landscaping lot={model.lot} house={model.house} />

      {/* Ground contact shadows */}
      <ContactShadows
        position={[0, 0.01, houseZ]}
        width={80}
        height={80}
        far={30}
        blur={2}
        opacity={0.35}
      />

      {/* Camera controls */}
      <OrbitControls
        target={[0, 10, houseZ]}
        minDistance={20}
        maxDistance={200}
        maxPolarAngle={Math.PI / 2 - 0.02}
        enablePan
        panSpeed={0.6}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
    </>
  )
}

export default function ExteriorScene({ model }) {
  const ld = model.lot.depth
  const hd = model.house.depth
  const frontZ = ld / 2
  const houseZ = frontZ - 22 - hd / 2

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{
        position: [50, 30, houseZ + hd / 2 + 80],
        fov: 45,
        near: 0.5,
        far: 800,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene model={model} />
      </Suspense>
    </Canvas>
  )
}
