varying float vBrightness;

void main() {

    vec2 uv =
        gl_PointCoord -
        0.5;

    float distance =
        length(uv);

    if (distance > 0.5) {
        discard;
    }

    float glow =
        1.0 -
        smoothstep(
            0.0,
            0.5,
            distance
        );

    float core =
        1.0 -
        smoothstep(
            0.0,
            0.16,
            distance
        );

    float brightness =
        (
            core +
            glow * 0.35
        ) *
        vBrightness;

    gl_FragColor =
        vec4(
            vec3(brightness),
            brightness
        );
}