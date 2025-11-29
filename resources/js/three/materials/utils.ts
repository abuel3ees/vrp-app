// Shader utility functions & shared GLSL snippets
// ------------------------------------------------------------

// Periodic noise tuned for smooth looping particle motion.
// Uses only integer multiples of time so animations are perfectly
// periodic over 2π (or clean fractions of it).
export const periodicNoiseGLSL = /* glsl */ `
  // Periodic noise function using layered sine and cosine waves.
  // p   : position in "field space"
  // time: global time parameter (in radians, usually scaled externally)
  float periodicNoise(vec3 p, float time) {
    // Multiple frequency components for richer motion.
    // All time multipliers are integer values to keep things looping nicely.

    float noise = 0.0;

    // Primary wave - period ≈ 2π
    noise += sin(p.x * 2.0 + time) * cos(p.z * 1.5 + time);

    // Secondary wave - period ≈ π (time * 2.0)
    noise += sin(p.x * 3.2 + time * 2.0)
          * cos(p.z * 2.1 + time) * 0.6;

    // Tertiary wave - period ≈ 2π/3 (time * 3.0)
    noise += sin(p.x * 1.7 + time)
          * cos(p.z * 2.8 + time * 3.0) * 0.4;

    // Cross-frequency interaction - period ≈ π (time * 2.0)
    noise += sin(p.x * p.z * 0.5 + time * 2.0) * 0.3;

    // Scale down the overall amplitude to keep it subtle by default.
    return noise * 0.3;
  }
`;