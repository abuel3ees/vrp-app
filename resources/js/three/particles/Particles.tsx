import * as THREE from "three"
import { useMemo, useState, useRef } from "react"
import { createPortal, useFrame } from "@react-three/fiber"
import { useFBO } from "@react-three/drei"
import * as easing from "maath/easing"

import { DofPointsMaterial } from "../materials/DofPointsMaterial"
import { SimulationMaterial } from "../materials/SimulationMaterial"

interface ParticlesProps {
  speed: number
  aperture: number
  focus: number
  size: number
  noiseScale?: number
  noiseIntensity?: number
  timeScale?: number
  pointSize?: number
  opacity?: number
  planeScale?: number
  useManualTime?: boolean
  manualTime?: number
  introspect?: boolean
}

export function Particles({
  speed,
  aperture,
  focus,
  size = 512,
  noiseScale = 1.0,
  noiseIntensity = 0.5,
  timeScale = 0.5,
  pointSize = 2.0,
  opacity = 1.0,
  planeScale = 1.0,
  useManualTime = false,
  manualTime = 0,
  introspect = false,
  ...props
}: ParticlesProps) {
  // ---------------------------------------------------------------------------
  // Reveal animation parameters
  // ---------------------------------------------------------------------------
  const revealStartTime = useRef<number | null>(null)
  const [isRevealing, setIsRevealing] = useState(true)
  const revealDuration = 3.5 // seconds

  // ---------------------------------------------------------------------------
  // Simulation setup (GPGPU)
  // ---------------------------------------------------------------------------
  const simulationMaterial = useMemo(
    () => new SimulationMaterial(planeScale),
    [planeScale]
  )

  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

  const dofPointsMaterial = useMemo(() => {
    const m = new DofPointsMaterial()
    m.uniforms.positions.value = target.texture
    m.uniforms.initialPositions.value =
      simulationMaterial.uniforms.positions.value
    return m
  }, [simulationMaterial, target.texture])

  // ---------------------------------------------------------------------------
  // Offscreen render scene setup (quad that drives the simulation)
  // ---------------------------------------------------------------------------
  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(
    () =>
      new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        1 / Math.pow(2, 53),
        1
      )
  )

  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0,
        1, -1, 0,
        1,  1, 0,
        -1, -1, 0,
        1,  1, 0,
        -1,  1, 0,
      ])
  )

  const [uvs] = useState(
    () =>
      new Float32Array([
        0, 1,
        1, 1,
        1, 0,
        0, 1,
        1, 0,
        0, 0,
      ])
  )

  // ---------------------------------------------------------------------------
  // Particle data setup (points that sample the simulation texture)
  // ---------------------------------------------------------------------------
  const particles = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      const i3 = i * 3
      particles[i3 + 0] = (i % size) / size // u
      particles[i3 + 1] = i / size / size   // v
      particles[i3 + 2] = 0                 // unused, but keeps it 3D
    }
    return particles
  }, [size])

  // ---------------------------------------------------------------------------
  // Main update loop
  // ---------------------------------------------------------------------------
  useFrame((state, delta) => {
    if (!dofPointsMaterial || !simulationMaterial) return

    // Render simulation to offscreen FBO
    state.gl.setRenderTarget(target)
    state.gl.clear()
    // @ts-ignore
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)

    const currentTime = useManualTime ? manualTime : state.clock.elapsedTime

    // Reveal timing
    if (revealStartTime.current === null) {
      revealStartTime.current = currentTime
    }

    const revealElapsed = currentTime - revealStartTime.current
    const revealProgress = Math.min(revealElapsed / revealDuration, 1.0)
    const easedProgress = 1 - Math.pow(1 - revealProgress, 3)
    const revealFactorBase = easedProgress * 4.0

    // After fully revealed, add a tiny breathing ripple to the reveal radius
    const breathing =
      revealProgress >= 1.0
        ? 0.15 * Math.sin(currentTime * 0.6)
        : 0.0

    const revealFactor = revealFactorBase + breathing

    if (revealProgress >= 1.0 && isRevealing) setIsRevealing(false)

    // -----------------------------------------------------------------------
    // Particle DOF material uniforms
    // -----------------------------------------------------------------------
    dofPointsMaterial.uniforms.uTime.value = currentTime
    dofPointsMaterial.uniforms.uFocus.value = focus
    dofPointsMaterial.uniforms.uBlur.value = aperture

    // Smooth transition between introspection states (controls neon magenta mix)
    easing.damp(
      dofPointsMaterial.uniforms.uTransition,
      "value",
      introspect ? 1.0 : 0.0,
      introspect ? 0.35 : 0.2,
      delta
    )

    // Make size + opacity subtly react to introspection as well
    const targetSize = introspect ? pointSize * 1.15 : pointSize
    const targetOpacity = introspect ? opacity * 1.05 : opacity

    easing.damp(
      dofPointsMaterial.uniforms.uPointSize,
      "value",
      targetSize,
      0.35,
      delta
    )

    easing.damp(
      dofPointsMaterial.uniforms.uOpacity,
      "value",
      targetOpacity,
      0.35,
      delta
    )

    dofPointsMaterial.uniforms.uRevealFactor.value = revealFactor
    dofPointsMaterial.uniforms.uRevealProgress.value = easedProgress

    // -----------------------------------------------------------------------
    // Simulation uniforms (drive the swirl field)
    // -----------------------------------------------------------------------
    // Slightly speed up motion when introspecting
    const effectiveSpeed = introspect ? speed * 1.25 : speed

    simulationMaterial.uniforms.uTime.value = currentTime
    simulationMaterial.uniforms.uNoiseScale.value = noiseScale
    simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity
    simulationMaterial.uniforms.uTimeScale.value = timeScale * effectiveSpeed
  })

  // ---------------------------------------------------------------------------
  // Render particles
  // ---------------------------------------------------------------------------
  return (
    <>
      {createPortal(
        // Simulation render mesh (full-screen quad in the offscreen scene)
        // @ts-ignore
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        // @ts-ignore
        scene
      )}

      {/* Particle points sampling from the simulation texture */}
      {/* @ts-ignore */}
      <points material={dofPointsMaterial} {...props}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
      </points>

      {/* Optional debug plane to visualize the simulation texture */}
      {/* 
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={target.texture} />
      </mesh> 
      */}
    </>
  )
}