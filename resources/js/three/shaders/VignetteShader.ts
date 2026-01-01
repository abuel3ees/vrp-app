// ---------------------------------------------------------------------------
// Simple vignette shader for postprocessing
// Designed to be used with THREE.ShaderPass
// ---------------------------------------------------------------------------

import * as THREE from "three"

interface ShaderDefinition {
  uniforms: { [uniform: string]: THREE.IUniform };
  vertexShader: string;
  fragmentShader: string;
}

export const VignetteShader: ShaderDefinition = {
  uniforms: {
    tDiffuse: { value: null }, // main scene texture
    darkness: { value: 1.0 }, // how strong the vignette fades
    offset: { value: 1.0 }, // how far from center the vignette begins
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    varying vec2 vUv;
    
    void main() {
      // sample the rendered scene
      vec4 texel = texture2D(tDiffuse, vUv);

      // distance from center in normalized coordinates
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = dot(uv, uv);

      // smooth falloff for vignette edge
      float vignette = 1.0 - smoothstep(offset, offset + darkness, dist);

      // apply vignette by darkening edges
      gl_FragColor = vec4(texel.rgb * vignette, texel.a);
    }
  `,
}