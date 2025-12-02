// flicker.glsl
float flicker(float t, float intensity){
    return sin(t*22.0) * 0.02 * intensity +
           sin(t*7.7) * 0.03 * intensity +
           sin(t*3.1) * 0.05 * intensity;
}