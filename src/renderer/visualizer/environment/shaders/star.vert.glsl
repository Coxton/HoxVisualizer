attribute float aSize;
attribute float aBrightness;

varying float vBrightness;

void main() {

    vec4 mvPosition =
        modelViewMatrix *
        vec4(position, 1.0);

    float distance =
        length(mvPosition.xyz);

    gl_Position =
        projectionMatrix *
        mvPosition;

    gl_PointSize =
        aSize * 100.0;

    vBrightness =
        aBrightness *
        clamp(
            1.0 - distance / 220.0,
            0.85,
            1.0
        );
}