// neonPulse.glsl
vec3 neonPulse(vec3 color, float t){
    float pulse = 0.5 + 0.5*sin(t*2.2) + 0.25*sin(t*5.7);
    return color * (0.7 + pulse*0.6);
}