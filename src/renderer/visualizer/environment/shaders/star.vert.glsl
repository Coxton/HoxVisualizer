attribute float aSize;
attribute float aBrightness;

attribute vec3 aMovement;
attribute float aPhase;

uniform float uTime;

varying float vBrightness;

void main() {

    vec3 animatedPosition =
    position;

    animatedPosition +=
        aMovement *
        uTime *
        0.08;

    animatedPosition.x +=
        sin(
            uTime * 0.015 +
            aPhase
        ) *
        aMovement.x;

    animatedPosition.y +=
        sin(
            uTime * 0.012 +
            aPhase * 1.37
        ) *
        aMovement.y;

    animatedPosition.z +=
        cos(
            uTime * 0.010 +
            aPhase * 0.73
        ) *
        aMovement.z;

    vec4 mvPosition =
        modelViewMatrix *
        vec4(
            animatedPosition,
            1.0
        );

    float distance =
        length(
            mvPosition.xyz
        );

    gl_Position =
        projectionMatrix *
        mvPosition;

    gl_PointSize =
        aSize *
        100.0;

    vBrightness =
        aBrightness *
        clamp(
            1.0 -
            distance / 220.0,
            0.85,
            1.0
        );
}