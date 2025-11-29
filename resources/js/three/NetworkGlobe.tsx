// resources/js/three/NetworkGlobe.tsx
"use client"

import React, { useMemo, useRef } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"

interface Node {
  lat: number
  lon: number
  strength: number
}

const latLonToCartesian = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

const GlobeInner: React.FC = () => {
  const groupRef = useRef<THREE.Group | null>(null)
  const nodesRef = useRef<THREE.InstancedMesh | null>(null)
  const linksRef = useRef<THREE.LineSegments | null>(null)

  const radius = 0.9

  const nodes: Node[] = useMemo(
    () => [
      { lat: 31.95, lon: 35.91, strength: 1.0 }, // Amman-ish
      { lat: 51.50, lon: -0.12, strength: 0.9 }, // London-ish
      { lat: 40.71, lon: -74.0, strength: 0.85 }, // NYC-ish
      { lat: 35.68, lon: 139.69, strength: 0.8 }, // Tokyo-ish
      { lat: 48.85, lon: 2.35, strength: 0.75 }, // Paris-ish
      { lat: 52.52, lon: 13.40, strength: 0.7 }, // Berlin-ish
      { lat: 25.20, lon: 55.27, strength: 0.75 }, // Dubai-ish
      { lat: -33.86, lon: 151.20, strength: 0.7 }, // Sydney-ish
      { lat: 37.77, lon: -122.42, strength: 0.7 }, // SF-ish
    ],
    []
  )

  const nodePositions = useMemo(() => {
    return nodes.map((n) => latLonToCartesian(n.lat, n.lon, radius))
  }, [nodes])

  // Precompute link pairs (all-to-all lite)
  const linksPositions = useMemo(() => {
    const positions: number[] = []
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const a = nodePositions[i]
        const b = nodePositions[j]

        positions.push(a.x, a.y, a.z)
        positions.push(b.x, b.y, b.z)
      }
    }
    return new Float32Array(positions)
  }, [nodePositions])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.12
    }

    if (nodesRef.current) {
      const mat = new THREE.Matrix4()
      const color = new THREE.Color()
      const time = t

      for (let i = 0; i < nodes.length; i++) {
        const base = nodePositions[i]
        const n = nodes[i]

        const pulse =
          1 + Math.sin(time * 2.0 + n.strength * 4.0 + i) * 0.18 * n.strength

        const pos = base.clone().multiplyScalar(1.01 + 0.03 * n.strength)

        mat.makeTranslation(pos.x, pos.y, pos.z)
        nodesRef.current.setMatrixAt(i, mat)

        color.setHSL(
          0.83 - n.strength * 0.18,
          0.9,
          0.55 + 0.1 * (pulse - 1)
        )
        // @ts-ignore
        nodesRef.current.setColorAt(i, color)
      }

      nodesRef.current.instanceMatrix.needsUpdate = true
      if (nodesRef.current.instanceColor) {
        nodesRef.current.instanceColor.needsUpdate = true
      }
    }

    if (linksRef.current) {
      const material = linksRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.35 + Math.sin(t * 0.7) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {/* globe */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.4}
          roughness={0.35}
          emissive="#4c1d95"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* latitude / longitude lines */}
      <group>
        {[...Array(6)].map((_, i) => (
          <mesh key={`lat-${i}`}>
            <torusGeometry
              args={[
                radius * Math.cos(((i + 1) * Math.PI) / 14),
                0.0025,
                8,
                80,
              ]}
            />
            <meshBasicMaterial color="#4b5563" transparent opacity={0.45} />
          </mesh>
        ))}
      </group>

      {/* links */}
      <lineSegments ref={linksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linksPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#f973c7"
          transparent
          opacity={0.4}
          linewidth={1}
        />
      </lineSegments>

      {/* nodes */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined as any, undefined as any, nodes.length]}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial
          color="#fb67d9"
          transparent
          opacity={1}
        />
      </instancedMesh>
    </group>
  )
}

export const NetworkGlobe: React.FC = () => {
  return (
    <div className="w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-pink-500/40 bg-black/90">
      <Canvas camera={{ position: [0, 0.5, 2.2], fov: 42 }}>
        <color attach="background" args={["#020014"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[2, 2, 2]}
          intensity={1.2}
          color="#f973c7"
        />
        <directionalLight
          position={[-2, -1, -2]}
          intensity={0.7}
          color="#6366f1"
        />

        <GlobeInner />
      </Canvas>
    </div>
  )
}