// resources/js/three/MiniPointCloud.tsx
"use client"

import React, { useMemo, useRef } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"

type CloudProps = {
  color?: string
}

const InnerPointCloud: React.FC<CloudProps> = ({ color = "#fb67d9" }) => {
  const pointsRef = useRef<THREE.Points | null>(null)

  const count = 1600

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Radial distribution with clusters
      const radius = 0.6 + Math.random() * 0.8
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 0.5

      const clusterBias = Math.random()
      const clusterOffset =
        clusterBias < 0.3 ? 0.3 : clusterBias > 0.7 ? -0.3 : 0

      const x = Math.cos(angle + clusterOffset) * radius
      const z = Math.sin(angle + clusterOffset) * radius
      const y = height

      arr[i3 + 0] = x
      arr[i3 + 1] = y
      arr[i3 + 2] = z
    }

    return arr
  }, [])

  const baseColors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const c = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const t = Math.random()

      // Neon gradient-ish
      c.setHSL(0.9 - t * 0.15, 0.9, 0.55)

      arr[i3 + 0] = c.r
      arr[i3 + 1] = c.g
      arr[i3 + 2] = c.b
    }

    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!pointsRef.current) return

    const group = pointsRef.current
    group.rotation.y = t * 0.18
    group.rotation.x = Math.sin(t * 0.2) * 0.12

    const geom = group.geometry
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = posAttr.array[i3 + 0] as number
      const y = posAttr.array[i3 + 1] as number
      const z = posAttr.array[i3 + 2] as number

      const r = Math.sqrt(x * x + z * z)
      const wave = Math.sin(r * 6.0 - t * 2.0) * 0.02

      posAttr.array[i3 + 1] = y + wave
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[baseColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export const MiniPointCloud: React.FC = () => {
  return (
    <div className="w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-pink-500/40 bg-black/90">
      <Canvas
        camera={{ position: [0.7, 0.9, 1.8], fov: 40, near: 0.1, far: 10 }}
      >
        <color attach="background" args={["#020015"]} />
        <fog attach="fog" args={["#020015", 1.5, 5]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 2]} intensity={1.3} color="#f973c7" />
        <pointLight position={[-2, -1, -3]} intensity={0.6} color="#6366f1" />

        <group position={[0, -0.1, 0]}>
          {/* faint cross grid */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
            <circleGeometry args={[1.6, 48]} />
            <meshBasicMaterial
              color="#27272f"
              transparent
              opacity={0.35}
              wireframe
            />
          </mesh>

          <InnerPointCloud />
        </group>
      </Canvas>
    </div>
  )
}