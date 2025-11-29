import * as THREE from "three"
import { periodicNoiseGLSL } from "./utils"

// ---------------------------------------------------------------------------
// Helper function: generates equally spaced particle positions on a plane
// ---------------------------------------------------------------------------
function getPlane(
  count: number,
  components: number,
  size: number = 512,
  scale: number = 1.0
) {
  const length = count * components
  const data = new Float32Array(length)

  for (let i = 0; i < count; i++) {
    const i4 = i * components

    // Calculate grid position
    const x = (i % size) / (size - 1.0)
    const z = Math.floor(i / size) / (size - 1.0)

    // Center coordinates in [-0.5, 0.5] range, then scale
    data[i4 + 0] = (x - 0.5) * 2.0 * scale
    data[i4 + 1] = 0.0
    data[i4 + 2] = (z - 0.5) * 2.0 * scale
    data[i4 + 3] = 1.0 // W component for RGBA
  }

  return data
}

// ---------------------------------------------------------------------------
// SimulationMaterial: animates the particle positions with swirl + waves
// ---------------------------------------------------------------------------
export class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(scale: number = 10.0) {
    // Initial particle positions baked into a floating-point texture
    const positionsTexture = new THREE.DataTexture(
      getPlane(512 * 512, 4, 512, scale),
      512,
      512,
      THREE.RGBAFormat,
      THREE.FloatType
    )
    positionsTexture.needsUpdate = true

    super({
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D positions;
        uniform float uTime;
        uniform float uNoiseScale;
        uniform float uNoiseIntensity;
        uniform float uTimeScale;
        uniform float uLoopPeriod;
        varying vec2 vUv;

        ${periodicNoiseGLSL}

        void main() {
          // Original particle position from the static texture
          vec3 originalPos = texture2D(positions, vUv).rgb;

          // Time remapped to radians for a perfectly looping cycle
          float t = uTime * uTimeScale * (6.28318530718 / uLoopPeriod);

          // ------------------------------------------------------------
          // 1) Swirl around Y axis with a breathing radius
          // ------------------------------------------------------------
          float radius = length(originalPos.xz);
          float baseAngle = atan(originalPos.z, originalPos.x);

          // Swirl is stronger near the center and modulated over time
          float swirlStrength = 0.45;
          float swirlMask = 1.0 - smoothstep(0.0, 1.6, radius);
          float swirlAngle = baseAngle + swirlStrength * swirlMask * (0.6 * sin(t) + 0.4 * t);

          // Breathing radius (subtle in/out motion)
          float breath = 1.0 + 0.08 * sin(t * 0.8 + radius * 2.5);
          float r = radius * breath;

          vec2 swirlXZ = vec2(cos(swirlAngle), sin(swirlAngle)) * r;

          // ------------------------------------------------------------
          // 2) Vertical waves depending on radius and angle
          // ------------------------------------------------------------
          float radialWave = sin(radius * 7.0 - t * 1.4) * 0.10;
          float angularWave = cos(baseAngle * 3.0 + t * 1.1) * 0.06;

          float yWave = radialWave + angularWave;

          vec3 swirlPos = vec3(swirlXZ.x, originalPos.y + yWave, swirlXZ.y);

          // ------------------------------------------------------------
          // 3) Layered periodic noise on top of the swirl field
          // ------------------------------------------------------------
          vec3 noiseInput = swirlPos * uNoiseScale;

          // Three phased noise samples for richer motion
          float n1 = periodicNoise(noiseInput + vec3(0.0, 0.0, 0.0), t);
          float n2 = periodicNoise(noiseInput + vec3(37.0, 11.0, -5.0), t * 1.21);
          float n3 = periodicNoise(noiseInput + vec3(-19.0, 23.0, 9.0), t * 0.83);

          // Combine into axis-specific displacements
          float displacementX = n1;
          float displacementY = (n2 * 0.7 + n3 * 0.3);
          float displacementZ = n3;

          vec3 distortion = vec3(displacementX, displacementY, displacementZ) * uNoiseIntensity;

          // Final position: elegant swirl + breathing + layered noise
          vec3 finalPos = swirlPos + distortion;

          gl_FragColor = vec4(finalPos, 1.0);
        }
      `,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        // Tuned defaults for smoother, more interesting motion
        uNoiseScale: { value: 1.2 },
        uNoiseIntensity: { value: 0.6 },
        uTimeScale: { value: 1.1 },
        uLoopPeriod: { value: 32.0 },
      },
    })
  }
}