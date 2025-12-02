// curlNoise.glsl
vec3 snoiseVec3(vec3 x);
float snoise(vec3 v);

vec3 curlNoise(vec3 p){
    const float e = .1;
    float nx = snoise(vec3(p.x, p.y + e, p.z)) - snoise(vec3(p.x, p.y - e, p.z));
    float ny = snoise(vec3(p.x, p.y, p.z + e)) - snoise(vec3(p.x, p.y, p.z - e));
    float nz = snoise(vec3(p.x + e, p.y, p.z)) - snoise(vec3(p.x - e, p.y, p.z));
    const float divisor = 1.0 / (2.0 * e);
    return normalize(vec3(nx, ny, nz) * divisor);
}

float mod289(float x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }

float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);

    vec3 g=step(x0.yzx, x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz, l.zxy);
    vec3 i2=max(g.xyz, l.zxy);

    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;

    i=mod289(i);
    vec4 p=permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0+1.0;
    vec4 s1 = floor(b1)*2.0+1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
    norm *= 1.79284291400159 - 0.85373472095314 * norm;

    vec4 m = max(0.0, 0.5 - vec4(
        dot(p0,p0),
        dot(p1,p1),
        dot(p2,p2),
        dot(p3,p3)));

    m = m*m;
    return 42.0 * dot(m*m, vec4(
        dot(p0,v),
        dot(p1,v),
        dot(p2,v),
        dot(p3,v)));
}

vec3 snoiseVec3(vec3 x){
    return vec3(
        snoise(vec3(x.x, x.y, x.z)),
        snoise(vec3(x.y, x.z, x.x)),
        snoise(vec3(x.z, x.x, x.y))
    );
}